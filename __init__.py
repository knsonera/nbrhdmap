from flask import Flask
from flask import render_template, redirect, request, url_for, jsonify
from flask import Response
import urllib
import httplib2

app = Flask(__name__)


# render main page
@app.route("/")
def showMainPage():
    return render_template('index.html')


# request data from Yelp API
@app.route("/api/get/place")
def getPlaceInfo():
    # request parameters contain term and location of requested place
    term = request.args.get('term')
    location = request.args.get('location')

    http = httplib2.Http()
    # headers of the request contain Yelp API key
    headers = {'Authorization': 'Bearer VxWBShU6llLY7RgOEopfy2MYqNO2LVkrTEmX1vtGUUxBfSho6HJDZ6XL7bOtyAgm2glPJJC7pYBjqZa1gSuVCOd1pZ-3bzye1ex8GiD852FUP8b-WpZaToTO9WACW3Yx'}
    url = 'https://api.yelp.com/v3/businesses/search?term=' + \
        term + '&location=' + location
    # replacing spaces with url encoding
    url = url.replace(' ', '%20')
    _, content = http.request(url, 'GET', headers=headers)

    # return json object with data
    r = Response(response=content, status=200, mimetype="application/json")
    r.headers["Content-Type"] = "application/json; charset=utf-8"
    return r


if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
