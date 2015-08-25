# -*- coding: utf-8 -*-
from flask import Flask, g
from flask_restful import Resource, Api
from flask.ext.mongoengine import MongoEngine
from flask.ext.cache import Cache
from flask.ext.httpauth import HTTPBasicAuth
from flask.ext.mail import Mail, Message
from celery import Celery

app = Flask(__name__)
app.config.from_pyfile("../application.cfg")

db = MongoEngine(app)

api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
auth = HTTPBasicAuth()
mail = Mail(app)

from app.models.user import User
from app.status import make_error

# flask_auth的login_required的验证
@auth.verify_password
def verify_password(email_or_token, password):
    user = User.verify_auth_token(email_or_token)
    if not user:
        user = User.objects(email=email_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


# 允许跨域访问
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

from app.apis import enterprise, test, auth
