import os
from dotenv import load_dotenv
load_dotenv()


class ApplicationConfig:
    SQLALCHEMY_ECHO = True
    # SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SECRET_KEY = os.environ.get("SECRET_KEY")