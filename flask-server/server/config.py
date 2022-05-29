import os
from dotenv import load_dotenv
load_dotenv()


class ApplicationConfig:
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///site.db"
    SECRET_KEY = os.environ["SECRET_KEY"]