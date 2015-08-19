# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Entpatent(Document):
    '''
        企业专利
        entsource 企业家,储存企+id号
        entpre 企业家名字
        enttarget 被投资企业,储存企+id号
        conprop 股份比例
        entname 企业名
    '''
    meta = {
        'collection': 'entpatents'
    }
    patentid = StringField()
    lcid = StringField()
    type = StringField()
    sqh = StringField(default=None)
    sqr = StringField(default=None)
    mc = StringField(default=None)
    classnum = StringField(default=None)
    sqzlqr = StringField(default=None)
    fmsjr = StringField(default=None)
    # xxjs = StringField(default=None)
    # flzt = StringField(default=None)
