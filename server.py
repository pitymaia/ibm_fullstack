import json
import requests

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['GET', 'POST', 'OPTIONS'])
def mailing(environ, start_response):
    if environ['REQUEST_METHOD'] == 'OPTIONS':
        return _build_cors_preflight_response()
    elif environ['REQUEST_METHOD'] == 'POST':
        try:
            request_body_size = int(environ['CONTENT_LENGTH'])
            request_body = environ['wsgi.input'].read(request_body_size)
            json_data = json.loads(request_body)
            getresponse_headers = {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'api-key 8dm28sn76d67e0ho3j1y6x7wonfqhcm5',
            }

            getresponse_data = {"campaign": {"campaignId": json_data['id']}, "email": json_data['email']}

            response = requests.post('https://api.getresponse.com/v3/contacts', headers=getresponse_headers, data=json.dumps(getresponse_data))
        except (TypeError, ValueError):
            request_body = "0"

        status = '200 OK'
        headers = [('Content-type', 'text/plain'), ('Access-Control-Allow-Origin', '*')]
        start_response(status, headers)
        return response
    else:
        response_body = open('index.html').read()
        status = '200 OK'
        headers = [('Content-type', 'text/html'),
                   ('Content-Length', str(len(response_body)))]
        start_response(status, headers)
        return [response_body.encode("utf-8")]

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response