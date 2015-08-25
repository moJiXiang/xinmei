## 信美项目文档

**版本号** 0.0.1

### 介绍


- 采用前后端分离，RESTful接口的形式
- 前端使用vue.js，使用webpack打包项目(client文件夹)
- 后端使用flask,Flask-Restful做api接口，api版本号为v1(server文件夹)


### 项目部署

- view [gunicorn](http://docs.gunicorn.org/en/latest/deploy.html) document
- view [celery](http://docs.jinkan.org/docs/celery/) document

```
git clone https://github.com/moJiXiang/xinmei.git

cd xinmei

cd client

npm install

bower install

sudo npm install webpack -g

# build web resource package with webpack
npm run dev

cd ../server

cp application.cfg.template application.cfg

virtualenv venv

source venv/bin/active

pip install -r requirements.txt

# deploy server api
# use run.pid, then we can use kill 'cat run.pid' stop gunicorn process
gunicorn run:app -p run.pid -b 127.0.0.1:8000 -D

sudo vim /etc/nginx/nginx.conf(apt-get nginx on ubuntu system)
# sudo vim /usr/local/etc/nginx/nginx.conf(brew isntall nginx on mac)

server {

        listen 81;
        location / {
                root /home/safeuser/data/www/xinmei/client;
                index index.html;
        }
        location /api/v1 {
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_redirect off;
                proxy_pass http://127.0.0.1:8000;
        }
}
# run nginx
sudo service nginx start

# deploy celery with development environment
cd server
source venv/bin/active
celery -A app.tasks worker --loglevel=info

# install rabbitmq
apt-get rabbitmq(ubuntu)
brew install rabbitmq(mac)

sudo rabbitmq-server
```
### 更新站点

```
cd xinmei/client
cp index.html.template index.html
bower install
npm install
npm run dev

cd xinmei/server
cp application.cfg.template application.cfg
cp run.py.template run.py
gunicorn run.pid ....

```
