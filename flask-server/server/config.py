import os
from dotenv import load_dotenv
load_dotenv()


class ApplicationConfig:
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite"
    SECRET_KEY = os.environ["SECRET_KEY"]