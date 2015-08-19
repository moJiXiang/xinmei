# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Entcopyright(Document):
    '''

    '''
    meta = {
        'collection': 'entcopyrights',
        'strict': False
    }

    copyrightid = StringField()
    lcid = StringField()
    regnumber = StringField()
    classnumber = StringField()
    classname = StringField()
    softname = StringField()
    softrefname = StringField()
    version = StringField()
    owner = StringField()

    def clean(self):
        '''
            Ensure that only one enterprise can be save
        '''
        pass
