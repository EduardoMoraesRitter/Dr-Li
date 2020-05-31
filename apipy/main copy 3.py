import os
from flask import Flask

app = Flask(__name__)


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


import numpy as np
import os
import librosa
import librosa.display
from matplotlib import pyplot as plt
def lib(aux_name):
    #print(aux_name)
    audio, sr = librosa.load('aaaaaaaaaaa.wav', sr=22000)#, duration=1)
    # print(audio, sr)
    audio_array = np.array(audio)
    #print(audio_array)
    audio_feature = librosa.feature.melspectrogram(y=audio_array,sr=22000)
    #print(audio_feature)
    audio_db = librosa.power_to_db(audio_feature,ref=np.max)
    print(audio_db)

    #wav='aaaaaaaaaaaaaaaa.wav'
    fig = plt.figure(figsize=(16, 4))
    librosa.display.specshow(audio_db, sr=sr)
    # #librosa.display.waveplot(audio_db, sr=fs)
    fig.tight_layout()
    #wav = wav.split('/')[-1].split('.')[0]
    fig.savefig('aaaaaaaaaaa.png')
    plt.close(fig)
    plt.cla()

    return "ok"


import requests
import ffmpeg
# import wave
# import soundfile as sf
import os
import pydub
import glob
import ffmpeg


def pegaaudio(name):
    url = "https://waent-lb-1220480723.us-east-1.elb.amazonaws.com/v1/media/"+name
    headers = {"Content-Type": "audio/wav", "Authorization":"Bearer eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE1OTAzNTE2NzUsImV4cCI6MTU5MDk1NjQ3NSwid2E6cmFuZCI6NzEwMjQ5NDYwOTI2MzE3MTkxfQ.ZBWsORoi9xJIqOccnxnV-d4H6ABfYajEDkdXLfacIfE"}
    r = requests.get(url=url,headers=headers, verify=False)

    print(r.status_code)

    print(r.headers)

    #print(x)
    #print(x.text)
    #print(x.content)

    # with open("python1.png", "wb") as code:
    #     code.write(r.content)
    # name = 'aaa'
    with open("ppppppppppp.ogg", "wb") as file:
        file.write(r.content)

    out, _ = (
    #ffmpeg.input(name+'.mp3')
    ffmpeg.input('ppppppppppp.ogg')    
    .output('-', format='s16le', acodec='pcm_s16le', ac=1, ar='22k')
    .overwrite_output()
    .run(capture_stdout=True)
    )
    wf = wave.open('ppppppppppp.wav', 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(22000)
    wf.writeframes(out)
    wf.close()

  
    audio, sr = librosa.load("ppppppppppp.wav", sr=22000)
    print(audio)


        # input = ffmpeg.input('ppppppppppp.ogg')
    # print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", input)
    # out = ffmpeg.output(input, 'TTTTTTTTTT.wav')


  # file = open('ppppppppppp.ogg')
    # print(file)


    # from scipy.io import wavfile
    # fs, data = wavfile.read('ppppppppppp.ogg')

    # with open("ppppppppppp.mp3", "r") as file:
    #     file.write(r.content)

    # import librosa
    

    #print(x.text)
    # print("----------------------------------------------------")
    # print(librosa.__version__)
    # #print(x.content)

    # som = pydub.AudioSegment.from_ogg('ppppppppppp.ogg')
    # print(som)
    # som.export('HHHHHHHHH.mp3', format="mp3")



    # import ffmpeg
    # import wave
    # from pydub import AudioSegment
    # from pydub.playback import play

    # sound = AudioSegment.from_file("convert.wav", format="wav")
    # print(sound)




    
    # X, sample_rate= sf.read('ppppppppppp.ogg')
    # print(X)

    


    # import subprocess
    # subprocess.call(['ffmpeg', '-i', './ppppppppppp.mp3', './HHHHHHHHHHHHH.wav'])

    # from os import path
    # from pydub import AudioSegment

    # # files                                                                         
    # src = "ppppppppppp.mp3"
    # dst = "hhhhhhhhhhhhh.wav"

    # # convert wav to mp3                                                            
    # sound = AudioSegment.from_mp3(src)
    # sound.export(dst, format="wav")



    # import requests

    # url = "https://api2.online-convert.com/jobs"

    # payload = "{\"input\":[{\"type\":\"remote\",\"source\":\"https://static.online-convert.com/example-file/raster%20image/jpg/example_small.jpg\"}],\"conversion\":[{\"category\":\"image\",\"target\":\"png\"}]}"
    # headers = {
    #     'x-oc-api-key': "<your API key here>",
    #     'content-type': "application/json",
    #     'cache-control': "no-cache"
    # }

    # response = requests.request("POST", url, data=payload, headers=headers)

    # print(response.text)


    # from os import path
    # from pydub import AudioSegment

    # # files                                                                         
    # src = "ppppppppppp.mp3"
    # dst = "HHHHHHHHHHHHHHHHHH.wav"

    # # convert wav to mp3                                                            
    # sound = AudioSegment.from_mp3(src)
    # sound.export(dst, format="wav")

    # #audio, sr = librosa.load("ppppppppppp.mp3", sr=22000, mono=False)
    # # print(audio, sr)
    # open("ppppppppppp.mp3").read()


    # import soundfile as sf

    # samplerate = 22000.0
    # rate = 44100
    # data = r.content#np.random.uniform(-1, 1, size=(rate * 10, 2))
    # # Write out audio as 24bit PCM WAV
    # sf.write('1111111111111.wav', data, samplerate, subtype='PCM_24')
    # # Write out audio as 24bit Flac
    # sf.write('2222222222222.flac', data, samplerate, format='flac', subtype='PCM_24')
    # # Write out audio as 16bit OGG
    # sf.write('3333333333333.ogg', data, samplerate, format='ogg', subtype='vorbis')
  



    # import wave
    # import audioop

    # with wave.open('ppppppppppp.wav') as fd:
    #     params = fd.getparams()
    #     frames = fd.readframes(1000000) # 1 million frames max

    # print(params)

    # frames = audioop.reverse(frames, params.sampwidth)

    # with wave.open('ooooooooooo.wav', 'wb') as fd:
    #     fd.setparams(params)
    #     fd.writeframes(frames)


 

    # file = open("aaaaaaaaaaa.wav", "wb")
    # file.write(x.content)


    # waveFile = wave.open('aaaaaaaaaaa.wav', 'r')
    # print(waveFile)


    # nchannels = 1
    # sampwidth = 2
    # framerate = 22000
    # nframes = 100

    # import wave

    # name = 'hhhhhhhhhhhhh.wav'
    # audio = wave.open(name, 'wb')
    # audio.setnchannels(nchannels)
    # #audio.setsampwidth(sampwidth)
    # audio.setframerate(framerate)
    # #audio.setnframes(nframes)

    # blob = open("ppppppppppp.wav").read() # such as `blob.read()`
    # print(blob)
    #audio.writeframes(blob)


    # af = wave.open('hhhhh.wav', 'w')
    # af.setnchannels(1)
    # af.setparams((1, 2, 16000, 0, 'NONE', 'Uncompressed'))
    # af.writeframes(x.content)
    # af.close()  



    

        
    #sf.write('aaaaaaaaaaaaaaaaaaaaa.wav', x.content, 44100, 'PCM_24')


    # rate = 22050
    # T = 3
    # f = 440.0
    # t = np.linspace(0, T, T*rate, endpoint=False)
    # sig = x.content#np.sin(2 * np.pi * f * t)
    # wavio.write("hhhhhhhhhhhh.wav", sig, rate, sampwidth=3)

    # af = wave.open('hhhhh.wav', 'w')
    # af.setnchannels(1)
    # af.setparams((1, 2, 16000, 0, 'NONE', 'Uncompressed'))
    # af.writeframes(x.content)
    # af.close()  

    # with open("hhhhhhhhhhhh.wav", 'wb') as of: 
    #     of.write(message['audio']) 
    #     audioFile = wave.open("hhhhhhhhhhhhhhhhhh.wav", 'r') 
    #     n_frames = audioFile.getnframes() 
    #     audioData = audioFile.readframes(x.content) 
    #     originalRate = audioFile.getframerate() 
    #     af = wave.open('audioData.wav', 'w') 
    #     af.setnchannels(1) 
    #     af.setparams((1, 2, 16000, 0, 'NONE', 'Uncompressed')) 
    #     converted = audioop.ratecv(audioData, 2, 1, originalRate, 16000, None) 
    #     af.writeframes(converted[0]) 
    #     af.close() 
    #     audioFile.close()

    # sampleRate = 22000.0 # hertz
    # duration = 1.0 # seconds
    # frequency = 220.0 # hertz
    # obj = wave.open('aaaaaaaaaaaaaaa.wav','w')
    # obj.setnchannels(1) # mono
    # obj.setsampwidth(2)
    # obj.setframerate(sampleRate)
    # #for i in range(99999):
    #     #value = random.randint(-32767, 32767)
    #     #data = struct.pack('<h', value)
    #     #obj.writeframesraw( data )
    # obj.writeframes(x.text)
    # obj.close()

    return "ok1"



import wave, struct, math, random
def saveaudio():
    sampleRate = 44100.0 # hertz
    duration = 1.0 # seconds
    frequency = 440.0 # hertz
    obj = wave.open('soundddddddddddddddddd.wav','w')
    obj.setnchannels(1) # mono
    obj.setsampwidth(2)
    obj.setframerate(sampleRate)
    for i in range(99999):
        value = random.randint(-32767, 32767)
        data = struct.pack('<h', value)
        obj.writeframesraw( data )
    obj.close()


@app.route("/")
def index():
    nome = '813e7307-43df-4c8c-9b91-143978b273a1'
    pegaaudio(nome)
    #saveaudio()
    #lib(nome)
    #c = watson(nome)
    #print(c)
    volta = "<h1>v24 </hi>"

    return volta


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
