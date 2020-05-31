import json
from watson_developer_cloud import VisualRecognitionV3

visual_recognition = VisualRecognitionV3(
    '2018-03-19',
    iam_apikey='8ivX_fDlMeHa9fQ4Tr3WKftZyKtgy3qW1rNUFd8312Jy')

with open('./1parte2.jpg', 'rb') as images_file:
    classes = visual_recognition.classify(
        images_file,
        threshold='0.6',
	classifier_ids='kkkkk_1433712665').get_result()
print(json.dumps(classes, indent=2))