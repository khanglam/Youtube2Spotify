# from crypt import methods
from lib2to3.pgen2 import token
from flask_cors import CORS, cross_origin
import json
import os
from flask import jsonify, render_template, url_for, flash, redirect, request, session
from server import app, db, bcrypt
from server.forms import RegistrationForm, LoginForm
from server.models import User, Post
from flask_login import login_user, logout_user, current_user, login_required
import base64
from spotipy.oauth2 import SpotifyOAuth
import lyricsgenius as lg

# Youtube API Libraries
import pickle #library to store/load bytes file
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

@app.route("/@me")
def get_current_user():
    user_id = current_user.get_id()
    if(not user_id):
        return jsonify({
            "error":"Unauthorized"
        }), 401
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "username" : user.username
    })

@app.route("/about")
def about():
    return render_template('about.html', title='About')


@app.route("/registertest", methods=['GET', 'POST'])
def oldRegister():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data,
                    password=hashed_password)  # Creating entry for DB
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/register", methods=['GET', 'POST'])
def register():
    username = request.json["username"]
    password = request.json["password"]

    user_exists = User.query.filter_by(username=username).first() is not None

    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.get_id()).first()
        return jsonify({
            "errorMessage": "You're currently logged in as: "+user.username+". Please logout first to register"
        }), 409

    if user_exists:
        return jsonify({"errorMessage": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password=hashed_password)  # Creating entry for DB
    db.session.add(user)
    db.session.commit()

    return "Success! Account Successfully Created: " + user.username
    


@app.route("/logintest", methods=['GET', 'POST'])
def oldLogin():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/login", methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]
    remember_me = request.json["remember_me"]

    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"username": "Invalid User"}), 401
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"password": "Wrong Password"}), 401
    login_user(user, remember=remember_me)

    return jsonify({
        "id" : user.id,
        "username": user.username
    })


@app.route("/logout", methods=['POST'])
def logout():
    logout_user()
    return "200"

@app.route("/account")
@login_required
def account():
    return render_template('account.html', title='Account')

# Spotify configuration
CLIENT_ID = os.environ["CLIENT_ID"]
CLIENT_SECRET = os.environ["CLIENT_SECRET"]
GENIUS_ACCESS_TOKEN = os.environ["GENIUS_ACCESS_TOKEN"]

# Initial Spotify Login Authentication.
TOKEN_INFO = "token_info"
@app.route("/loginSpotify", methods=['GET'])
def loginSpotify():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    # session.clear()
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_INFO] = token_info
    return token_info

# Function to check if token has expired and refresh if needed.
# This function gets called to get token.
@app.route("/refreshSpotifyToken", methods=['GET'])
def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        return loginSpotify()
        
    # If token exists, refresh the token
    sp_oauth = create_spotify_oauth()
    token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    session[TOKEN_INFO] = token_info
    return token_info

@app.route("/spotifyLyrics", methods=['GET'])
def get_spotify_lyrics():
    track = request.args.get("track")
    artist = request.args.get("artist")

    genius = lg.Genius(GENIUS_ACCESS_TOKEN)
    song = genius.search_song(title=track, artist=artist)
    lyrics = song.lyrics
    return jsonify({
        "lyrics": lyrics
    })

# Create Spotify OAuth Object
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri='http://localhost:3000/Spotify',
        # scope="user-library-read streaming user-read-email user-read-private user-library-modify user-read-playback-state user-modify-playback-state"
        scope="user-library-read streaming"
    )

# Youtube Configurations (Copied from YouTube)
api_service_name = "youtube"
api_version = "v3"
client_secrets_file = "yt_client_secrets.json"
scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

# Get credentials and create an API client
@app.route("/loginYoutube", methods=['GET'])
def get_youtube_client():
    credentials = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token: # rb - read bytes
            credentials = pickle.load(token)
     # If there are no valid credentials available, then either refresh the token or log in.
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            print('Refreshing Access Token...')
            credentials.refresh(Request())
        else:
            print('Fetching New Tokens...')
            flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file,scopes)
            flow.run_local_server(port=3000, prompt='consent', authorization_prompt_message='') #prompt=consent is the fix for refresh token solution.
            # flow.run_console() #- Deprecated and is no longer supported. Check out https://developers.googleblog.com/2022/02/making-oauth-flows-safer.html?m=1#disallowed-oob
            credentials = flow.credentials

            # Save the credentials for the next run - wb = write byte
            with open('token.pickle', 'wb') as f:
                print('Saving Credentials for Future Use...')
                pickle.dump(credentials, f)
    youtube_client = build(api_service_name, api_version, credentials=credentials)
    return youtube_client

@app.route("/getYtPlaylist", methods=['GET', 'POST'])
def get_yt_playlist():
    youtube_client = get_youtube_client()
    request = youtube_client.playlists().list(
        part="contentDetails,snippet,id",
        maxResults=25,
        mine=True
    )
    response = request.execute()
    return response

@app.route("/getYtChannel", methods=['GET'])
def get_yt_channelInfo():
    youtube_client = get_youtube_client()
    request = youtube_client.channels().list(
        part="snippet,contentDetails,statistics",
        mine=True
    )
    response = request.execute()
    channel_name = response["items"][0]["snippet"]["title"]

    return channel_name
