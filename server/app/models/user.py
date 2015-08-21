# -*- coding: utf-8 -*-
from app import app, db
from mongoengine import *
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

class User(Document):
    '''
    is_active 是否激活
    is_admin 是否是管理员
    '''
    meta = {
        'collection': 'users'
    }
    email = EmailField()
    username = StringField()
    password_hash = StringField()
    is_active = BooleanField(default=False)
    is_admin = BooleanField(default=False)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config["SECRET_KEY"], expires_in=expiration)
        return s.dumps({"email": self.email})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config["SECRET_KEY"])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None

        user = User.query.get(data["id"])
        return user
