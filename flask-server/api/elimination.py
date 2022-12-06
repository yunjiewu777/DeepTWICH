from flask import Blueprint,request, jsonify
from firebase_admin import firestore
import random
import json

db = firestore.client()
tweets_Ref = db.collection("census_tracts")

elimination = Blueprint('elimination', __name__)


# add all tweets in a census tract into the database
@elimination.route("/add", methods = ['POST'])
def create():
    try:
        id = "13015960401"

        f = open("./data/" + id + "_restaurants.json")
        data = json.load(f)

        for i in data:
            tweets_Ref.document("13015960401").collection("tweets").document(i["id"]).set(i)

        return jsonify({"success":True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"


# list all tweets in a census tract
@elimination.route("/list")
def read():
    try:
        all_tracts = [doc.to_dict() for doc in tweets_Ref.document("13015960401").collection("tweets").stream()]
        return jsonify(all_tracts), 200
    except Exception as e:
        return f"An Error Occured: {e}"

# get random 10 tweets in a census tract
@elimination.route("/get_random/<num>/")
def random_tweets(num):
    try:
        t = [doc.to_dict() for doc in tweets_Ref.document("13015960401").collection("tweets").stream()]

        num = int (num)
        if len(t) < num:
            sample = t
        else:
            sample = random.sample(t, num)

        return jsonify(sample), 200
    except Exception as e:
        return f"An Error Occured: {e}"




# get all regular expressions
@elimination.route("/get_reg/")
def regs():
    try:
        r = [doc.to_dict() for doc in db.collection("eliminated_reg").stream()]
        return jsonify(r), 200
    except Exception as e:
        return f"An Error Occured: {e}"



# get regular expression by id
@elimination.route("/get_reg/<id>/")
def get_reg(id):
    try:
        r = db.collection("eliminated_reg").document(id).get().to_dict()
        return jsonify(r), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# add regular expression by id
@elimination.route("/add_reg/", methods = ['POST'])
def insert_reg():
    try:
        reg_name = request.json["name"]
        reg = request.json["reg"]

        new_ref = db.collection("eliminated_reg").document()

        key = new_ref.get().id

        new_ref.set(
            {"id": key, "name": reg_name,"reg": reg}
        )
        return jsonify({"id": key, "name": reg_name,"reg": reg}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

# update regular expression by id
@elimination.route("/update_reg/<id>/", methods = ['PUT'])
def update_reg(id):
    try:

        reg_name = request.json["name"]
        reg = request.json["reg"]

        db.collection("eliminated_reg").document(id).update({"name":reg_name, "reg":reg})

        return jsonify({"id": id,"name":reg_name, "reg":reg}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# delete regular expression by id
@elimination.route("/delete_reg/<id>/", methods = ['DELETE'])
def delete_reg(id):
    try:
        db.collection("eliminated_reg").document(id).delete()
        return jsonify({"success":True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"