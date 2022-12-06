from flask import Blueprint,request, jsonify
from firebase_admin import firestore

db = firestore.client()
user_Ref = db.collection("census_tracts")

view = Blueprint("views", __name__)


@view.route("/get_history", methods=['GET', 'POST'])
def get_history():

    db = firestore.client()

    cities_ref = db.collection("census-tracts").document()
    msgs = cities_ref.get()
    data = []

    for message in msgs:
        a = message.to_dict()
        data.append(a)

    return jsonify(data)
