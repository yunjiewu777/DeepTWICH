from flask import Blueprint,request, jsonify
from firebase_admin import firestore
import random
import json
import torch
import torch.nn as nn
from torchvision import transforms
from torch.utils.data import DataLoader, random_split
from sklearn.model_selection import train_test_split
import pickle
import numpy as np
import pandas as pd
from sklearn import metrics
from scipy.spatial.distance import cosine
from sklearn.cluster import DBSCAN, AffinityPropagation
from scipy.spatial import distance
from model import *
from pytorchtools import EarlyStopping


db = firestore.client()
keyword_Ref = db.collection("keywords")

cluster = Blueprint('cluster', __name__)

random.seed(320)
np.random.seed(320)
torch.manual_seed(320)

# Model Initialization
model = AE()
# Using an Adam Optimizer with lr = 0.1
optimizer = torch.optim.Adam(model.parameters(),
                             lr=0.01,
                             weight_decay=1e-8)

# add all keywords informaiton into the database
@cluster.route("/add", methods = ['POST'])
def create():
    try:
        f = open("./data/keywords/data17_keywords.json")
        data = json.load(f)

        for i in data:
            if(i['count']>3):
                keyword_Ref.document(i["word"]).set(i)

        return jsonify({"success":True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"


# get all keywords
@cluster.route("/get_keywords/")
def get_keywords():
    try:
        r = [doc.to_dict() for doc in db.collection("keywords").stream()]

       #  r = [{'word':'doctor', 'embed_org':[-0.47217 ,  0.6159  , -0.66014 , -0.14621 , -0.47972 , -0.5676  ,
       #  0.45187 ,  0.46459 , -0.28348 , -0.65841 ,  0.37408 , -0.64374 ,
       # -3.3311  ,  0.31332 ,  0.20186 ,  0.17146 ,  0.64364 ,  0.20896 ,
       #  0.032482, -0.18989 , -0.89754 ,  0.96161 , -0.23398 , -0.43608 ,
       #  0.06871 , -0.85835 ,  0.073738, -0.17046 ,  0.5671  ,  0.095173,
       # -0.19376 , -0.39519 ,  0.10489 , -0.21169 , -1.0626  ,  0.49754 ,
       #  0.069216,  0.22753 ,  0.032369, -0.64101 , -0.50167 ,  0.051807,
       #  0.33079 ,  0.78594 ,  1.3322  , -0.070927,  0.67263 ,  0.23381 ,
       # -0.79125 , -0.68179 ]},
       #       {'word':'hospital', 'embed_org':[-0.18223  ,  0.6304   , -0.021521 , -1.3505   , -0.72393  ,
       # -0.69924  ,  0.19141  , -0.45778  , -0.33764  , -0.77185  ,
       #  0.098557 , -0.82078  , -2.8922   ,  0.69995  ,  1.3564   ,
       #  0.5572   , -0.11994  , -0.38727  , -0.50588  , -1.2812   ,
       # -0.31079  , -0.35784  , -0.74723  , -0.85957  ,  0.43311  ,
       # -1.047    ,  0.27786  , -0.19986  ,  0.40065  ,  0.39337  ,
       # -0.38845  , -1.1886   ,  0.23454  , -0.41575  , -0.97811  ,
       #  0.24249  , -0.73953  ,  1.4519   , -0.5752   , -0.37985  ,
       # -1.1416   ,  1.1943   ,  0.11853  , -0.16272  ,  0.81761  ,
       #  0.14566  ,  0.77147  , -0.084328 ,  0.0054293, -0.70157  ]},
       #       {'word':'amp', 'embed_org':[-0.19053 , -0.22582 , -0.27208 , -0.51274 , -0.69018 ,  0.14519 ,
       #  0.39647 , -0.45404 , -0.26173 ,  0.038437, -0.19332 ,  0.3406  ,
       # -1.9684  , -0.58284 ,  0.45881 , -0.021146,  0.32205 , -0.18879 ,
       #  0.26512 ,  0.89193 , -1.4667  ,  0.038873,  0.96009 ,  0.56756 ,
       # -0.29687 , -0.1466  , -0.68052 , -0.074448,  0.1254  ,  0.15544 ,
       #  0.56808 , -0.36459 , -0.75707 , -0.26858 ,  0.51679 , -0.33712 ,
       #  0.27872 ,  0.29727 ,  0.36768 ,  0.26662 , -0.41526 ,  0.98158 ,
       #  0.22143 , -0.17484 , -0.060216, -0.27132 , -0.49942 , -0.008062,
       # -0.099432,  0.57897 ]},
       #       {'word':'atlanta', 'embed_org':[ 0.31408 ,  0.33585 , -0.15744 , -0.89805 ,  0.6206  , -0.049425,
       #  1.298   ,  0.64882 ,  0.29923 , -0.95961 ,  0.22654 ,  0.62465 ,
       # -2.7977  ,  0.22434 ,  1.3488  , -0.80551 , -0.27418 ,  0.2946  ,
       # -0.17569 ,  0.42704 ,  0.96198 , -1.1208  , -0.27348 , -1.3771  ,
       #  0.44303 ,  0.044877,  0.46223 ,  0.36671 , -0.58547 , -0.029027,
       # -0.088001, -0.62449 , -0.65854 ,  0.11485 ,  0.21522 , -0.2104  ,
       # -0.059546,  0.82472 , -0.28952 ,  0.5162  , -0.63255 ,  0.7368  ,
       #  0.74042 , -0.038569, -0.11272 ,  0.019299,  0.57715 , -0.34351 ,
       # -0.12592 ,  0.88445 ]},
       #       {'word':'dentist', 'embed_org':[ 0.12656  ,  0.48518  , -0.47095  , -0.66545  , -0.5888   ,
       # -0.76569  ,  1.3305   ,  0.2382   , -0.28287  , -0.36154  ,
       # -0.083109 , -0.7041   , -2.3372   , -0.0040153,  0.63489  ,
       #  0.44541  ,  0.72529  , -0.64568  , -0.23374  , -0.68242  ,
       # -0.76633  ,  0.59887  , -0.20406  , -0.40447  ,  0.21632  ,
       #  0.6701   ,  0.084916 ,  0.70598  ,  0.27644  ,  0.17294  ,
       # -0.49171  , -0.91795  ,  0.3389   , -1.1541   , -1.2546   ,
       #  0.15008  , -0.60383  ,  1.3373   ,  0.63561  ,  0.66518  ,
       #  0.30311  ,  1.407    , -0.27104  ,  0.94444  ,  1.1868   ,
       # -0.68528  ,  0.83744  , -0.18813  ,  0.18078  ,  0.24328  ]},
       #       {'word':'day', 'embed_org':[-0.023769, -0.11603 ,  0.036396, -0.56461 ,  0.25198 ,  0.16734 ,
       #  1.2094  ,  0.14846 , -0.50951 , -0.27601 , -0.45884 , -0.55841 ,
       # -4.898   ,  0.93906 , -0.62257 ,  0.32134 , -0.51667 , -0.2758  ,
       # -1.1148  ,  0.26091 , -0.4425  ,  0.29604 , -0.48687 ,  0.35057 ,
       #  0.66408 ,  0.75508 , -0.057016, -0.72358 ,  0.89502 , -0.013292,
       # -0.2776  , -0.20826 ,  0.2106  ,  0.29681 ,  0.36548 ,  0.30672 ,
       # -0.13076 ,  0.21129 ,  0.20262 ,  0.79409 , -1.865   , -0.13894 ,
       #  0.45723 ,  0.25402 ,  0.23568 ,  0.45535 , -0.081599, -0.54011 ,
       # -0.34151 ,  0.34558 ]},
       #       {'word':'time', 'embed_org':[ 0.41634  ,  0.15641  ,  0.5826   , -0.79235  ,  0.0084685,
       #  0.77491  ,  1.5139   , -0.11113  ,  0.15396  ,  0.39591  ,
       # -0.39555  , -0.56452  , -4.7693   ,  0.55189  , -0.21498  ,
       #  0.47684  , -0.068604 , -0.17688  , -0.92728  , -0.60223  ,
       # -0.42745  ,  0.22807  ,  0.23677  , -0.071969 ,  0.077914 ,
       # -0.10567  ,  0.21887  , -0.51207  ,  0.33831  ,  0.025884 ,
       #  0.27938  , -0.28888  , -0.028909 ,  0.063298 , -0.41051  ,
       #  0.21599  ,  0.33389  , -0.49653  , -0.1978   ,  0.28866  ,
       # -1.5261   ,  0.394    ,  0.45777  , -0.40793  ,  0.43856  ,
       #  0.11632  , -0.5655   , -0.09763  , -0.010292 ,  0.084051 ]},
       #       {'word':'photo', 'embed_org':[ 1.8889e-02, -6.6964e-02,  7.5847e-03, -1.6350e-01,  2.8442e-01,
       # -1.1037e+00,  1.3350e+00, -5.4787e-01, -7.7210e-02, -3.6094e-01,
       # -1.7607e-01,  2.1967e-01, -3.3604e+00,  2.1940e-01, -6.0032e-01,
       #  1.0951e+00,  3.7251e-02,  1.6277e-01, -3.8859e-01,  2.3808e-01,
       # -7.5854e-02, -1.2924e+00,  3.2795e-02, -1.0192e+00, -6.3853e-01,
       # -1.1663e-01, -7.9061e-01,  9.4877e-01,  2.2112e-01,  2.6854e-01,
       # -8.7816e-01,  1.1268e-02, -1.0672e+00, -1.1044e+00,  1.2751e+00,
       #  2.0405e-01, -3.0704e-03, -1.7304e-01,  9.4271e-01, -5.2332e-01,
       # -1.6603e+00, -1.1846e+00, -2.2440e-01,  8.1640e-01, -3.1042e-01,
       #  5.0453e-01, -4.9764e-03, -3.5827e-01, -1.2190e-01, -7.8337e-01]},
       #       {'word':'people', 'embed_org':[ 1.4653  ,  0.4827  , -0.40154 ,  0.49617 , -0.064664,  0.19402 ,
       #  1.1529  , -0.25391 , -0.65568 ,  0.39314 , -0.23242 , -0.54759 ,
       # -5.9369  , -0.1678  , -0.40717 ,  0.037684, -0.51207 , -1.0888  ,
       #  0.57874 , -0.19676 ,  0.37193 , -0.49809 , -0.27604 ,  0.048082,
       # -0.025623,  0.56169 , -0.11208 ,  0.53506 , -0.055724, -0.46438 ,
       # -0.32966 , -0.23861 ,  0.42022 ,  0.90211 ,  0.30089 ,  0.36207 ,
       # -0.27843 ,  0.071501, -0.10397 , -0.50396 , -0.4862  ,  0.55174 ,
       #  0.1364  , -0.39755 , -0.067713, -0.15111 ,  0.50654 ,  0.74334 ,
       # -0.10117 ,  0.077996]},
       #       {'word':'years', 'embed_org':[-0.16466 ,  0.38484 ,  0.64875 ,  0.010425,  0.17937 , -0.16356 ,
       #  0.75322 ,  0.27259 , -0.53949 , -0.26783 ,  0.39955 , -0.7265  ,
       # -4.782   ,  1.1019  ,  0.082079, -0.04801 , -0.55281 ,  0.02107 ,
       # -0.7658  ,  0.28348 ,  0.35525 ,  0.60108 , -0.029929, -0.28074 ,
       #  0.066037,  0.88244 , -0.46898 , -1.1262  ,  0.50201 ,  0.13834 ,
       #  0.12958 , -0.16835 , -0.285   ,  0.42938 ,  0.47395 ,  0.22068 ,
       # -0.036066,  0.35217 , -0.033939, -0.55883 , -0.74783 , -0.14553 ,
       #  0.19803 ,  0.11143 ,  0.057772, -0.70773 , -0.31303 , -0.026651,
       # -0.64332 ,  0.59538 ]}]

        for i in r:
            i['embed_org'] = np.array(i['embed_org'])

        # save the model
        model.load_state_dict(torch.load('./model/init_model'))
        model.eval()

        data = torch.stack([torch.from_numpy(arr['embed_org']) for arr in r]).to(torch.float32)

        inter, reconstructed = model(data)

        two_dim = []
        for i in inter:
            two_dim.append(i.detach().numpy())

        n_clusters_,labels = find_cluster(two_dim)
        clus = []
        keyword_df = []
        for i in range(n_clusters_):
            dict = {'cluster':i, 'number':labels.count(i)}
            key = []
            for j in range(len(labels)):
                keyword_df.append({'word':r[j]['word'],'embed_two':two_dim[j].tolist(),'cluster':labels[j], 'embed_org':r[j]['embed_org'].tolist()})
                if labels[j] == i:
                    key.append(r[j]['word'])
            dict['keyword'] = key
            clus.append(dict)
        return jsonify({'clus': clus, 'keyword': keyword_df}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# get all constrains
@cluster.route("/get_constraints/")
def get_constraints():
    try:
        r = [doc.to_dict() for doc in db.collection("constraints").stream()]
        return jsonify(r), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# add a new triplet constrain
@cluster.route("/add_constraint/", methods = ['POST'])
def add_constraint():
    try:
        anchor = request.json["anchor"]
        positive = request.json["positive"]
        negative = request.json["negative"]

        new_ref = db.collection("constraints").document()

        key = new_ref.get().id

        new_ref.set(
            {"id": key, "anchor": anchor,"positive": positive, 'negative':negative}
        )
        return jsonify({"id": key, "anchor": anchor,"positive": positive, 'negative':negative}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

# get a keyword's context
@cluster.route("/get_context/<word>/")
def get_context(word):
    try:
        result = []

        # data = [doc.to_dict() for doc in db.collection("17data").document('17').collection("tweets").stream()]

        f = open("./data/17data/data17.json")
        data = json.load(f)

        for i in data:
            if (word in i['text']) and (i['text'] not in result):
                result.append(i)

        return jsonify(result), 200
    except Exception as e:
        return f"An Error Occured: {e}"

# re_cluster
@cluster.route("/re_cluster/")
def re_cluster():
    try:
        r = [doc.to_dict() for doc in db.collection("keywords").stream()]

        # r = [{'word': 'doctor', 'embed_org': [-0.47217, 0.6159, -0.66014, -0.14621, -0.47972, -0.5676,
        #                                       0.45187, 0.46459, -0.28348, -0.65841, 0.37408, -0.64374,
        #                                       -3.3311, 0.31332, 0.20186, 0.17146, 0.64364, 0.20896,
        #                                       0.032482, -0.18989, -0.89754, 0.96161, -0.23398, -0.43608,
        #                                       0.06871, -0.85835, 0.073738, -0.17046, 0.5671, 0.095173,
        #                                       -0.19376, -0.39519, 0.10489, -0.21169, -1.0626, 0.49754,
        #                                       0.069216, 0.22753, 0.032369, -0.64101, -0.50167, 0.051807,
        #                                       0.33079, 0.78594, 1.3322, -0.070927, 0.67263, 0.23381,
        #                                       -0.79125, -0.68179]},
        #      {'word': 'hospital', 'embed_org': [-0.18223, 0.6304, -0.021521, -1.3505, -0.72393,
        #                                         -0.69924, 0.19141, -0.45778, -0.33764, -0.77185,
        #                                         0.098557, -0.82078, -2.8922, 0.69995, 1.3564,
        #                                         0.5572, -0.11994, -0.38727, -0.50588, -1.2812,
        #                                         -0.31079, -0.35784, -0.74723, -0.85957, 0.43311,
        #                                         -1.047, 0.27786, -0.19986, 0.40065, 0.39337,
        #                                         -0.38845, -1.1886, 0.23454, -0.41575, -0.97811,
        #                                         0.24249, -0.73953, 1.4519, -0.5752, -0.37985,
        #                                         -1.1416, 1.1943, 0.11853, -0.16272, 0.81761,
        #                                         0.14566, 0.77147, -0.084328, 0.0054293, -0.70157]},
        #      {'word': 'amp', 'embed_org': [-0.19053, -0.22582, -0.27208, -0.51274, -0.69018, 0.14519,
        #                                    0.39647, -0.45404, -0.26173, 0.038437, -0.19332, 0.3406,
        #                                    -1.9684, -0.58284, 0.45881, -0.021146, 0.32205, -0.18879,
        #                                    0.26512, 0.89193, -1.4667, 0.038873, 0.96009, 0.56756,
        #                                    -0.29687, -0.1466, -0.68052, -0.074448, 0.1254, 0.15544,
        #                                    0.56808, -0.36459, -0.75707, -0.26858, 0.51679, -0.33712,
        #                                    0.27872, 0.29727, 0.36768, 0.26662, -0.41526, 0.98158,
        #                                    0.22143, -0.17484, -0.060216, -0.27132, -0.49942, -0.008062,
        #                                    -0.099432, 0.57897]},
        #      {'word': 'atlanta', 'embed_org': [0.31408, 0.33585, -0.15744, -0.89805, 0.6206, -0.049425,
        #                                        1.298, 0.64882, 0.29923, -0.95961, 0.22654, 0.62465,
        #                                        -2.7977, 0.22434, 1.3488, -0.80551, -0.27418, 0.2946,
        #                                        -0.17569, 0.42704, 0.96198, -1.1208, -0.27348, -1.3771,
        #                                        0.44303, 0.044877, 0.46223, 0.36671, -0.58547, -0.029027,
        #                                        -0.088001, -0.62449, -0.65854, 0.11485, 0.21522, -0.2104,
        #                                        -0.059546, 0.82472, -0.28952, 0.5162, -0.63255, 0.7368,
        #                                        0.74042, -0.038569, -0.11272, 0.019299, 0.57715, -0.34351,
        #                                        -0.12592, 0.88445]},
        #      {'word': 'dentist', 'embed_org': [0.12656, 0.48518, -0.47095, -0.66545, -0.5888,
        #                                        -0.76569, 1.3305, 0.2382, -0.28287, -0.36154,
        #                                        -0.083109, -0.7041, -2.3372, -0.0040153, 0.63489,
        #                                        0.44541, 0.72529, -0.64568, -0.23374, -0.68242,
        #                                        -0.76633, 0.59887, -0.20406, -0.40447, 0.21632,
        #                                        0.6701, 0.084916, 0.70598, 0.27644, 0.17294,
        #                                        -0.49171, -0.91795, 0.3389, -1.1541, -1.2546,
        #                                        0.15008, -0.60383, 1.3373, 0.63561, 0.66518,
        #                                        0.30311, 1.407, -0.27104, 0.94444, 1.1868,
        #                                        -0.68528, 0.83744, -0.18813, 0.18078, 0.24328]},
        #      {'word': 'day', 'embed_org': [-0.023769, -0.11603, 0.036396, -0.56461, 0.25198, 0.16734,
        #                                    1.2094, 0.14846, -0.50951, -0.27601, -0.45884, -0.55841,
        #                                    -4.898, 0.93906, -0.62257, 0.32134, -0.51667, -0.2758,
        #                                    -1.1148, 0.26091, -0.4425, 0.29604, -0.48687, 0.35057,
        #                                    0.66408, 0.75508, -0.057016, -0.72358, 0.89502, -0.013292,
        #                                    -0.2776, -0.20826, 0.2106, 0.29681, 0.36548, 0.30672,
        #                                    -0.13076, 0.21129, 0.20262, 0.79409, -1.865, -0.13894,
        #                                    0.45723, 0.25402, 0.23568, 0.45535, -0.081599, -0.54011,
        #                                    -0.34151, 0.34558]},
        #      {'word': 'time', 'embed_org': [0.41634, 0.15641, 0.5826, -0.79235, 0.0084685,
        #                                     0.77491, 1.5139, -0.11113, 0.15396, 0.39591,
        #                                     -0.39555, -0.56452, -4.7693, 0.55189, -0.21498,
        #                                     0.47684, -0.068604, -0.17688, -0.92728, -0.60223,
        #                                     -0.42745, 0.22807, 0.23677, -0.071969, 0.077914,
        #                                     -0.10567, 0.21887, -0.51207, 0.33831, 0.025884,
        #                                     0.27938, -0.28888, -0.028909, 0.063298, -0.41051,
        #                                     0.21599, 0.33389, -0.49653, -0.1978, 0.28866,
        #                                     -1.5261, 0.394, 0.45777, -0.40793, 0.43856,
        #                                     0.11632, -0.5655, -0.09763, -0.010292, 0.084051]},
        #      {'word': 'photo', 'embed_org': [1.8889e-02, -6.6964e-02, 7.5847e-03, -1.6350e-01, 2.8442e-01,
        #                                      -1.1037e+00, 1.3350e+00, -5.4787e-01, -7.7210e-02, -3.6094e-01,
        #                                      -1.7607e-01, 2.1967e-01, -3.3604e+00, 2.1940e-01, -6.0032e-01,
        #                                      1.0951e+00, 3.7251e-02, 1.6277e-01, -3.8859e-01, 2.3808e-01,
        #                                      -7.5854e-02, -1.2924e+00, 3.2795e-02, -1.0192e+00, -6.3853e-01,
        #                                      -1.1663e-01, -7.9061e-01, 9.4877e-01, 2.2112e-01, 2.6854e-01,
        #                                      -8.7816e-01, 1.1268e-02, -1.0672e+00, -1.1044e+00, 1.2751e+00,
        #                                      2.0405e-01, -3.0704e-03, -1.7304e-01, 9.4271e-01, -5.2332e-01,
        #                                      -1.6603e+00, -1.1846e+00, -2.2440e-01, 8.1640e-01, -3.1042e-01,
        #                                      5.0453e-01, -4.9764e-03, -3.5827e-01, -1.2190e-01, -7.8337e-01]},
        #      {'word': 'people', 'embed_org': [1.4653, 0.4827, -0.40154, 0.49617, -0.064664, 0.19402,
        #                                       1.1529, -0.25391, -0.65568, 0.39314, -0.23242, -0.54759,
        #                                       -5.9369, -0.1678, -0.40717, 0.037684, -0.51207, -1.0888,
        #                                       0.57874, -0.19676, 0.37193, -0.49809, -0.27604, 0.048082,
        #                                       -0.025623, 0.56169, -0.11208, 0.53506, -0.055724, -0.46438,
        #                                       -0.32966, -0.23861, 0.42022, 0.90211, 0.30089, 0.36207,
        #                                       -0.27843, 0.071501, -0.10397, -0.50396, -0.4862, 0.55174,
        #                                       0.1364, -0.39755, -0.067713, -0.15111, 0.50654, 0.74334,
        #                                       -0.10117, 0.077996]},
        #      {'word': 'years', 'embed_org': [-0.16466, 0.38484, 0.64875, 0.010425, 0.17937, -0.16356,
        #                                      0.75322, 0.27259, -0.53949, -0.26783, 0.39955, -0.7265,
        #                                      -4.782, 1.1019, 0.082079, -0.04801, -0.55281, 0.02107,
        #                                      -0.7658, 0.28348, 0.35525, 0.60108, -0.029929, -0.28074,
        #                                      0.066037, 0.88244, -0.46898, -1.1262, 0.50201, 0.13834,
        #                                      0.12958, -0.16835, -0.285, 0.42938, 0.47395, 0.22068,
        #                                      -0.036066, 0.35217, -0.033939, -0.55883, -0.74783, -0.14553,
        #                                      0.19803, 0.11143, 0.057772, -0.70773, -0.31303, -0.026651,
        #                                      -0.64332, 0.59538]}]


        for i in r:
            i['embed_org'] = np.array(i['embed_org'])
        con = [doc.to_dict() for doc in db.collection("constraints").stream()]
        two_dim = auto_encoder(r,con)


        n_clusters_, labels = find_cluster(two_dim)

        clus = []
        keyword_df = []

        for i in range(n_clusters_):
            dict = {'cluster': i, 'number': labels.count(i)}
            key = []
            for j in range(len(labels)):
                keyword_df.append({'word': r[j]['word'], 'embed_two': two_dim[j].tolist(), 'cluster': labels[j],
                                   'embed_org': r[j]['embed_org'].tolist()})
                if labels[j] == i:
                    key.append(r[j]['word'])
            dict['keyword'] = key
            clus.append(dict)
        return jsonify({'clus': clus, 'keyword': keyword_df}), 200


    except Exception as e:
        return f"An Error Occured: {e}"

def auto_encoder(data, con):
    triplet_margin_loss = nn.TripletMarginLoss(margin=1.0, p=2)

    embedding = DataLoader(data, batch_size=len(data), shuffle=False)


    # run model
    epochs = 50
    outputs = []
    losses = []
    for epoch in range(epochs):

        for i_batch, sample_batched in enumerate(embedding):
            em = sample_batched['embed_org'].to(torch.float32)
            keyword = sample_batched['word']

            # clear gradient accumulators
            model.zero_grad()
            inter, reconstructed = model(em)


            anchor = []
            positive = []
            negative = []
            for c in con:
                anchor.append(reconstructed[keyword.index(c['anchor']['word'])])
                positive.append(reconstructed[keyword.index(c['positive']['word'])])
                negative.append(reconstructed[keyword.index(c['negative']['word'])])
            anchor = torch.stack(anchor, dim=0).to(torch.float32)
            positive = torch.stack(positive, dim=0).to(torch.float32)
            negative = torch.stack(negative, dim=0).to(torch.float32)

            # Calculating the loss function
            loss = triplet_margin_loss(anchor, positive, negative)

            # The gradients are set to zero,
            # the gradient is computed and stored.
            # .step() performs parameter update
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            # Storing the losses in a list for plotting
            losses.append(loss)
            outputs.append((epochs, keyword, inter))


    data = torch.stack([torch.from_numpy(arr['embed_org']) for arr in data]).to(torch.float32)

    inter, reconstructed = model(data)

    encoder_result = []
    for i in inter:
        encoder_result.append(i.detach().numpy())

    return encoder_result

# initialize auto-encoder
@cluster.route("/init_auto_encoder/")
def init_auto_encoder():

    r = [doc.to_dict() for doc in db.collection("keywords").stream()]

    for i in r:
        i['embed_org'] = np.array(i['embed_org'])

    # split the data
    trainDF, testDF = train_test_split(r, test_size=0.2, random_state=0)
    train = DataLoader(trainDF, batch_size=100, shuffle=True)
    test =  DataLoader(testDF, batch_size=10, shuffle=True)

    # Model Initialization
    model = AE()
    # Using an Adam Optimizer with lr = 0.1
    optimizer = torch.optim.Adam(model.parameters(),
                                 lr=0.01,
                                 weight_decay=1e-8)

    # MAE
    loss_function = torch.nn.L1Loss()

    # initialize the early_stopping object
    early_stopping = EarlyStopping(patience=5, verbose=True)

    # run model
    epochs = 100
    outputs = []
    losses = []
    valid_losses = []
    for epoch in range(epochs):
        model.train()
        for i_batch, sample_batched in enumerate(train):

            em = sample_batched['embed_org'].to(torch.float32)
            keyword = sample_batched['word']

            # clear gradient accumulators
            model.zero_grad()

            inter, reconstructed = model(em)
            loss = loss_function(reconstructed, em)

            # The gradients are set to zero,
            # the gradient is computed and stored.
            # .step() performs parameter update
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            # Storing the losses in a list for plotting
            losses.append(loss)
            outputs.append((epochs, keyword, inter))

            model.eval()  # prep model for evaluation
            for data, target in enumerate(test):

                em = target['embed_org'].to(torch.float32)
                keyword = target['word']

                inter, reconstructed = model(em)
                loss = loss_function(reconstructed, em)

                # record validation loss
                valid_losses.append(loss.item())

            valid_loss = np.average(valid_losses)
            valid_losses = []
            # early_stopping needs the validation loss to check if it has decresed,
            # and if it has, it will make a checkpoint of the current model
            early_stopping(valid_loss, model)

            if early_stopping.early_stop:
                print("Early stopping")
                break

    # load the last checkpoint with the best model
    model.load_state_dict(torch.load('checkpoint.pt'))

    torch.save(model.state_dict(), './model/init_model')

    # data = torch.stack([torch.from_numpy(arr['embed_org']) for arr in r]).to(torch.float32)
    #
    # inter, reconstructed = model(data)
    #
    # encoder_result = []
    # for i in inter:
    #     encoder_result.append(i.detach().numpy())
    #
    # return  encoder_result
    return jsonify({"success":True}), 200



def find_cluster(X):

    # dbscan = DBSCAN(eps=0.6, min_samples=5).fit(X)
    # labels = dbscan.labels_
    # Number of clusters in labels, ignoring noise if present.
    # n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

    # m = len(X)
    # distances = np.zeros((m, m))
    # for i in range(m):
    #     for j in range(m):
    #         distances[i, j] = cosine(X[i], X[j])
    # af = AffinityPropagation(random_state=0, affinity='precomputed').fit(distances)

    af = AffinityPropagation(preference=-30, random_state=0).fit(X)


    cluster_centers_indices = af.cluster_centers_indices_
    labels = af.labels_
    n_clusters_ = len(cluster_centers_indices)

    # print(labels,flush=True)



    # n_noise_ = list(labels).count(-1)
    #
    # print("Estimated number of clusters: %d" % n_clusters_)
    # print("Estimated number of noise points: %d" % n_noise_)

    # result = []

    # for i in range(n_clusters_):
    #     s = str(i) + ": "
    #     for j in range(len(labels)):
    #         if labels[j] == i:
    #             result.append([i, word[j]])
    #             s = s + word[j] + ", "

    return n_clusters_,labels.tolist()


# delete all constrains
@cluster.route("/reset_con/", methods = ['DELETE'])
def reset_con():
    try:
        # Get all documents in the collection
        docs = db.collection("constraints").stream()

        # Delete each document
        for doc in docs:
            doc.reference.delete()
        return jsonify({"success":True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"