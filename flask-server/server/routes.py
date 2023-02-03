# from crypt import methods
from distutils.log import error
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

# Spotify Libraries
from spotipy.oauth2 import SpotifyOAuth
import lyricsgenius as lg
import requests

# Youtube API Libraries
import pickle #library to store/load bytes file
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
# from google.oauth2.credentials import credentials
from google.auth.exceptions import RefreshError
import youtube_dl

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
            form.password.body).decode('utf-8')
        user = User(username=form.username.body, email=form.email.body,
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
        user = User.query.filter_by(email=form.email.body).first()
        if user and bcrypt.check_password_hash(user.password, form.password.body):
            login_user(user, remember=form.remember.body)
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

# ──────────────────────────────────────────────────────────────────────────────────────────────────────────
# ─██████████████─██████████████─██████████████─██████████████─██████████─██████████████─████████──████████─
# ─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░██─██░░░░░░░░░░██─██░░░░██──██░░░░██─
# ─██░░██████████─██░░██████░░██─██░░██████░░██─██████░░██████─████░░████─██░░██████████─████░░██──██░░████─
# ─██░░██─────────██░░██──██░░██─██░░██──██░░██─────██░░██───────██░░██───██░░██───────────██░░░░██░░░░██───
# ─██░░██████████─██░░██████░░██─██░░██──██░░██─────██░░██───────██░░██───██░░██████████───████░░░░░░████───
# ─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░██──██░░██─────██░░██───────██░░██───██░░░░░░░░░░██─────████░░████─────
# ─██████████░░██─██░░██████████─██░░██──██░░██─────██░░██───────██░░██───██░░██████████───────██░░██───────
# ─────────██░░██─██░░██─────────██░░██──██░░██─────██░░██───────██░░██───██░░██───────────────██░░██───────
# ─██████████░░██─██░░██─────────██░░██████░░██─────██░░██─────████░░████─██░░██───────────────██░░██───────
# ─██░░░░░░░░░░██─██░░██─────────██░░░░░░░░░░██─────██░░██─────██░░░░░░██─██░░██───────────────██░░██───────
# ─██████████████─██████─────────██████████████─────██████─────██████████─██████───────────────██████───────
# ──────────────────────────────────────────────────────────────────────────────────────────────────────────

CLIENT_ID = os.environ["CLIENT_ID"]
CLIENT_SECRET = os.environ["CLIENT_SECRET"]
GENIUS_ACCESS_TOKEN = os.environ["GENIUS_ACCESS_TOKEN"]

# Initial Spotify Login Authentication.
TOKEN_INFO = "token_info"

@app.route("/loginSpotify", methods=['GET'])
def loginSpotify():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()  # Get the URL that Spotify API Opens Automatically
    code = request.args.get("code")          # fetch for the code inside that auth_url.
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

@app.route("/clearSpotifyCache", methods=['GET'])
def clearSpotifyCache():
    sp_oauth = create_spotify_oauth()
    sp_oauth.cache_handler.save_token_to_cache(None)
    return "Cleared"

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

def get_spotify_uri(song_name, artist):
    token_info = get_token()
    #Search for Song
    query = "https://api.spotify.com/v1/search?q=track%3A{}artist%3A{}&type=track&offset=0&limit=20".format(
        song_name,
        artist
    )
    response = requests.get(
        query,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(token_info["access_token"])
        }
    )

    response_json = response.json()
    songs = response_json["tracks"]["items"]
    # only use the first song
    uri = songs[0]["uri"]

    return uri

@app.route("/addSongsToPlaylist", methods=['POST'])
def add_song_to_playlist():
    songs = request.json['songs']
    playlist_name = request.json['playlist_name']

    try:
        token_info = get_token()
        headers = {
            "Authorization": "Bearer {}".format(token_info["access_token"]),
            "Content-Type": "application/json"
        }
        # body of new playlist to be created
        body = {
            "name": playlist_name,
            "description": "Imported songs from Youtube Playlist",
            "public": True
        }
        # Fetch user_id
        user_reponse = requests.get("https://api.spotify.com/v1/me", headers=headers)
        user_id = user_reponse.json()["id"]

        # Check if playlist already exists and store its playlist_id
        response = requests.get("https://api.spotify.com/v1/me/playlists", headers=headers)
        existingPlaylists = response.json()["items"]
        playlist_id = None
        is_playlist_created_messsage = None
        is_song_added_messsage = None

        for item in existingPlaylists:
            if playlist_name == item["name"]:
                playlist_id = item["id"]
                is_playlist_created_messsage = f"Playlist '{playlist_name}' already exists."
                break
        # Create playlist only if playlist does not already exist
        if not playlist_id:
            url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
            response = requests.post(url, headers=headers, json=body)

            if response.status_code == 201:
                is_playlist_created_messsage = f"Successfully created playlist '{playlist_name}'"
                playlist_id = response.json()["id"]
                
            else:
                is_playlist_created_messsage = f"Failed to create playlist. Error: {response.status_code}"
                return is_playlist_created_messsage
            
        # Get playlist items and Add to playlist has the same endpoint
        playlist_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"

        # Fetch all items existing in that playlist and remove them from our request (songs) if they already exist
        try:
            response = requests.get(playlist_url, headers=headers)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from Spotify API: {e}")
        else:
            playlist_items = response.json()["items"]
            playlist_items_uris = [item["track"]["uri"] for item in playlist_items]

        uris, titles, artists = [], [], []
        for song in songs:
            uri = song["uri"]
            title = song["title"]
            artist = song["artist"]
            if uri in playlist_items_uris:
                print("Song already exists, skipping: ", title)
                continue
            uris.append(uri)
            titles.append(title)
            artists.append(artist)

        # If uris is empty, then songs already exist.
        if not uris:
            is_song_added_messsage = "No songs were added. Perhaps because these songs already exist"
            return jsonify({
                "is_playlist_created_messsage": is_playlist_created_messsage,
                "is_song_added_messsage": is_song_added_messsage
            })
        # Otherwise, add songs to the playlist
        data = {
            "uris": uris
        }
        response = requests.post(playlist_url, headers=headers, json=data)
        # check for valid response status
        if response.status_code != 201:
            is_song_added_messsage = f"Failed to add songs. Error:  {response.status_code}" # Created Playlist but not added songs
        else: 
            is_song_added_messsage =  f"Successfully added {len(songs)} songs."
        
        return jsonify({
            "is_playlist_created_messsage": is_playlist_created_messsage,
            "is_song_added_messsage": is_song_added_messsage
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create Spotify OAuth Object
def create_spotify_oauth():
    return SpotifyOAuth(
        show_dialog=True,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri='http://localhost:3000/Spotify',
        scope="user-library-read user-library-modify streaming app-remote-control user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"
    )


# ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# ─████████──████████─██████████████─██████──██████─██████████████─██████──██████─██████████████───██████████████─
# ─██░░░░██──██░░░░██─██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░██───██░░░░░░░░░░██─
# ─████░░██──██░░████─██░░██████░░██─██░░██──██░░██─██████░░██████─██░░██──██░░██─██░░██████░░██───██░░██████████─
# ───██░░░░██░░░░██───██░░██──██░░██─██░░██──██░░██─────██░░██─────██░░██──██░░██─██░░██──██░░██───██░░██─────────
# ───████░░░░░░████───██░░██──██░░██─██░░██──██░░██─────██░░██─────██░░██──██░░██─██░░██████░░████─██░░██████████─
# ─────████░░████─────██░░██──██░░██─██░░██──██░░██─────██░░██─────██░░██──██░░██─██░░░░░░░░░░░░██─██░░░░░░░░░░██─
# ───────██░░██───────██░░██──██░░██─██░░██──██░░██─────██░░██─────██░░██──██░░██─██░░████████░░██─██░░██████████─
# ───────██░░██───────██░░██──██░░██─██░░██──██░░██─────██░░██─────██░░██──██░░██─██░░██────██░░██─██░░██─────────
# ───────██░░██───────██░░██████░░██─██░░██████░░██─────██░░██─────██░░██████░░██─██░░████████░░██─██░░██████████─
# ───────██░░██───────██░░░░░░░░░░██─██░░░░░░░░░░██─────██░░██─────██░░░░░░░░░░██─██░░░░░░░░░░░░██─██░░░░░░░░░░██─
# ───────██████───────██████████████─██████████████─────██████─────██████████████─████████████████─██████████████─
# ────────────────────────────────────────────────────────────────────────────────────────────────────────────────

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
            try:
                print('...Refreshing Access Token...')
                credentials.refresh(Request())
            except RefreshError:
                print('...FAILED to Refresh Access Token...')
                print('...Fetching New Tokens...')
                flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file,scopes)
                flow.run_local_server(port=3000, prompt='consent', authorization_prompt_message='') #prompt=consent is the fix for refresh token solution.
                credentials = flow.credentials
                credentials.refresh
        else:
            print('...Fetching New Tokens...')
            flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file,scopes)
            flow.run_local_server(port=3000, prompt='consent', authorization_prompt_message='') #prompt=consent is the fix for refresh token solution.
            # flow.run_console() #- Deprecated and is no longer supported. Check out https://developers.googleblog.com/2022/02/making-oauth-flows-safer.html?m=1#disallowed-oob
            credentials = flow.credentials
            credentials.refresh
            
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

@app.route("/getYtAlbumSongs", methods=['GET'])
def get_yt_albumSongs():
    playlistId = request.args.get("playlistId")
    all_song_info = [{}] #This needs to be a list of dictionaries so we can use map() function in React
    youtube_client = get_youtube_client()
    youtube_dl.utils.std_headers['User-Agent'] = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"

    req = youtube_client.playlistItems().list(
        part="contentDetails,snippet,id",
        playlistId=playlistId,
        maxResults=50,
    )
    response = req.execute()
    for item in response["items"]:
        video_title = item["snippet"]["title"]
        youtube_url = "https://www.youtube.com/watch?v={}".format(item["contentDetails"]["videoId"])
        song_name = None
        artist = None
        try:
            # use youtube_dl to collect the song name & artist name
            video = youtube_dl.YoutubeDL({}).extract_info(youtube_url, download=False)
            song_name = video["track"]
            artist = video["artist"]

            if song_name and artist:
                # save all important info and skip any missing song and artist
                all_song_info.append({
                    "youtube_url": youtube_url,
                    "song_name": song_name,
                    "artist": artist,
                    "video_title": video_title,
                    # add the uri, easy to get song to put into playlist
                    "spotify_uri": get_spotify_uri(video_title)
                }) 
        except:
            all_song_info.append({
                "youtube_url": youtube_url,
                "song_name": song_name,
                "artist": artist,
                "video_title": video_title,
                # add the uri, easy to get song to put into playlist
                "spotify_uri": None
            }) 

    all_song_info.pop(0) # Useless first item of empty object
    return {
        "response":response,
        "all_song_info" : all_song_info
    }
