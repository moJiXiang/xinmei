# -*- coding: utf-8 -*-
from flask import request, g, jsonify
from flask_restful import Resource, fields, marshal
import json
from app import app, api, db, auth
from app.models.user import User
from app.status import Status, make_error

user_fields = {
    'email': fields.String,
    'username': fields.String
}



class UserAPI(Resource):
    def post(self):
        email = request.json.get('email')
        username = request.json.get('username')
        password = request.json.get('password')

        if email is None or username is None or password is None:
            return make_error(400, 'missing arguments!')
        if User.objects(email = email).first() is not None:
            return make_error(400, 'exiting user!')
        user = User(email=email, username=username)
        user.hash_password(password)
        user.save()
        # db.session.add(user)
        # db.session.commit()
        return Status(201, 'success', marshal(user, user_fields)).result

class LoginAPI(Resource):
    def post(self):
        email = request.json.get('email')
        password = request.json.get('password')
        if email is None or password is None:
            return make_error(404, 'missing arguments!')
        user = User.objects(email=email).first()
        if user is None:
            return make_error(404, 'user is not exit!')
        if user.verify_password(password):
            token = user.generate_auth_token()
            return Status(200, 'success', {'token': token}).result


class TokenAPI(Resource):
    @auth.login_required
    def get(self):
        token = g.user.generate_auth_token()
        return Status(200, 'success', {'token': token}).result


api.add_resource(UserAPI, '%s/users' % app.config["API_URI"])
api.add_resource(LoginAPI, '%s/login' % app.config["API_URI"])
api.add_resource(TokenAPI, '%s/token' % app.config["API_URI"])
