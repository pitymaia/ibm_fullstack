import requests
import json

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['GET', 'POST', 'OPTIONS'])
def mailing():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        json_data = json.loads(request.data)
        api_key = json_data['key'] if hasattr(json_data, 'key') else '8dm28sn76d67e0ho3j1y6x7wonfqhcm5'
        getresponse_headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': 'api-key {0}'.format(api_key)
        }

        getresponse_data = {"campaign": {"campaignId": json_data['campaignId']}, "email": json_data['email']}

        if hasattr(json_data, 'custom'):
            for key, value in json_data['custom']:
                getresponse_data.campaign[key] = value

        resp = requests.post(
            'https://api.getresponse.com/v3/contacts',
            headers=getresponse_headers, data=json.dumps(getresponse_data)
        )
        return (resp.text, resp.status_code, resp.headers.items())
    else:
        response_body = open('index.html').read()
        return response_body

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


if __name__ == '__main__':
    app.run()
   # app.run(host = '0.0.0.0',port=7000, debug=True)