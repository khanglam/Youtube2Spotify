from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from server.config import ApplicationConfig
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(ApplicationConfig) # Get config from config.py file
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info' # Flash message for 'Login to access this page'

from server import routes