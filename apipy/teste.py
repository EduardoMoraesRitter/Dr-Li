import requests 
url = "https://waent-lb-1220480723.us-east-1.elb.amazonaws.com/v1/media/813e7307-43df-4c8c-9b91-143978b273a1"
headers = {"Content-Type": "application/json", "Authorization":"Bearer eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE1OTAzNTE2NzUsImV4cCI6MTU5MDk1NjQ3NSwid2E6cmFuZCI6NzEwMjQ5NDYwOTI2MzE3MTkxfQ.ZBWsORoi9xJIqOccnxnV-d4H6ABfYajEDkdXLfacIfE"}
x = requests.get(url=url,headers=headers, verify=False)

print(x.status_code)
print(x)

print(x.text)