# -*- coding: utf-8 -*-
from flask import request
from app.models.user import User
from app.status import make_error
import random, json

def convert2json(obj):
    return json.loads(obj.to_json()) if obj is not None else None

def generate_verification_code():
    ''' 随机生成6位的验证码 '''
    code_list = []
    for i in range(10): # 0-9数字
        code_list.append(str(i))
    for i in range(65, 91): # A-Z
        code_list.append(chr(i))
    for i in range(97, 123): # a-z
        code_list.append(chr(i))
    myslice = random.sample(code_list, 6)  # 从list中随机获取6个元素，作为一个片断返回
    verification_code = ''.join(myslice) # list to string
    # print code_list
    # print type(myslice)
    return verification_code

def authorized(fn):
    """Decorator that checks that requests
    contain an id-token in the request header.
    userid will be None if the
    authentication failed, and have an id otherwise.

    Usage:
    @app.route("/")
    @authorized
    def secured_root(userid=None):
        pass
    """

    def _wrap(*args, **kwargs):
        if 'Authorization' not in request.headers:
            # Unauthorized
            print("No token in header")
            return make_error(401, 'No token in header')
            # return None

        print("Checking token...")
        user = User.verify_auth_token(request.headers['Authorization'])
        if user is None:
            print("Check returned FAIL!")
            # Unauthorized
            return make_error(401, 'Token is disabled!')
            # return None

        return fn(*args, **kwargs)
    return _wrap
