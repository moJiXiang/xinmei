# -*- coding: utf-8 -*-
from flask import jsonify
class Status(object):
    def __init__(self, code, status, data):
        self.result = {
            "code": code,
            "status": status,
            "data": data
        }
def make_error(status_code, message):
    response = jsonify({
        'status': status_code,
        'message': message
    })
    response.status_code = status_code
    return response
