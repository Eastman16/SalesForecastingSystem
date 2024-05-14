import os

from flask import Flask, request
import prophet_script
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '.\harvesteddata'
ALLOWED_EXTENSIONS = {'txt', 'xlsx', 'csv'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/post-data", methods=["POST"])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return 'No selected file', 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return 'Created', 201


@app.route("/predict", methods=['GET'])
def connecttomodel():

     model = request.args.get('model')
     try:
          country = request.args.get('country')
          industry = request.args.get('industry')
          isRetail = False if request.args.get('isRetail') == '0' else True
          period = 30 if request.args.get('period') == None else int(request.args.get('period'))
          freq = 'D' if request.args.get('frequency') == None else request.args.get('frequency')
          filename = request.args.get('filename')
          if filename == None:
               return ['Include filename parameter', 400]
          #TODO: Work around the security vulnerability :>
          print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
          data = prophet_script.useProphet(country, industry, isRetail, period, freq, os.path.join(app.config['UPLOAD_FOLDER'], filename))
          # rm file?

          if data == 1:
               return "Processing failed", 400
          return data
     except:
          return ['Incorrect parameters', 400]

if __name__ == '__main__':
     app.run(debug=True)

