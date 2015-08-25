# -*- coding: utf-8 -*-
from . import app, celery
import urllib, urllib2, json, time, random, re, codecs
from models.enterprise import Enterprise
from models.entsrelation import Entsrelation
from models.entprerelation import Entprerelation
from models.entpatent import Entpatent
from models.entcopyright import Entcopyright

# test celery
@celery.task
def add(x, y):
    return x + y
# 对企＋数据的抓取， 为一个树状递归， 层层抓取数据
@celery.task()
def grab_from_qy(lcid):
    grab_recursion(lcid)


@celery.task()
def grab_with_names():
    entfile = codecs.open('testents.txt', 'r',encoding='utf-8')
    for i, line in enumerate(entfile.readlines()):
        line = line.strip()
        # time.sleep(10 * i)
        print line
        grab_lcid_byname(line)
    # with open('testent.json') as enterprise_data:
    #     data = json.load(enterprise_data)
    #     for i, ent in enumerate(data["enterprises"]):
    #         time.sleep(10 * i)
    #         grab_lcid_byname(ent["COMPANYNAME"])


def grab_recursion(lcid):
    data = grab_enterprise(lcid)
    if data:
        childents = grab_maininvest(lcid)
        grab_investment(lcid)
        grab_patentlist(lcid)
        grab_softwarelist(lcid)

        for childent in childents:
            grab_recursion(childent["sub_lcid"])

def grab_lcid_byname(name):
    url = "/company/fQyEnterprisebaseinfoList"
    option = {"keyword": name.encode('utf-8')}
    response = grabClawer(url, option).grab()
    lcid = response["data"]["list"][0]["lcid"]
    grab_recursion(lcid)


# 抓取单个公司的信息
def grab_enterprise(lcid):
    print lcid
    url = '/company/fQyEnterprisebaseinfo'
    option = {"lcid": lcid}
    response = grabClawer(url, option).grab()
    data = response['data']
    # 如果需要验证码，跳过
    if data is None:
        pass
    else:
        if type(data) is dict:
            if Enterprise.objects(lcid=lcid):
                return data
            else:
                Enterprise(
                    lcid = data["lcid"],
                    entname = data["fei_entname"],
                    address = data["fei_dom"],
                    oploc = data["fei_oploc"],
                    regno = data["fei_regno"],
                    corporation = data["epp_name"],
                    entindustry = data["fei_industryphyname"],
                    totalscpoe = data["fei_totalscpoe"],
                    enttype = data["fei_enttypename"],
                    entstatus = data["fei_entstatusname"],
                    regorg = data["fei_regorgname"],
                    regcap = data["fei_regcap"],
                    regcapcur = data["fei_regcapcurname"],
                    esdate = data["fei_esdate"]
                ).save()
                return data
        else:
            print 'need captcha!'
        # else:
        #     pattern = re.compile(r'http://')
        #     match = pattern.search(data)
        #     if match:
        #         pass
        #     else:


# 抓取主要的关联公司
def grab_maininvest(lcid):
    url = '/company/fQyMaininvestList'
    option = {"lcid": lcid}
    response = grabClawer(url, option).grab()
    results = response["data"]["list"]
    for relation in results:
        if Entsrelation.objects(entsource=lcid, enttarget=relation["sub_lcid"]):
            pass
        else:
            Entsrelation(
                entsource = relation["lcid"],
                enttarget = relation["sub_lcid"],
                entname = relation["entname"]
            ).save()

    return results

# 得到企业的股东
def grab_investment(lcid):
    url = '/company/fQyInvestmentList'
    option = {"lcid": lcid}
    response = grabClawer(url, option).grab()
    results = response["data"]["list"]
    for relation in results:
        if Entprerelation.objects(enttarget=lcid, entsource=relation["sub_lcid"]):
            pass
        else:
            Entprerelation(
                entsource = relation["sub_lcid"],
                entpre = relation["eii_inv"],
                conprop = relation["conprop"],
                enttarget = relation["lcid"],
                entname = relation["fei_enname"]
            ).save()

# 得到企业的专利数据
def grab_patentlist(lcid):
    url = '/company/fProPatentdetailinfoList'
    option = {"lcid": lcid}
    response = grabClawer(url, option).grab()
    results = response["data"]["list"]
    for patent in results:
        if Entpatent.objects(patentid=patent['id']):
            pass
        else:
            Entpatent(
                patentid = patent["id"],
                lcid = patent["fpp_lcid"],
                type = patent["fpp_type"],
                sqh = patent["fpp_sqh"],
                sqr = patent["fpp_sqr"],
                mc = patent["fpp_mc"],
                classnum = patent["fpp_classnum"],
                sqzlqr = patent["fpp_sqzlqr"],
                fmsjr = patent["fpp_fmsjr"]
                # xxjs = patent["fpp_xxjs"],
                # flzt = patent["fpp_flzt"]
            ).save()

# 得到企业的软件著作权
def grab_softwarelist(lcid):
    url = '/company/fProSoftwareCopyrightList'
    option = {"lcid": lcid}
    response = grabClawer(url, option).grab()
    results = response["data"]["list"]
    for copyright in results:
        if Entcopyright.objects(copyrightid=copyright["id"]):
            pass
        else:
            Entcopyright(
                copyrightid = copyright["id"],
                lcid = copyright["lcid"],
                regnumber = copyright["frj_regnumber"],
                classnumber = copyright["frj_classnumber"],
                classname = copyright["frj_classname"],
                softname = copyright["frj_softname"],
                softrefname = copyright["frj_softrefname"],
                version = copyright["frj_version"],
                owner = copyright["frj_owner"]
            ).save()

# class grabEnterpriseList(self, url, name):
#     def __init__(self, url, name):
#

class grabClawer():
    def __init__(self, url, option):
        self.url = app.config['GRAB_URI'] + url
        self.get_random_config()
        self.data = {
            "appVersion": "1.4.5",
            # "imei": "EF0D574C-628C-4334-9DF9-75C2AE7DDBDE",
            # "imei": "52138BAD-F878-4654-A123-F4B392B4B92A",
            "imei": self.imei,
            "os": "iPhone OS",
            # "lcid": lcid,
            "type": "全部",
            "page": 1,
            "rows": 100,
            "osVersion": "8.4",
            # "userId": "ff8080814dc2b1a5014dfca131f915c2",
            "userId": self.userId,
            # "userId": "ff8080814cbc7f6f014cca52197b128a",
        }
        for key in option:
            self.data[key] = option[key]

        self.headers = {
        	'Host': 'app.entplus.cn',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
            'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            # 'Cookie': 'JSESSIONID=6E7A6C44444C635CE411B9BAD407D446'
            # 'Cookie': 'JSESSIONID=5F1F6254655B935D851FD6F5F299EDB1'
            'Cookie': self.Cookie
        }

    def get_random_config(self):
        num = random.randint(0, 2)
        self.imei = app.config["IMEI%d" % num]
        self.userId = app.config["USERID%d" % num]
        self.Cookie = app.config["COOKIE%d" % num]

    def grab(self):
        return self.post_fnc(self.url, self.data, self.headers)

    def post_fnc(self, url, data, headers):
        # time.sleep(random.randint(2, 5))
        time.sleep(random.randint(10, 20))
        data = urllib.urlencode(data)
        req = urllib2.Request(url, data, headers)
        response = urllib2.urlopen(req)
        return json.loads(response.read())
