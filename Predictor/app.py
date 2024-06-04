import os
from io import StringIO

import flask
import pandas as pd
from flask import Flask, request
import prophet_script
import json
import requests

from flask_cors import CORS

from woocommerce import API

ALLOWED_EXTENSIONS = {'txt', 'xlsx', 'csv'}

app = Flask(__name__)
CORS(app)
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=['GET', 'POST'])
def asdf():
     return "Dupa"


@app.route("/predict", methods=['POST'])
def connecttomodel():
     if 'file' not in request.files:
          return 'No file part in the request', 400
     file = request.files['file']

     if file.filename == '':
          return 'No file selected for uploading', 400

     model = request.args.get('model')
     try:
          country = request.form.get('country')
          industry = request.form.get('industry')
          isRetail = False if request.form.get('isRetail') == '0' else True
          period = 30 if request.form.get('period') == None else int(request.form.get('period'))
          freq = 'D' if request.form.get('frequency') == None else request.form.get('frequency')
          file.save("woof.csv") #TODO: Dont do it like that

          df = pd.read_csv("woof.csv", header=None, names=['ds', 'y'])
          if df['ds'][0] == "ds":
               df = df.tail(-1)

          os.remove("woof.csv")
          data = prophet_script.useProphet(country, industry, isRetail, period, freq, df)
          # rm file?

          return data

     except Exception as e:
          print(e)
          return ['Incorrect parameters', 400]


@app.route("/predict-woo", methods=['GET'])
def handleWoo():
     country = request.args.get('country')
     industry = request.args.get('industry')
     isRetail = False if request.args.get('isRetail') == '0' else True
     period = 30 if request.args.get('period') == None else int(request.form.get('period'))
     freq = 'D' if request.args.get('frequency') == None else request.form.get('frequency')

     domain = request.args.get('user-id')
     print(str(abs(hash(domain))))

     print(domain)
     print(request.args)
     try:
          with open(str(abs(hash(domain)))) as json_file:
               data = json.load(json_file)
     except Exception as e:
          return ['No keys', 400, str(e)]

     wcapi = API(
          url="https://" + domain,
          consumer_key=data.get("consumer_key"),
          consumer_secret=data.get("consumer_secret"),
          wp_api=True,
          version="wc/v3"
     )


     response = wcapi.get("reports/sales")
     print(response.text)

     return response.text

@app.route("/store-keys", methods=['POST'])
def storekeys():
     data = request.form.to_dict()
     path = data.get("user-id")

     with open(path, 'w') as f:
          json.dump(data, f, indent=4)

     return

@app.route("/predict", methods=['GET'])
def localconnecttomodel():

     model = request.args.get('model')
     try:
          country = request.args.get('country')
          industry = request.args.get('industry')
          isRetail = False if request.args.get('isRetail') == '0' else True
          period = 30 if request.args.get('period') == None else int(request.args.get('period'))
          freq = 'D' if request.args.get('frequency') == None else request.args.get('frequency')
          filename = "Chemia.csv" if request.args.get('filename') == None else request.args.get('filename')
          df = pd.read_csv(filename)
          data = prophet_script.useProphet(country, industry, isRetail, period, freq, df)
          # rm file?


          if data == 1:
               return "Processing failed", 400
          return data
     except:
          return ['Incorrect parameters', 400]

if __name__ == '__main__':
     app.run(debug=True, host="0.0.0.0", ssl_context='adhoc')

