import os
from flask import Flask

app = Flask(__name__)

# Show index 
@app.route('/')
def show_index():
	return 'index'

# Show single image
@app.route('/image/<uuid>')
def show_image(uuid=None):
	return 'image ' + uuid

# Run the app
port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port))
