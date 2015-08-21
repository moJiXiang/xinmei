# -*- coding:utf-8 -*-

from app import app
# app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config["DEBUG"])
app.run(port=app.config['PORT'], debug=app.config["DEBUG"])
# app.run(port=app.config['PORT'])
