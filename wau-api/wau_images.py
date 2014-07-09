"""
.. module:: wau_images.py
   :platform: Linux

.. moduleauthor:: Michael Schilonka <michael@schilonka.de>


"""
import base64
import couchdb
import StringIO
from PIL import Image

USERNAME = '4130eca0-56cb-4702-b21b-d6b68101e520-bluemix'
KEY_IMAGES = 'angstiouldallikedstsedle'
PASS_IMAGES = 'eJi3CuSkWv4ScbrneKgIltFt'

couch = couchdb.Server('https://%s.cloudant.com' % USERNAME)
couch.resource.credentials = (KEY_IMAGES, PASS_IMAGES)
db_images = couch['images']
db_idb= couch['idb']
MAX_WIDTH = 300



def store_image(image, tag):
    #process image, create a sized thumbnail
    image_string = StringIO.StringIO(base64.b64decode(image))
    image = Image.open(image_string)
  
    ratio = image.size[0] / MAX_WIDTH
    new_heigth = image.size[1] / ratio
    size = MAX_WIDTH, new_heigth
    image.thumbnail(size, Image.ANTIALIAS)
    thumb_string = StringIO.StringIO()
    image.save(pic, image.format,quality = 100)
    #store the actual data
    img_id, img_rev = db_image.save({
      'b64_image' : image  
    })
    #store the thumbnail
    thb_id, thb_rev = db_image.save({
      'b64_image' : thumb_string  
    })
    #create the image entry in DB:idb
    doc_id, doc_rev = db_idb.save({
      'image_id' : img_id,
      'thumb_id' : thb_id,
      #'lat' : None,
      #'long' : None,
      #'city' : None,
      #'country' : None,
      #'date_taken' : None,
    })
    return True

def get_image(uuid):
    #get the image from DB:images
    doc = db_images[uuid]
    #decode the value, return the picture
    return StringIO.StringIO(base64.b64decode(doc['b64_image']))
    
    
    