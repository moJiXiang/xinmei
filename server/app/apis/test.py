#-*- coding: utf-8 -*-
from flask_restful import reqparse, Resource
from app import api, app

class TestAPI(Resource):
    def get(self):
        return 'success'

api.add_resource(TestAPI, '%s/test' % app.config['API_URI'])
