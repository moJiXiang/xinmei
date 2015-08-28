# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Word(Document):
    '''
    keyword: 词团主题
    words: 词团附体
    '''
    meta = {
        "collection": "words"
    }
    keyword = StringField()
    words = ListField()
