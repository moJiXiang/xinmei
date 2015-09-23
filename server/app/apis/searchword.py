# -*- coding: utf-8 -*-
from flask import request
from flask_restful import Resource, fields, marshal
import urllib, urllib2, json, time
from app import app, db, cache, api, auth
from app.models.words import Word
from app.models.searchword import Searchword
from app.models.searchdoc import Searchdoc
from app.status import Status
from app.helper import convert2json

class WordsListAPI(Resource):
    def get(self):
        keyword = request.args.get('keyword')
        if keyword:
            wordslist = convert2json(Word.objects(keyword = keyword))
        else:
            wordslist = convert2json(Word.objects())
        return Status(200, 'success', wordslist).result

    def post(self):
        keyword = request.json.get('keyword')
        words = request.json.get('words')
        word = Word(keyword = keyword, words = words).save()
        return Status(200, 'success', convert2json(word)).result

class WordsAPI(Resource):
    def get(self, oid):
        word = convert2json(Word.objects.get(id = oid))
        return Status(200, 'success', word).result

    def put(self, oid):
        words = request.json.get('words')
        word = Word.objects.get(id = oid)
        word.update(words = words)
        return Status(200, 'success', None).result
    # def put(self, id):

class SearchwordAPI(Resource):
    def get(self):
        searchwords = Searchword.objects()
        return Status(200, 'success', convert2json(searchwords)).result

    def post(self):
        main = request.json.get('main')
        keyword = request.json.get('keyword')
        word = request.json.get('word')
        kw = '\"%s %s %s\"' %(main, keyword, word)
        searchword = Searchword(main = main, keyword = keyword, word = word, kw = kw).save()
        return Status(200, 'success', convert2json(searchword)).result

class SearchdocAPI(Resource):
    def get(self, kw):
        searchdocs = Searchdoc.objects(kw = kw)
        return Status(200, 'success', convert2json(searchdocs)).result

api.add_resource(WordsListAPI, '%s/words' % app.config['API_URI'])
api.add_resource(WordsAPI, '%s/words/<oid>' % app.config['API_URI'])
api.add_resource(SearchwordAPI, '%s/searchwords' % app.config['API_URI'])
api.add_resource(SearchdocAPI, '%s/searchdocs/<kw>' % app.config['API_URI'])
