# -*- coding: utf-8 -*-
from app import db
from mongoengine import *
from mongoengine import signals
import logging, datetime

class Enterprise(Document):
    '''
        企业的model
        lcid 企+的ID号
        entname 企业名称
        address 企业地址
        oploc 注册地址
        regno 注册号
        corporation 法人
        corporation_ref 法人表中ObjectId
        entindustry 企业行业
        totalscpoe 经营范围
        enttype 企业类型，有限责任，股份制
        entstatus 企业状态，在营，还是倒闭 (enterprise status)
        regorg 注册机构 (regist origanization)
        regcap 注册资金 (regist captial)
        regcapcur 人民币还是美元
        esdate 成立时间 (establish date)
    '''
    meta = {
        'collection': 'enterprises',
        'strict': False
    }

    lcid = StringField()
    entname = StringField(default=None)
    address = StringField()
    oploc = StringField()
    regno = StringField()
    corporation= StringField()
    # corporation_ref= ReferenceField(Entrepreneur)
    entindustry= StringField()
    totalscpoe= StringField()
    enttype= StringField()
    entstatus= StringField()
    regorg= StringField()
    regcap= FloatField()
    regcapcur= StringField()
    esdate= StringField()

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        '''
            Ensure that only one enterprise can be save
        '''
        pass
        # self.objects(lcid=document.lcid)


signals.pre_save.connect(Enterprise.pre_save, sender=Enterprise)
