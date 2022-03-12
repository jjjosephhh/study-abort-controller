from bottle import Bottle, run, response, request
from time import sleep

app = Bottle()

def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if request.method != 'OPTIONS':
            return fn(*args, **kwargs)

    return _enable_cors

@app.route('/<delay:int>')
@enable_cors
def main(delay):
    sleep(delay)
    return { 'message': 'Greetings from the server' }

run(app, host='localhost', port=8080)
