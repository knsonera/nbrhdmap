import sys
import random
import string
import json
import requests

from flask import Flask
from flask import Response
from flask import render_template, redirect, request, url_for, flash, jsonify

# Add CRUD operations
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Cafe, AppUser

from flask import session as login_session
from sqlalchemy.pool import StaticPool
# Add OAuth operations
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
import httplib2
from flask import make_response

# Create session, connect to db
data = 'postgresql://nmap:11aa22ss@localhost:5432/nmap'
engine = create_engine(data)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

app = Flask(__name__)

YELP_API_KEY = 'iZC1vkpIktmdJW4bNLjTuwbuWsdGDDm6C24vQ0oHe20XtH2V3ag_vs85iGroCNffwx1kyZlAN4d5LYM9BBKtkpASg7s1pkLkHvmfJ9-KaOV2_-iSzpttpxcopjgaW3Yx'

# Load client_id for google oauth
CLIENT_ID = json.loads(
    open('static/js/client_secrets.json', 'r').read())['web']['client_id']
APPLICATION_NAME = "nbrhd-map"


# render main page
@app.route("/")
def showMainPage():
    cafes = session.query(Cafe).all()
    return render_template('index.html', cafes=cafes)


# request data from Yelp API
@app.route("/api/get/place")
def getPlaceInfo():
    # request parameters contain term and location of requested place
    term = request.args.get('term')
    location = request.args.get('location')

    http = httplib2.Http()
    # headers of the request contain Yelp API key
    headers = {'Authorization': 'Bearer ' + YELP_API_KEY}
    url = 'https://api.yelp.com/v3/businesses/search?term=' + \
        term + '&location=' + location
    # replacing spaces with url encoding
    url = url.replace(' ', '%20')
    _, content = http.request(url, 'GET', headers=headers)

    # return json object with data
    r = Response(response=content, status=200, mimetype="application/json")
    r.headers["Content-Type"] = "application/json; charset=utf-8"
    return r


# Create new cafe
@app.route('/cafes/new/', methods=['GET', 'POST'])
def newCafe():
    # check user id, only admin can create points
    user_id = getUserId(login_session['email'])
    if login_session['user_id'] != 1:
        return "<script>function myFunction() {\
                alert('Not authorized.');\
            }</script><body onload='myFunction()'>"
    # add cafe to database on POST
    if request.method == 'POST':
        newCafe = Cafe(name=request.form['name'],
                       description=request.form['description'],
                       milk=request.form['milk'],
                       lat=request.form['lat'],
                       lng=request.form['lng'],
                       user_id=user_id)
        session.add(newCafe)
        session.commit()
        # redirect to main page
        return redirect(url_for('showMainPage'))
    else:
        # show forms to create new cafe on GET
        cafes = session.query(Cafe).all()
        return render_template('newCafe.html', cafes=cafes)


@app.route('/cafes/delete/<int:cafe_id>/', methods=['GET', 'POST'])
def deleteTopic(cafe_id):
    # get cafe to delete from database
    cafe_to_delete = session.query(Cafe).filter_by(id=cafe_id).one()
    # Check if user is allowed to delete topic, show js alert
    if login_session['user_id'] != 1:
        return "<script>function myFunction() {\
                alert('Not authorized.');\
            }</script><body onload='myFunction()'>"
    # delete cafe from db on POST
    if request.method == 'POST':
        session.delete(cafe_to_delete)
        session.commit()
        # TODO: flash on success?
        # redirect to main page
        return redirect(url_for('showMainPage'))
    else:
        # make sure user wants to delete cafe
        return render_template('deleteCafe.html',
                               cafe=cafe_to_delete)


# Google OAuth
@app.route('/gconnect', methods=['POST'])
def gconnect():
    # Validate state token
    if request.args.get('state') != login_session['state']:
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code
    code = request.data

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('static/js/client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print "Token's client ID does not match app's."
        response.headers['Content-Type'] = 'application/json'
        return response
    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    # Check if user is already connected
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        print 'user is in session already, update access token'
        # TODO: try to do disconnect with old token
        # url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' \
        #    % stored_access_token
        # h = httplib2.Http()
        # result = h.request(url, 'GET')[0]
        # print result
        # if result['status'] == '200':
        #    del login_session['access_token']
    else:
        login_session['gplus_id'] = gplus_id

        # Get user info
        userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        params = {'access_token': credentials.access_token, 'alt': 'json'}
        answer = requests.get(userinfo_url, params=params)

        data = answer.json()

        login_session['username'] = data['name']
        login_session['picture'] = data['picture']
        login_session['email'] = data['email']

        user_id = getUserId(login_session['email'])
        if not user_id:
            user_id = createUser(login_session)
        login_session['user_id'] = user_id

    # Store the access token in the session.
    login_session['access_token'] = credentials.access_token

    # Show info about user
    output = ''
    output += '<h3 class="google-title">Welcome, '
    output += login_session['username']
    output += '!</h3>'
    output += '<img src="'
    output += login_session['picture']
    output += ' " style = "width: 100px; height: 100px;border-radius: 150px;\
        -webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    return output


# Disconnect (Google OAuth)
@app.route("/gdisconnect")
def gdisconnect():
    access_token = login_session.get('access_token')
    if access_token is None:
        print 'Access Token is None'
        response = make_response(json.dumps('Current user not connected.'),
                                 401)
        response.headers['Content-Type'] = 'application/json'
        status = "Current user not connected."
        return render_template('logout.html',
                               user_status=status)
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' \
        % login_session['access_token']
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]

    if result['status'] == '200':
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        del login_session['user_id']

        response = make_response(json.dumps('Successfully disconnected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        status = "Successfully disconnected."
        return render_template('logout.html',
                               user_status=status)
    else:
        response = make_response(
            json.dumps('Failed to revoke token for given user.'), 400
        )
        response.headers['Content-Type'] = 'application/json'
        status = "Failed to revoke token for given user."
        return render_template('logout.html',
                               user_status=status)


@app.route('/login')
def showLogin():
    # generate random state
    state = ''.join(random.choice(string.ascii_uppercase + string.digits)
                    for x in range(32))
    login_session['state'] = state
    return render_template('login.html', STATE=state)


# API Endpoint: List of topics (JSON)
@app.route('/cafes/JSON')
def cafesJSON():
    cafes = session.query(Cafe).all()
    return jsonify(Cafes=[i.serialize for i in cafes])


# create new user with login session info
def createUser(login_session):
    newUser = AppUser(name=login_session['username'],
                      email=login_session['email'],
                      picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    user = session.query(AppUser).filter_by(email=login_session['email']).one()
    return user.id


# get user from db
def getUserInfo(user_id):
    user = session.query(AppUser).filter_by(id=user_id).one()
    return user


# check if user exists in db
def checkUser(login_session):
    current_user_email = login_session['email']
    user = session.query(AppUser).filter_by(email=current_user_email).one()
    if not user:
        createUser(login_session)
    else:
        return user


# get user id 
def getUserId(email):
    try:
        user = session.query(AppUser).filter_by(email=email).one()
        return user.id
    except:
        return None


app.secret_key = 'asshfsklfhjdsflehfjLKJHBLKHNN*YI*YFNO&Iry3noi837rhyg&*&*$#*#*YR&*O#YR#Y$(POUFHLUHFDY'

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
