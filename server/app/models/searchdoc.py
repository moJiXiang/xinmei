# -*- coding: utf-8 -*-
from app import db
from mongoengine import *

class Searchdoc(Document):
    meta = {
        "collection": "SpidersResultItem"
    }
    domain = StringField() # baidu.com / google.com
    kwid = StringField() # 关键字objectid
    kw = StringField() # 关键词
    title = StringField() # 标题
    url = StringField() # 链接
    brief = StringField() # 简介
    sourceurl = StringField() # 文章来源
    score = IntField() # 打分
    rank = StringField() # 排名
    content = StringField() # 正文内容
