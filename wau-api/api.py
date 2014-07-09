import os
from flask import *
import wau_images

app = Flask(__name__)

# Upload image
@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
	if request.method == 'POST':
		image = request.files['image']
	else:
		abort(500)

# Return image
@app.route('/img/<uuid>')
def get_image(uuid):
	jpg = wau_images.get_image(uuid)
	if jpg:
		return send_file(jpg, mimetype='image/gif')
	else:
		abort(404)

# Run the app
port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port))
