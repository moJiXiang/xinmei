# -*- coding: utf-8 -*-
from flask import request, g, jsonify
from flask_restful import Resource, fields, marshal
from flask.ext.mail import Message
import json, random
from app import app, api, db, auth, mail
from app.models.user import User
from app.status import Status, make_error
from app.helper import generate_verification_code, authorized

user_fields = {
    'email': fields.String,
    'username': fields.String
}



class UserAPI(Resource):
    def post(self):
        email = request.json.get('email')
        username = request.json.get('username')
        password = request.json.get('password')
        captcha = request.json.get('captcha')
        if email is None or username is None or password is None:
            return make_error(400, 'missing arguments!')
        user = User.objects(email=email).first()
        print captcha == user["captcha"]
        if not captcha == user["captcha"]:
            return make_error(400, 'captcha is not correct!')
        user.hash_password(password)
        token = user.generate_auth_token()
        user.update(username=username, set__is_active=True)
        user.save()
        return Status(201, 'success', {'token': token}).result

class CheckActiveAPI(Resource):
    @authorized
    def get(self):
        return Status(200, 'success', None).result


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
        if token:
            return Status(200, 'success', {'token': token}).result
        else:
            return make_error(401, 'Unauthorized Access!')

class SendEmailAPI(Resource):
    def post(self):
        email = request.json.get('email')
        captcha = generate_verification_code()
        msg = Message('主题', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = '文本  body'
        msg.html = '验证码是：%s' % captcha
        try:
            mail.send(msg)
        except Exception as e:
            # TODO: how to format e detail message to string
            return make_error(400, 'Mailbox not found or access denied')
        else:
            if User.objects(email = email).first() is not None:
                return make_error(400, 'exiting user!')
            else:
                user = User(email=email, captcha=captcha)
                user.save()
                return Status(200, 'success', 'send captcha to your email').result



api.add_resource(UserAPI, '%s/users' % app.config["API_URI"])
api.add_resource(LoginAPI, '%s/login' % app.config["API_URI"])
api.add_resource(TokenAPI, '%s/token' % app.config["API_URI"])
api.add_resource(SendEmailAPI, '%s/sendemail' % app.config["API_URI"])
api.add_resource(CheckActiveAPI, '%s/checkactive' % app.config["API_URI"])
