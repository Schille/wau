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



def store_image(b64_image, tag):
    #process image, create a shrinked thumbnail
    print('Convert b64_image to Image')
    image = __base64_to_image(b64_image)
    print('Resize image')
    image = __resize_image(image)
    print('Convert Image to b64_image')
    b64_thumbnail = __image_to_base64(image)
    
    #store the actual image
    img_id, img_rev = db_images.save({
      'b64_image' : b64_image  
    })
    print('Stored actual image - id: ' + img_id)
    #store the thumbnail
    thb_id, thb_rev = db_images.save({
      'b64_image' : b64_thumbnail  
    })
    print('Stored thumbnail - id: ' + thb_id)
    #create the image entry in DB:idb
    doc_id, doc_rev = db_idb.save({
      'image_id' : img_id,
      'thumb_id' : thb_id
      #'lat' : None,
      #'long' : None,
      #'city' : None,
      #'country' : None,
      #'date_taken' : None,
    })
    print('saved idb entry - id: ' + doc_id)
    return True

def get_image(uuid):
    #get the image from DB:images
    doc = db_images[uuid]
    #decode the value, return the picture
    return StringIO.StringIO(base64.b64decode(doc['b64_image']))
    
def __base64_to_image(image_str):
    image_string = StringIO.StringIO(base64.b64decode(image_str))
    return Image.open(image_string)

def __image_to_base64(image):
    img_str = StringIO.StringIO()
    image.save(img_str, "JPEG")
    return base64.b64encode(img_str.getvalue())
    

def __resize_image(image):
    ratio = image.size[0] / MAX_WIDTH
    new_heigth = image.size[1] / ratio
    size = MAX_WIDTH, new_heigth
    image.thumbnail(size, Image.ANTIALIAS)
    return image
    
    
    
    
    
    
    
    
    
    
    
    