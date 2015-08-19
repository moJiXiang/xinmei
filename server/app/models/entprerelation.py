# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Entprerelation(Document):
    '''
        企业家和企业的关系model
        entsource 企业家,储存企+id号
        entpre 企业家名字
        enttarget 被投资企业,储存企+id号
        conprop 股份比例
        entname 企业名
    '''
    meta = {
        'collection': 'entprerelations',
        'strict': False
    }
    entsource= StringField()
    entpre= StringField()
    conprop= StringField()
    enttarget= StringField()
    entname= StringField()
