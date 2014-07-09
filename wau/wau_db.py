import couchdb
import StringIO
import base64

USERNAME = '4130eca0-56cb-4702-b21b-d6b68101e520-bluemix'
KEY_IMAGES = 'angstiouldallikedstsedle'
PASS_IMAGES = 'eJi3CuSkWv4ScbrneKgIltFt'

couch = couchdb.Server('https://%s.cloudant.com' % USERNAME)
couch.resource.credentials = (KEY_IMAGES, PASS_IMAGES)
db_images = couch['images']
db_idb= couch['idb']
LIMIT = 10


def get_recent_images(start_key):
    if start_key:
        return db_idb.view('dates/recent', startkey=int(start_key), descending=True, limit=LIMIT)
    else:
        return db_idb.view('dates/recent', descending=True, limit=LIMIT)
    
def get_image(uuid):
    #get the image from DB:images
    doc = db_images[uuid]
    #decode the value, return the picture
    return StringIO.StringIO(base64.b64decode(doc['b64_image']))