import email
import json
from flask import jsonify, render_template, url_for, flash, redirect, request, session
from server import app, db, bcrypt
# from server.forms import RegistrationForm, LoginForm
from server.models import User, Post
from flask_login import login_user, logout_user, current_user, login_required


posts = [
    {
        'author': 'Khang Lam',
        'title': 'Blog 1',
        'content': 'Ty for Flask',
        'date_posted': 'May 15, 2022'
    },
    {
        'author': 'Gary Liang',
        'title': 'Blog 2',
        'content': 'Ty for React',
        'date_posted': 'May 16, 2022'
    },
    {
        'author': 'Ethan Lopez',
        'title': 'Blog 3',
        'content': 'Neural Network OP',
        'date_posted': 'May 17, 2022'
    }
]


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', posts=posts)

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


# @app.route("/register", methods=['GET', 'POST'])
# def register():
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         hashed_password = bcrypt.generate_password_hash(
#             form.password.data).decode('utf-8')
#         user = User(username=form.username.data, email=form.email.data,
#                     password=hashed_password)  # Creating entry for DB
#         db.session.add(user)
#         db.session.commit()
#         flash('Your account has been created! You can now log in', 'success')
#         return redirect(url_for('login'))
#     return render_template('register.html', title='Register', form=form)

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
    


# @app.route("/login", methods=['GET', 'POST'])
# def oldLogin():
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(email=form.email.data).first()
#         if user and bcrypt.check_password_hash(user.password, form.password.data):
#             login_user(user, remember=form.remember.data)
#             next_page = request.args.get('next')
#             return redirect(next_page) if next_page else redirect(url_for('home'))
#         else:
#             flash('Login Unsuccessful. Please check email and password', 'danger')
#     return render_template('login.html', title='Login', form=form)

@app.route("/login", methods=['GET', 'POST'])
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
