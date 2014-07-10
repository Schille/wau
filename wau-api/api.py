import os
from flask import *
import json
import wau_images


app = Flask(__name__)

# Upload image
@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
	print(vars(request))
	if request.method == 'POST' and request.form['b64_image'] is not None:
		b64_image = request.form['b64_image']
		lat = request.form['lat']
		long = request.form['long']
		tags = None
		#tags = request.form['tags']
		
		
		
		#tags = request.form['tags']
		if wau_images.store_image(b64_image, lat, long, tags):
			return ''
		else:
			abort(500)
	else:
		abort(405)
		
	

# Run the app
port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)
