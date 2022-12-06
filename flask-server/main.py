from api import create_app

app = create_app()

#
# num = 10
#
#
# @app.route("/get_history", methods=['GET', 'POST'])
# def get_history():
#
#     db = firestore.client()
#
#     cities_ref = db.collection("census-tracts").document()
#     msgs = cities_ref.get()
#     data = []
#
#     for message in msgs:
#         a = message.to_dict()
#         data.append(a)
#
#     return jsonify(data)
#
#
# @app.route("/", methods=['GET'])
# def get_aarticles():
#     return jsonify({"Hello": 'World'})
#
#
# @app.route("/members", methods=["POST"])
# def numbers():
#     num = request.json['title']
#     print(num)
#     return num
#
#
# @ app.route("/tweets")
# def tweets():
#     print(num)
#     print("here is tweets running")
#     tweets = dict()
#
#     f = open("./data/13015960401_restaurants.json")
#     data = json.load(f)
#
#     for i in data:
#         tweets[i["id"]] = i
#
#     keys = random.sample(list(tweets.keys()), num)
#     sample = {k: tweets[k] for k in keys}
#
#     return sample


if __name__ == "__main__":
    app.run(debug=True)
