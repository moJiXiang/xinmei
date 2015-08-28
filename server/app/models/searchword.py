# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Searchword(Document):
    meta = {
        "collection": "searchwords"
    }
    main = StringField() # 主体：公司或者人
    keyword= StringField() # 关键词
    word= StringField() # 补充关键词团
    kw= StringField()
    isbdsearched= IntField(default=0)
    isglsearched= IntField(default=0)
    issgsearched= IntField(default=0)
