from flask import Flask
from flask import render_template, redirect, request, url_for, jsonify

app = Flask(__name__)

@app.route("/")
def showMainPage():
    return render_template('index.html')

@app.route("/signin")
def showSignIn():
    return render_template('signin.html')

if __name__ == "__main__":
    app.run()
