import os
from flask import Flask

app = Flask(__name__)

@app.route('/<name>')
def hello(name):
	return 'Hello World!' + name

port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port))