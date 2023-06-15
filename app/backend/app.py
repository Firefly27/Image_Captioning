from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from flask_cors import CORS, cross_origin
import base64
from PIL import Image

app= Flask(__name__)
app.secret_key = "secret key"
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/api/caption": {"origins": "http://localhost:3000"}})

model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

max_length = 16
num_beams = 4
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}
def predict_step(image_paths, flag,i):
  angle = [0,15,30,45,60,75,90]
  if flag==0:
     angle=[0]      
  images = []
  for image_path in image_paths:
    i_image = Image.open(image_path)
    if i_image.mode != "RGB":
      i_image = i_image.convert(mode="RGB")
    i_image = i_image.rotate(angle[i], expand=True)
    images.append(i_image)

  pixel_values = feature_extractor(images=images, return_tensors="pt").pixel_values
  pixel_values = pixel_values.to(device)

  output_ids = model.generate(pixel_values, **gen_kwargs)

  preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
  preds = [pred.strip() for pred in preds]
  return preds


@app.route('/',methods=['GET'])
def image_caption():
    return render_template('index.html')


@app.route('/api/caption',methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def generate():
    img_string = request.form.get("imageString")

    metadata = img_string[:22]

    index1 = metadata.find('data:image/') + 11
    index2 = metadata.find(';base64')
    
    img_string = img_string[22:]

    imgData = base64.b64decode(img_string)
    filename = './static/images/image.png'
    with open(filename, 'wb') as f:
        f.write(imgData)

    if request.form.get("captionType") == 'single':
       result=['Caption:']
       result.append('%s' % (predict_step([filename],0,0)[0].title()))
    else:
       result=['Caption: ']
       for i in range(7):
          res = '%s, ' % (predict_step([filename],1,i)[0].title())
          if res not in result:
             result.append(res)

    response = jsonify(status = 200, captions=result)
    return response



if __name__=='__main__':
    app.run(port=3000, debug=True)