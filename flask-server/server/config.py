import os
from dotenv import load_dotenv
load_dotenv()


class ApplicationConfig:
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite"
    SECRET_KEY = os.environ["SECRET_KEY"]

    # Spotify configuration
    CLIENT_ID = os.environ["CLIENT_ID"]
    CLIENT_SECRET = os.environ["CLIENT_SECRET"]