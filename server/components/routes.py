# from crypt import methods
import os
import json
from flask import jsonify, render_template, url_for, flash, redirect, request, session
from components import app, db, bcrypt
from components.forms import RegistrationForm, LoginForm
from components.models import User
from flask_login import login_user, logout_user, current_user, login_required

# Spotify Libraries
from spotipy.oauth2 import SpotifyOAuth
# import lyricsgenius as lg
# from bs4 import BeautifulSoup
# import re
import requests
from spotipy.cache_handler import MemoryCacheHandler
import spotipy
import uuid
from urllib.request import Request, urlopen

# Youtube API Libraries
import pickle #library to store/load bytes file
import google.auth.exceptions
import google_auth_oauthlib.flow
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
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

@app.route("/change_password", methods=['POST'])
@login_required
def change_password():
    current_password = request.json["current_password"]
    new_password = request.json["new_password"]
    confirm_new_password = request.json["confirm_password"]

    if current_user.is_authenticated:
        if not bcrypt.check_password_hash(current_user.password, current_password):
            return jsonify({"errorMessage": "Current password is incorrect"}), 401

        if new_password != confirm_new_password:
            return jsonify({"errorMessage": "New password and confirmation do not match"}), 402
    else:
        return jsonify({"errorMessage": "You are NOT logged in"}), 403
    
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    current_user.password = hashed_password
    db.session.commit()

    return "Success! Password successfully changed"

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
    

# Unused Method
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

SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
GENIUS_ACCESS_TOKEN = os.environ.get("GENIUS_ACCESS_TOKEN")

# Initial Spotify Login Authentication.
SPOT_TOKEN_INFO = "spotify_token_info"

# Create Spotify OAuth Object
sp_oauth = SpotifyOAuth(
    show_dialog=True,
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri= os.environ.get("SPOTIFY_REDIRECT_URL", "http://localhost:5000/spotifyCallback"),
    scope="user-library-read user-library-modify streaming app-remote-control user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"
)

# Function to check if token exists and refresh if expired.
@app.route("/getSpotifyToken", methods=['GET'])
def get_spotify_token():
    token_info = session.get(SPOT_TOKEN_INFO, None)
    if not token_info:
        return authorizeSpotify()
        
    # If token exists, refresh the token
    token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    session[SPOT_TOKEN_INFO] = token_info
    return token_info


@app.route("/authorizeSpotify")
def authorizeSpotify():
    # Generate a unique state value to prevent CSRF attacks
    state = str(uuid.uuid4())
    session["spotify_auth_state"] = state
    # Redirect the user to Spotify's authorization page
    auth_url = sp_oauth.get_authorize_url(state=state)
    return auth_url

@app.route('/spotifyCallback')
def callback_spotify():
    # Verify the state parameter to prevent CSRF attacks
    expected_state = session.pop("spotify_auth_state", None)
    if expected_state is None or expected_state != request.args.get("state"):
        return jsonify(error="State Mismatch"), 400
    
    # Get the authorization code from the query parameters
    auth_code = request.args.get("code")

    # Exchange the authorization code for an access token
    token_info = sp_oauth.get_access_token(auth_code)

    # Save the token info to the session
    session[SPOT_TOKEN_INFO] = token_info

    return "Spotify Authenticated Successfully. You may now close this window."

@app.route("/clearSpotifyCache", methods=['GET'])
def clearSpotifyCache():
    sp_oauth.cache_handler.save_token_to_cache(None)
    if SPOT_TOKEN_INFO in session:
        revokeSpotify()
        del session[SPOT_TOKEN_INFO]
    return "Cleared"

def revokeSpotify():
    token_info = get_spotify_token()
    headers = {
        "Authorization": "Bearer {}".format(token_info["access_token"]),
        "Content-Type": "application/json"
    }
    response = requests.get("https://api.spotify.com/v1/me/playlists?limit=50", headers=headers)
    if response.status_code == 200:
        return "Access token successfully revoked."
    else:
        return "Failed to revoke access token."

@app.route("/spotifyLyrics", methods=['GET'])
def get_spotify_lyrics():
    track = request.args.get("track")
    artist = request.args.get("artist")
    response = requests.get(f"https://lyrist.vercel.app/api/{track}/{artist}")   
    if response.status_code == 200:
        return response.json()
    else:
        return jsonify({
            "lyrics": "Error"
        })


def get_spotify_uri(song_name, artist):
    token_info = get_spotify_token()
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

@app.route("/getSpotifyPlaylists", methods=['GET'])
def get_spotify_playlists():
    token_info = get_spotify_token()
    headers = {
        "Authorization": "Bearer {}".format(token_info["access_token"]),
        "Content-Type": "application/json"
    }

    response = requests.get("https://api.spotify.com/v1/me/playlists?limit=50", headers=headers)
    existingPlaylists = response.json()["items"]
    return {"existing_playlists": existingPlaylists}

@app.route("/addSongsToPlaylist", methods=['POST'])
def add_song_to_playlist():
    songs = request.json['songs']
    playlist_name = request.json['playlist_name']

    token_info = get_spotify_token()
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


    try:
        token_info = get_spotify_token()
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
        response = requests.get("https://api.spotify.com/v1/me/playlists?limit=50", headers=headers)
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
                is_playlist_created_messsage = f"Failed to create playlist: {playlist_name}. Error Code: {response.status_code}"
                raise Exception(is_playlist_created_messsage)
            
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
                "is_song_added_messsage": is_song_added_messsage,
            })
        # Otherwise, add songs to the playlist
        data = {
            "uris": uris
        }
        response = requests.post(playlist_url, headers=headers, json=data)
        # check for valid response status
        if response.status_code != 201:
            is_song_added_messsage = f"Failed to add songs. Error:  {response.status_code}" # Created Playlist but not added songs
            raise Exception(is_playlist_created_messsage+". "+is_song_added_messsage)
        else: 
            is_song_added_messsage =  f"Successfully added {len(songs)} songs."
        
        return jsonify({
            "is_playlist_created_messsage": is_playlist_created_messsage,
            "is_song_added_messsage": is_song_added_messsage,
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
YT_CLIENT_ID = os.environ.get("YT_CLIENT_ID")
YT_CLIENT_SECRET = os.environ.get("YT_CLIENT_SECRET")
scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

def get_youtube_client():
    if 'credentials' not in session:
        return None

    # Load credentials from the session.
    credentials = Credentials(**session['credentials'])
    # Save credentials back to session in case access token was refreshed.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    session['credentials'] = credentials_to_dict(credentials)   
    youtube_client = build(api_service_name, api_version, credentials=credentials)
    return youtube_client

@app.route('/authorizeYoutube')
def authorizeYoutube():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.

    # This works as well, but using yt_client_secrets.json file
    # flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    #     client_secrets_file, scopes=scopes)
    # flow.redirect_uri = url_for('callback_youtube', _external=True)

    # url_for works here because it basically appends the route of the 'method' to whatever URL we're currently on.

    # The URI created here must exactly match one of the authorized redirect URIs
    # for the OAuth 2.0 client, which you configured in the API Console. If this
    # value doesn't match an authorized URI, you will get a 'redirect_uri_mismatch'
    # error.
    
    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        client_config={
            "web": {
                "client_id": YT_CLIENT_ID,
                "client_secret": YT_CLIENT_SECRET,
                "redirect_uri": os.environ.get("YT_REDIRECT_URI", "http://localhost:5000/youtubeCallback"),
                "project_id": "youtube2spotify-358502",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "javascript_origins": [
                "https://server.youtube2spotify.site",
                "https://youtube2spotify.site"
                ]
            }
        },
        scopes=scopes
    )

    # Not using this method because we'd have to remove _scheme='https' to run in dev mode every time, which gets annoying.
    # flow.redirect_uri = url_for('callback_youtube', _external=True, _scheme='https') <- also works but only for prod
    flow.redirect_uri = os.environ.get("YT_REDIRECT_URI", "http://localhost:5000/youtubeCallback")
    
    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true')
    
    # Store the state so the callback can verify the auth server response.
    session['state'] = state
    return authorization_url

@app.route('/youtubeCallback')
def callback_youtube():
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
    # state - randomly generated 'value' in response to correspond to the request 'key' for better security
    
    # This works as well, but using yt_client_secrets.json file
    # flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    #     client_secrets_file, scopes=scopes, state=state)
    # flow.redirect_uri = url_for('callback_youtube', _external=True)

    state = session.get('state')
    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        client_config={
            "web": {
                "client_id": YT_CLIENT_ID,
                "client_secret": YT_CLIENT_SECRET,
                "redirect_uri": os.environ.get("YT_REDIRECT_URI", "http://localhost:5000/youtubeCallback"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            }
        }, 
        scopes=scopes,
        state=state
    )
    # Not using this method because we'd have to remove _scheme='https' to run in dev mode every time.
    # flow.redirect_uri = url_for('callback_youtube', _external=True, _scheme='https') <- also works but only for prod
    flow.redirect_uri = os.environ.get("YT_REDIRECT_URI", "http://localhost:5000/youtubeCallback")

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.url.replace("http://", "https://")

    flow.fetch_token(authorization_response=authorization_response)


    # Store credentials in the session.
    # TODO: store credentials in a database instead.
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)

    return "Authentication complete. You may close this window"

@app.route("/getYtChannel", methods=['GET'])
def get_yt_channel_info():
    try:
        youtube_client = get_youtube_client()
        # Check if the access token is present in the session.
        if not youtube_client:
            return redirect('/authorizeYoutube')

        request = youtube_client.channels().list(
            part="snippet,contentDetails,statistics",
            mine=True
        )
        response = request.execute()
        channel_name = response["items"][0]["snippet"]["title"]
        return channel_name
    except google.auth.exceptions.RefreshError:
        clear_yt_credentials()
        return redirect('/authorizeYoutube')
    except KeyError:
        return "Not An Eligible Youtube Account"

    

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


@app.route('/logoutYt', methods=['GET'])
def clear_yt_credentials():
    if 'credentials' in session:
        revoke()
        del session['credentials']
    return "Cleared and Revoked Credentials for Youtube"

@app.route('/revokeYt')
def revoke():
    if 'credentials' not in session:
        return ('You need to <a href="/authorizeYoutube">authorize</a> before ' +
            'testing the code to revoke credentials.')

    credentials = Credentials(**session['credentials'])

    revoke = requests.post('https://oauth2.googleapis.com/revoke',
        params={'token': credentials.token},
        headers = {'content-type': 'application/x-www-form-urlencoded'})

    status_code = getattr(revoke, 'status_code')
    if status_code == 200:
        return('Credentials successfully revoked.')
    else:
        return('An error occurred. Error code: ', status_code)

@app.route('/mySession')
def mySession():
    return jsonify(session)

def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}

# (THIS FUNCTION IS DEPRECATED)
# Get credentials and create an API client 
def get_youtube_client_deprecated():
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
                flow.run_local_server(port=3000, prompt='consent', authorization_prompt_message='') #This is for local only
                credentials = flow.credentials
                credentials.refresh
        else:
            print('...Fetching New Tokens...')
            flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file,scopes)
            flow.run_local_server(port=3000, prompt='consent', authorization_prompt_message='') #This is for localhost only
            # flow.run_console() # - Deprecated and is no longer supported. Check out https://developers.googleblog.com/2022/02/making-oauth-flows-safer.html?m=1#disallowed-oob
            credentials = flow.credentials
            credentials.refresh
            
        # Save the credentials for the next run - wb = write byte
        with open('token.pickle', 'wb') as f:
            print('Saving Credentials for Future Use...')
            pickle.dump(credentials, f)

    youtube_client = build(api_service_name, api_version, credentials=credentials)
    return youtube_client