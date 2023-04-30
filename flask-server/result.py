import pickle
import csv
import json


ct_list = ["13089021211", "13089021213", "13089021503", "13089021604", "13089023412", "13089023504", "13089023801", "13121006602",
"13121006802", "13121007603" , "13121007604", "13121007808", "13121010107", "13121010206", "13121010400", "13121011504", "13121012000"]

remove = ["doctor strange","lot","amp", "gapol", "sure"]

# Deserialize the dictionary from the file
with open('./model/input_3.pickle', 'rb') as f:
    topics = pickle.load(f)

with open('./result/user_input_3.csv', 'w') as csvfile:
    # creating a csv writer object
    csvwriter = csv.writer(csvfile)

    for ct in ct_list:
        list = [ct]

        # Open the JSON file in read mode
        with open('./data/17data/ct/' + ct + '_health.json', 'r') as f:
            # Load the JSON data from the file
            data = json.load(f)

            for j in topics:
                count = 0
                keyword = j['keyword']
                for tweet in data:
                    for word in keyword:
                        if word in remove:
                            continue
                        if word in tweet['text']:
                            count += 1
                            break

                list.append(count)
        csvwriter.writerow(list)