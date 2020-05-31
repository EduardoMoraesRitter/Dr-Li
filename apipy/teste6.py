
import numpy as np
import librosa

#print(file)
audio, sr = librosa.load('1parte.wav', sr=22000)#, duration=2)
print(audio, sr)
# audio_array = np.array(audio)
# #print(audio_array)
# audio_feature = librosa.feature.melspectrogram(y=audio_array,sr=22000)
# #print(audio_feature)
# audio_db = librosa.power_to_db(audio_feature,ref=np.max)
# #print(audio_db)