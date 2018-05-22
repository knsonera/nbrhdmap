from flask import Flask
from flask import render_template, redirect, request, url_for, jsonify
import urllib
import httplib2

app = Flask(__name__)

@app.route("/")
def showMainPage():
    return render_template('index.html')

@app.route("/signin")
def showSignIn():
    return render_template('signin.html')

@app.route("/api/get/place")
def getPlaceInfo():
    term = request.args.get('term')
    location = request.args.get('location')

    http = httplib2.Http()
    headers = {'Authorization': 'Bearer VxWBShU6llLY7RgOEopfy2MYqNO2LVkrTEmX1vtGUUxBfSho6HJDZ6XL7bOtyAgm2glPJJC7pYBjqZa1gSuVCOd1pZ-3bzye1ex8GiD852FUP8b-WpZaToTO9WACW3Yx'}
    url = 'https://api.yelp.com/v3/businesses/search?term=' + term + '&location=' + location  
    url = url.replace(' ', '%20')
    print(url)
    _, content = http.request(url, 'GET', headers=headers)
    return content, {'Content-Type': 'application/json; charset=utf-8'}


if __name__ == "__main__":
    app.run()
