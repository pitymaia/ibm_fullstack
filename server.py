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
        try:
            json_data = json.loads(request.data)
            getresponse_headers = {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'api-key zfjbaazjmrr3rbhbs0v8hor0ey3apjag'
            }

            getresponse_data = {"campaign": {"campaignId": json_data['campaignId']}, "email": json_data['email']}

            if 'custom' in json_data:
                for key, value in json_data['custom'].items():
                    getresponse_data[key] = value

            resp = requests.post(
                'https://api.getresponse.com/v3/contacts',
                headers=getresponse_headers, data=json.dumps(getresponse_data)
            )
            return (resp.text, resp.status_code, resp.headers.items())
        except:
            response = _build_cors_preflight_response()
            return ('Missing nedded fields "email" or "campaignId?"', 400, response.headers.items())
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
