from flask import Blueprint,request, jsonify
from firebase_admin import firestore
import random
import json
import re
import pke
import numpy as np
import pickle

db = firestore.client()
tweets_Ref = db.collection("17data")

elimination = Blueprint('elimination', __name__)

census = "17"


user = "@ [A-z]+"
hashtag = "#[A-Za-z0-9]+"
url = "http\S+"
emoji = "[\uD83C-\uDBFF\uDC00-\uDFFF]+"


# add all tweets in a census tract into the database
@elimination.route("/add", methods = ['POST'])
def create():
    try:

        f = open("./data/17data/data17.json")
        data = json.load(f)

        for i in data:
            tweets_Ref.document(census).collection("tweets").document(i["id"]).set(i)

        return jsonify({"success":True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"
    # try:
    #     id = "13015960401"
    #
    #     f = open("./data/" + id + "_restaurants.json")
    #     data = json.load(f)
    #
    #     for i in data:
    #         tweets_Ref.document("13015960401").collection("tweets").document(i["id"]).set(i)
    #
    #     return jsonify({"success":True}), 200
    #
    # except Exception as e:
    #     return f"An Error Occured: {e}"


# list all tweets in a census tract
@elimination.route("/list")
def read():
    try:
        all_tracts = [doc.to_dict() for doc in tweets_Ref.document(census).collection("tweets").stream()]
        return jsonify(all_tracts), 200
    except Exception as e:
        return f"An Error Occured: {e}"

# get random 10 tweets in a census tract
@elimination.route("/get_random/<num>/")
def random_tweets(num):
    try:
        t = [doc.to_dict() for doc in tweets_Ref.document(census).collection("tweets").stream()]

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


# update all regular expression
@elimination.route("/update_reg/", methods = ['PUT'])
def update_allreg():
    try:
        regs = request.json["regs"]

        for i in regs:
            db.collection("eliminated_reg").document(i['id']).set(i)

        extractKeyword(regs)
        extract_embedding()

        return jsonify({"success":True}), 200
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


def extractKeyword(regs):

    data = [doc.to_dict() for doc in tweets_Ref.document(census).collection("tweets").stream()]

    print(len(data), flush=True)

    extractor = pke.unsupervised.MultipartiteRank()
    wordCount = dict()

    # index = 0
    for i in data:
        # index = index + 1
        # if index > 3:
        #     break
        for reg in regs:
            i['text'] = re.sub(r'' + reg['reg'], '', i['text'])
        extractor.load_document(input=i['text'], language='en')
        extractor.candidate_selection()
        extractor.candidate_weighting()
        keyPhrases = extractor.get_n_best(n=10)
        print(keyPhrases, flush=True)

        for i in keyPhrases:
            wordCount[i[0]] = wordCount.get(i[0],{})
            wordCount[i[0]]['count'] = wordCount[i[0]].get('count', 0) + 1

    wordCount = {k:v for (k,v) in wordCount.items() if v['count'] > 9}

    print(wordCount, flush=True)

    with open('./python_ob/keyword.pickle', 'wb') as handle:
        pickle.dump(wordCount, handle, protocol=pickle.HIGHEST_PROTOCOL)



# extract embedding
@elimination.route("/keyword/", methods = ['PUT'])
def extract_embedding():
    try:
        embeddings_dict = {}
        with open("./model/glove.twitter.27B.50d.txt", 'r') as f:
            for line in f:
                values = line.split()
                word = values[0]
                vector = np.asarray(values[1:], "float32")
                embeddings_dict[word] = vector

        with open('./python_ob/keyword.pickle', 'rb') as handle:
            wordCount = pickle.load(handle)

        print(len(wordCount), flush=True)

        for word in wordCount:
            if len(word.split(' ')) == 1:
                if word in embeddings_dict:
                    wordCount[word]['embed_org'] = embeddings_dict[word]
                else:
                    wordCount[word]['missing'] = -1
                    print(word,flush=True)
            else:
                phrase = word.split(' ')
                sum = 0
                count = 0
                for w in phrase:
                    if w in embeddings_dict:
                        sum += embeddings_dict[w]
                        count += 1
                    else:
                        print(w,flush=True)
                if(count == 0):
                    wordCount[word]['missing'] = -1
                else:
                    wordCount[word]['embed_org'] = sum / count

            if 'missing' not in wordCount[word].keys():
                db.collection("keywords").document(word).set({'embed_org': wordCount[word]['embed_org'].tolist(), 'count': wordCount[word]['count'], 'word': word})

        print(wordCount,flush=True)

        return jsonify({"success":True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"