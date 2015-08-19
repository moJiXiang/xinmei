# -*- coding: utf-8 -*-
from flask import Flask, g
from flask_restful import Resource, Api
from flask.ext.mongoengine import MongoEngine
from flask.ext.cache import Cache
from flask.ext.httpauth import HTTPBasicAuth
from celery import Celery

app = Flask(__name__)
app.config.from_pyfile("../application.cfg")

db = MongoEngine(app)
api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
auth = HTTPBasicAuth()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

from app.apis import enterprise_api
