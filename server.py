from wsgiref.validate import validator
from wsgiref.simple_server import make_server
import json
import requests

FILE = 'index.html'
PORT = 7000

def getresponse_app(environ, start_response):
    if environ['REQUEST_METHOD'] == 'POST':
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
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return response
    else:
        response_body = open(FILE).read()
        status = '200 OK'
        headers = [('Content-type', 'text/html'),
                   ('Content-Length', str(len(response_body)))]
        start_response(status, headers)
        return [response_body.encode("utf-8")]

def start_server():
    """Start the server."""
    httpd = make_server("", PORT, getresponse_app)
    httpd.serve_forever()

if __name__ == "__main__":
    print('Serving on port: ', PORT)
    start_server()