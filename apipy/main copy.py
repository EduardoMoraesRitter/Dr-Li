import os
from flask import Flask

app = Flask(__name__)


# import numpy as np
# import librosa
# def lib(aux_name):
#     #print(file)
#     audio, sr = librosa.load('1parte.wav', sr=22000)#, duration=2)
#     #print(audio, sr)
#     audio_array = np.array(audio)
#     #print(audio_array)
#     audio_feature = librosa.feature.melspectrogram(y=audio_array,sr=22000)
#     #print(audio_feature)
#     audio_db = librosa.power_to_db(audio_feature,ref=np.max)
#     print(audio_db)


#     window_size = 1024
#     window = np.hanning(window_size)
#     stft  = librosa.core.spectrum.stft(audio_array, n_fft=window_size, hop_length=512, window=window)
#     out = 2 * np.abs(stft) / np.sum(window)
#     fig = plt.Figure()
#     canvas = FigureCanvas(fig)
#     ax = fig.add_subplot(111)
#     p = librosa.display.specshow(audio_db, ax=ax)
#     #aux_name = file.replace(".wav", "")
#     fig.savefig(aux_name+'.png')

#     return audio_db


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
    aux_name = 'aaaa'
    #b = lib(aux_name)
    #c = watson(aux_name)
    #print(b)
    volta = "<h1>t1 </hi>" + aux_name

    return volta


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
