from flask import Flask, request, jsonify, render_template, url_for
import util


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('app.html')

@app.route('/classify_image',methods=['GET','POST'])
def classify_image():
  
  print(" Request files:", request.files)
  image_data = request.form['image_data']
  response = jsonify(util.classify_image(image_data))


  response.headers.add('Access-Control-Allow-Origin','*')

  return response



if __name__ == "__main__":
  print("Starting Python Flask Server for Soccer Players Images Classification")
  util.load_saved_artifacts()
  app.run(port=5000) 