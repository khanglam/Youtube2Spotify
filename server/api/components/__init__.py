from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from components.config import ApplicationConfig
from flask_cors import CORS
from flask_sslify import SSLify

app = Flask(__name__)
sslify = SSLify(app) 
app.config.from_object(ApplicationConfig) # Get config from config.py file
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info' # Flash message for 'Login to access this page'

from components import routes