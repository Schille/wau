import os
from flask import *
import wau_db
import json

app = Flask(__name__)

# Show index 
@app.route('/')
def show_index():
	return render_template('index.html')

# Show single image
@app.route('/image/<uuid>')
def show_image(uuid=None):
	return 'image ' + uuid

# Return image
@app.route('/img/<uuid>')
def get_image(uuid):
	jpg = wau_db.get_image(uuid)
	if jpg:
		return send_file(jpg, mimetype='image/jpg')
	else:
		abort(404)
		
@app.route('/img/latest')
def get_latest():
	start_key = request.args.get('startkey')
	result = list()
	for obj in wau_db.get_recent_images(start_key):
		result.append(obj['value'])
	return Response(json.dumps(result), mimetype='text/json')

# Run the app
port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)
