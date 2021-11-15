import http.server
import socketserver
import requests
import cgi
import json


class Handler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self):
       self.send_response(200)
       self.send_header("Content-type", "text/html")
       self.end_headers()

    def _html(self, message):
       """This just generates an HTML document that includes `message`
       in the body. Override, or re-write this do do more interesting stuff.
       """
       content = f"<html><body><h1>{message}</h1></body></html>"
       return content.encode("utf8")

    def do_HEAD(self):
       self._set_headers()

    def do_POST(self):
            """Handle a post request by returning the square of the number."""
            print('POST PATH', self.path)
            # length = int(self.headers.getheader('content-length'))        
            # data_string = self.rfile.read(length)
            # try:
            #     result = int(data_string) ** 2
            # except:
            #     result = 'error'
            # self.wfile.write('RESPOSTA EM STRING'.encode("utf8"))
            # return http.server.SimpleHTTPRequestHandler.do_GET(self)
            data = json.dumps({'hello': 'world', 'received': 'ok'})

            # The returned object is going to be printed
            return [data.encode("utf-8")]

    def do_GET(self):
        print('path', self.path)
        if self.path == '/pity':
            self.path = 'old.html'

        elif self.path == '/api':
            headers = {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'api-key 8dm28sn76d67e0ho3j1y6x7wonfqhcm5',
            }

            data = '{"campaign": {"campaignId": "jHmvh"}, "email": "pity33nadaseirv@gmail.com"}'

            # response = requests.post('https://api.getresponse.com/v3/contacts', headers=headers, data=data)

            # send the message back
            self._set_headers()
            # self.wfile.write(json.dumps({'hello': 'world', 'received': 'ok'}))
            return json.dumps({'hello': 'world', 'received': 'ok'})

        elif self.path == '/custom':
           self._set_headers()
           self.wfile.write(self._html("Hi, this is a custom page!"))
           return

        return http.server.SimpleHTTPRequestHandler.do_GET(self)


PORT = 7000

print("Server started at PORT: 7000")
server = socketserver.TCPServer(("", PORT), Handler)
server.serve_forever()
