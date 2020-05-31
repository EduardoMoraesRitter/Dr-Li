import os
from flask import Flask
from flask import request

app = Flask(__name__)

import json
from ibm_watson import VisualRecognitionV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
def watson(name):
    authenticator = IAMAuthenticator('Im36HNqglBlVquN3JHIr6M_kIj7hqLzM481nEFTAaTxe')
    visual_recognition = VisualRecognitionV3(
        version='2018-03-19',
        authenticator=authenticator
    )

    visual_recognition.set_service_url('https://api.us-south.visual-recognition.watson.cloud.ibm.com')

    with open('data/'+name+'.png', 'rb') as images_file:
        classes = visual_recognition.classify(
            images_file=images_file,
            threshold='0.6',
            owners=["me"]).get_result()
        print(json.dumps(classes, indent=2))
        return json.dumps(classes, indent=2)

import numpy as np
import os
import librosa
import librosa.display
from matplotlib import pyplot as plt
def lib(name):
    #print(name)
    audio, sr = librosa.load('data/'+name+'.wav', sr=22000)#, duration=1)
    # print(audio, sr)
    audio_array = np.array(audio)
    #print(audio_array)
    audio_feature = librosa.feature.melspectrogram(y=audio_array,sr=22000)
    #print(audio_feature)
    audio_db = librosa.power_to_db(audio_feature,ref=np.max)
    print(audio_db)

    alt, lar = audio_db.shape
    aux_altura = 20
    aux_largura = (lar*aux_altura)/alt

    fig = plt.figure(figsize=(aux_largura, aux_altura))
    librosa.display.specshow(audio_db, sr=sr)
    fig.tight_layout()
    fig.savefig('data/'+name+'.png')
    plt.close(fig)
    plt.cla()

    return "ok"

import requests
import ffmpeg
import wave
def pegaaudio(name):
    url = "https://waent-lb-1220480723.us-east-1.elb.amazonaws.com/v1/media/"+name
    headers = {"Content-Type": "audio/wav", "Authorization":"Bearer eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE1OTAzNTE2NzUsImV4cCI6MTU5MDk1NjQ3NSwid2E6cmFuZCI6NzEwMjQ5NDYwOTI2MzE3MTkxfQ.ZBWsORoi9xJIqOccnxnV-d4H6ABfYajEDkdXLfacIfE"}
    r = requests.get(url=url,headers=headers, verify=False)

    print(r.status_code)
    print(r.headers)

    #name = name.replace('-','')

    with open('data/'+name+".ogg", "wb") as file:
        file.write(r.content)

    out, _ = (
    ffmpeg.input('data/'+name+'.ogg')    
    .output('-', format='s16le', acodec='pcm_s16le', ac=1, ar='22k')
    .overwrite_output()
    .run(capture_stdout=True)
    )
    wf = wave.open('data/'+name+'.wav', 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(22000)
    wf.writeframes(out)
    wf.close()

    return "ok1"

@app.route("/")
def index():
    media = request.args.get('media')
    print(media)
    nome = media#'813e7307-43df-4c8c-9b91-143978b273a1'
    pegaaudio(nome)
    lib(nome)
    volta = watson(nome)
    print(volta)
    return volta

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
