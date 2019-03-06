from flask import Flask, request
from summarizer import extract_summary_and_keywords_from_pdf
from firebase import firebase
import csv
import json

app = Flask(__name__)

firebase = firebase.FirebaseApplication('https://reddys-4fd1a.firebaseio.com', None)

@app.route("/upload_file",methods=['POST'])
def upload_file():
    """Upload file, extract knowledge and post to firebase"""
    if request.method == 'POST':
        class_type = request.form['classType']
        f = request.files['uploadedFile']
        
        path = 'reports/docs/{}'.format(f.filename)
        f.save(path)
        knowledge_dict = {class_type:path}
        extract_summary_and_keywords_from_pdf(knowledge_dict)
        return str(200)

@app.route("/classes_csv_molecules",methods=['POST', 'GET'])
def classes_csv_molecules():
    x = firebase.get('/update', "")
    # data_json = json.dumps(data_dict)
    # x = json.loads(data_json)
    # print(x)
    f = csv.writer(open("therapy.csv", "w"))
    f.writerow(['document_id', 'topic', 'link', 'class_type'])
    print(x.items())
    for key, value in x.items():
        f.writerow([value["document_id"],
                value["topic"],
                value["link"],
                value["class_type"]])
    return str(200)

@app.route("/classes_csv_therapy", methods=['POST', 'GET'])
def classes_csv_therapy():
        x = firebase.get('/update', "")
        print(x.keys()[0])

        return 'good'





 
if __name__ == "__main__":
    app.run(debug=True)