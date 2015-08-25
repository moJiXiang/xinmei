#-*- coding: utf-8 -*-
from flask import request
from flask_restful import Resource
import urllib, urllib2, json, threading, time, random
from app import app, db, cache, api
from app.status import Status, make_error
from app.tasks import add, grab_from_qy, grab_with_names

class GrabEntListAPI(Resource):
    url = 'http://app.entplus.cn/entplus1.4/company/fQyEnterprisebaseinfoList'
    data = {
        "appVersion": "1.3.3",
        "imei": "EF0D574C-628C-4334-9DF9-75C2AE7DDBDE",
        "os": "iPhone OS",
        # "keyword": company.encode('utf-8'),
        "osVersion": "8.0.2",
        "userId": "ff8080814cbc7f6f014cca52197b128a",
    }
    headers = {
    	'Host': 'app.entplus.cn',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
        'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cookie': 'JSESSIONID=6E7A6C44444C635CE411B9BAD407D446'
    }

    def get(self):
        entname = request.args.get('entname')
        self.data["keyword"] = entname.encode('utf-8')
        result = self.post_fnc(self.url, self.data, self.headers)
        entslist = result["data"]["list"]
        return Status(200, 'success', entslist).result

    def post_fnc(self, url, data, headers):
        data = urllib.urlencode(data)
        req = urllib2.Request(url, data, headers)
        response = urllib2.urlopen(req)
        return json.loads(response.read())

# class GrabEntTreeData(threading.Thread):
#     '''
#         这个请求有时候会消耗大量时间，所以放入线程中进行处理
# 		获得公司的树状数据，关联公司的下级，下级的下级
# 		还有每个公司的详细信息
#     '''
#     def __init__(self, lcid):
#         super(GrabEntTreeData, self).__init__()
#         self.lcid = lcid
#
#     def get(self):
#         pass
#
#     def run(self):
#         result = self.get
#
#     def initRequestOptions(self, criteria, suburl):
#         url = 'http://app.entplus.cn/entplus1.4/%s' % suburl
#         data = {
#             "appVersion": "1.3.3",
# 		    "imei": "EF0D574C-628C-4334-9DF9-75C2AE7DDBDE",
# 		    "os": "iPhone OS",
# 		    "page": 1,
# 		    "rows": 100,
# 		    "osVersion": "8.0.2",
# 		    "userId": "ff8080814cbc7f6f014cca52197b128a",
#         }

class GrabQy(Resource):
    def get(self, lcid):
        # add.delay(2, 3)
        grab_from_qy.delay(lcid)
        return Status(200, 'success', None).result


class GrabAllQy(Resource):
    def post(self):
        # add.delay(2, 3)
        downloadlist = json.loads(request.data)["downloadlist"]
        for task in downloadlist:
            grab_from_qy.delay(task["lcid"])
        return Status(200, 'success', None).result

class GrabAllQyByName(Resource):
    def get(self):
        grab_with_names.delay()
        return Status(200, 'success', None).result

class GrabClawer():
    def __init__(self, url, lcid):
        self.url = app.config['GRAB_URI'] + url
        self.data = {
            "appVersion": "1.4.5",
            "imei": "52138BAD-F878-4654-A123-F4B392B4B92A",
            # "imei": "EF0D574C-628C-4334-9DF9-75C2AE7DDBDE",
            "os": "iPhone OS",
            "lcid": lcid,
            "page": 1,
            "rows": 100,
            "type": "全部",
            "osVersion": "8.4",
            "userId": "ff8080814dc2b1a5014dfca131f915c2",
            # "userId": "ff8080814cbc7f6f014cca52197b128a",
        }

        self.headers = {
        	'Host': 'app.entplus.cn',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
            'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Cookie': 'JSESSIONID=5F1F6254655B935D851FD6F5F299EDB1'
            # 'Cookie': 'JSESSIONID=6E7A6C44444C635CE411B9BAD407D446'
        }

    def grab(self):
        return self.post_fnc(self.url, self.data, self.headers)

    def post_fnc(self, url, data, headers):
        # time.sleep(random.randint(10, 20))
        data = urllib.urlencode(data)
        req = urllib2.Request(url, data, headers)
        response = urllib2.urlopen(req)
        return json.loads(response.read())

class GrabEnterprise(Resource):
    def get(self, lcid):
        url = '/company/fQyMaininvestList'
        return GrabClawer(url, lcid).grab()


api.add_resource(GrabEntListAPI, '%s/searchqy' % app.config["API_URI"])
api.add_resource(GrabQy, '%s/grab/<lcid>'  % app.config["API_URI"])
api.add_resource(GrabAllQy, '%s/grab'  % app.config["API_URI"])
api.add_resource(GrabEnterprise, '%s/grabenterprise/<lcid>'  % app.config["API_URI"])
api.add_resource(GrabAllQyByName, '%s/graballqybyname' % app.config["API_URI"])
