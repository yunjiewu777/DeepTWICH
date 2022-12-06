from flask import Blueprint,request, jsonify
from firebase_admin import firestore


db = firestore.client()
user_Ref = db.collection("census_tracts")

userAPI = Blueprint('userAPI', __name__)

@userAPI.route("/add", methods = ['POST'])
def create():
    try:
        id = "13015960401"
        user_Ref.document(id).set({"name":"saf"})
        return jsonify({"success":True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@userAPI.route("/list")
def read():
    try:
        all_tracts = [doc.to_dict() for doc in user_Ref.stream()]
        return jsonify(all_tracts), 200
    except Exception as e:
        return f"An Error Occured: {e}"
