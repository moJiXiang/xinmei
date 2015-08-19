# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Entsrelation(Document):
    '''
        企业与企业的关系model
        entsource 投资方,储存企+id号
        enttarget 被投资企业,储存企+id号
        entname 企业名称
    '''
    meta = {
        'collection': 'entsrelations'
    }
    entsource= StringField()
    enttarget= StringField()
    entname= StringField()
