#-*- coding: utf-8 -*-
from flask import request, jsonify
from flask_restful import reqparse, Resource
import urllib, urllib2, json, time
from app import app, db, cache, api

# Import module models
from app.models.enterprise import Enterprise
from app.models.entsrelation import Entsrelation
from app.models.entprerelation import Entprerelation
from app.models.entpatent import Entpatent

from app.status import Status

class EnterpriseAPI(Resource):
    @cache.cached(timeout=60)
    def get(self, lcid):
        enterprise = Enterprise.objects(lcid=lcid).first()
        entprerelations = Entprerelation.objects(enttarget=lcid)
        entsrelations = Entsrelation.objects(entsource=lcid)
        entpatents = Entpatent.objects(lcid=lcid)
        obj = {}
        obj["enterprise"] = self.load_json(enterprise)
        obj["entprerelations"] = self.load_json(entprerelations)
        obj["entsrelations"] = self.load_json(entsrelations)
        obj["entpatents"] = self.load_json(entpatents)
        # relEnts = Entsrelation.objects(entsource=lcid).to_json()
        # print len(relEnts)
        if enterprise:
            return Status(200, 'Success', obj).result
        else:
            return Status(404, 'Not Found', None).result

    def load_json(self, obj):
        return json.loads(obj.to_json()) if obj is not None else None

class EnterpriseListAPI(Resource):
    def get(self):
        name = request.args.get('name')
        # 从本地数据库中得到数据
        if name:
            enterprises = Enterprise.objects(__raw__={'entname': {"$regex": name.encode('utf-8')}}).only('entname', "lcid", "regcap", "esdate", "address", "regcapcur")
        else:
            enterprises = Enterprise.objects[:50]

        if len(enterprises):
            return Status(200, 'Success', json.loads(enterprises.to_json())).result
        else:
            return Status(404, 'Not Found', None).result

class IndustryChartAPI(Resource):
    def __init__(self):
        self.rawdata = []
        self.deep = 1
        self.results = {}
    # @cache.cached(timeout=60)
    def get(self, lcid):
        self.getRelEnts(lcid)
        self.addDeep(lcid, self.rawdata, None)
        self.results['nodes'] = []
        self.results['links'] = []
        for data in self.rawdata:
            if data["parent"] is not None:
                obj = data["parent"]
                obj["investment"] = data["investment"]
                self.results["nodes"].append(obj)
                for link in data["children"]:
                    self.results["links"].append(link)
        return Status(200, 'Success', self.results).result

    def getRelEnts(self, lcid):
        # 获得企业的相关企业信息
        obj = {}
        obj["children"] = []
        obj["parent"] = json.loads(Enterprise.objects(lcid=lcid).only("lcid", "entname", "regcap", "entindustry").first().to_json())
        childrens = json.loads(Entsrelation.objects(entsource=lcid).only("enttarget", "entname", "entsource").to_json())
        obj["investment"] = json.loads(Entprerelation.objects(enttarget=lcid).only("entpre", "conprop").to_json())

        for relent in childrens:
            if Enterprise.objects(lcid=relent["enttarget"]).first() is not None:
                obj["children"].append(relent)
        self.rawdata.append(obj)
        # 自动递归
        if len(obj["children"]):
            for relent in obj["children"]:
                    self.getRelEnts(relent["enttarget"])


    def addDeep(self, lcid, rawdata, obj):
        nextRawData = []
        for raw in rawdata:
            if raw["parent"] is not None:
                if raw["parent"]["lcid"] == lcid:
                    if obj:
                        raw["parent"]["deep"] = obj['prenode'] + 1
                    else:
                        raw["parent"]["deep"] = self.deep

                    nextRawData = raw["children"]

            for d in nextRawData:
                if obj:
                    d['prenode'] = obj['prenode'] + 1
                else:
                    d['prenode'] = self.deep


        for obj in nextRawData:
            self.addDeep(obj["enttarget"], rawdata, obj)


class TreeAPI(Resource):
    @cache.cached(timeout=60)
    def get(self, lcid):
        # 得到当前公司的关联企业
        arrs = []
        for ent in self.getRelEnts(lcid):
            for e in ent:
                arrs.append(json.loads(e.to_json()))

        data = {}
        # cover to json object
        data = json.loads(Enterprise.objects(lcid=lcid).only("lcid","entname","esdate").first().to_json())
        result = self.coverToTree(lcid, arrs, data)
        return Status(200, 'Success', result).result

    def getRelEnts(self, lcid):
        # 获得企业的详细信息
        # ent = Enterprise.objects(lcid=lcid).only("lcid").first()
        relEnts = Entsrelation.objects(entsource=lcid)
        if len(relEnts)>0:
            yield relEnts
            for relent in relEnts:
                for ent in self.getRelEnts(relent["enttarget"]):
                    yield ent

    # 转换为树结构数据
    def coverToTree(self, root, arrs, data):
        data["children"] = []
        for ent in arrs:
            if ent["entsource"] == root:
                if Enterprise.objects(lcid=ent["enttarget"]):
                    child = Enterprise.objects(lcid=ent["enttarget"]).only("lcid","entname","esdate").first().to_json()
                    data["children"].append(json.loads(child))
        for child in data["children"]:
            self.coverToTree(child['lcid'], arrs, child)

        return data

api.add_resource(TreeAPI, '%s/tree/<lcid>' % app.config['API_URI'])
api.add_resource(IndustryChartAPI, '%s/industrychart/<lcid>' % app.config['API_URI'])
api.add_resource(EnterpriseAPI, '%s/enterprises/<lcid>' % app.config['API_URI'])
api.add_resource(EnterpriseListAPI, '%s/enterprises' % app.config['API_URI'])
