import os
from flask import Flask

app = Flask(__name__)


import numpy as np
import os
import librosa
import librosa.display
from matplotlib import pyplot as plt
def lib(aux_name):
    #print(file)
    audio, sr = librosa.load('1parte.wav', sr=22000)#, duration=2)
    print(audio, sr)
    audio_array = np.array(audio)
    #print(audio_array)
    audio_feature = librosa.feature.melspectrogram(y=audio_array,sr=22000)
    #print(audio_feature)
    audio_db = librosa.power_to_db(audio_feature,ref=np.max)
    print(audio_db)

    wav='aaaaaaaaaaaaaaaa.wav'
    fig = plt.figure(figsize=(16, 4))
    librosa.display.specshow(audio_db, sr=sr)
    # #librosa.display.waveplot(audio_db, sr=fs)
    fig.tight_layout()
    wav = wav.split('/')[-1].split('.')[0]
    fig.savefig(wav + '.png')
    plt.close(fig)
    plt.cla()

    return "ok"


import json
from watson_developer_cloud import VisualRecognitionV3
def watson(aux_name):
    visual_recognition = VisualRecognitionV3(
        '2018-03-19',
        iam_apikey='8ivX_fDlMeHa9fQ4Tr3WKftZyKtgy3qW1rNUFd8312Jy')

    #with open('1parte2.png', 'rb') as images_file:
    with open(aux_name, 'rb') as images_file:
        classes = visual_recognition.classify(
            images_file,
            threshold='0.6',
        classifier_ids='kkkkk_1433712665').get_result()
    print(json.dumps(classes, indent=2))

    return json.dumps(classes, indent=2)


import requests
def pegaaudio(media):
    url = "https://waent-lb-1220480723.us-east-1.elb.amazonaws.com/v1/media/"+media
    headers = {"Content-Type": "application/json", "Authorization":"Bearer eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE1OTAzNTE2NzUsImV4cCI6MTU5MDk1NjQ3NSwid2E6cmFuZCI6NzEwMjQ5NDYwOTI2MzE3MTkxfQ.ZBWsORoi9xJIqOccnxnV-d4H6ABfYajEDkdXLfacIfE"}
    x = requests.get(url=url,headers=headers, verify=False)

    print(x.status_code)
    #print(x)
    #print(x.text)

    return x.text



@app.route("/")
def index():

    #a = pegaaudio('813e7307-43df-4c8c-9b91-143978b273a1')
    aux_name = 'aaa'
    b = lib(aux_name)
    #c = watson(aux_name)
    #print(b)
    volta = "<h1>v23 </hi>" + b

    return volta


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
