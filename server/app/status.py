# -*- coding: utf-8 -*-
class Status(object):
    def __init__(self, code, msg, data):
        self.result = {
            "meta": {
                "code": code,
                "message": msg
            },
            "data": data
        }
