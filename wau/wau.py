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
	image_doc = wau_db.get_image_doc(uuid)
	return render_template('template.html', image_doc=image_doc) 

# Return image
@app.route('/img/<uuid>')
def get_image(uuid):
	jpg = wau_db.get_image(uuid)
	if jpg:
		return send_file(jpg, mimetype='image/jpg')
	else:
		abort(404)

# Get latest images		
@app.route('/img/latest')
def get_latest():
	start_key = request.args.get('startkey')
	result = list()
	for obj in wau_db.get_recent_images(start_key):
		result.append(obj['value'])
	return Response(json.dumps(result), mimetype='text/json')

# Search for tags
@app.route('/search')
def search_for_tags():
	tags = request.args.get('tags')
	targets = list(wau_db.search_for_tags(tags))
	targets.sort(key=lambda x: x['date_taken'], reverse=True)
	return Response(json.dumps(targets), mimetype='text/json')


# Run the app
port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)
