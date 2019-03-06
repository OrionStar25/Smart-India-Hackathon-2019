import json

with open('data/reddy.json') as json_data:
  data = json.load(json_data)
  for key, value in data.items(): 
    for key, value in value.items():
      del value['keywords']
      del value['summarized_text']
      del value['timestamp']
  with open('data/reddy_final.json', 'w') as outfile:
    json.dump(data, outfile, sort_keys=True,indent=4)      

  