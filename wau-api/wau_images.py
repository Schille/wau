"""
.. module:: wau_images.py
   :platform: Linux

.. moduleauthor:: Michael Schilonka <michael@schilonka.de>


"""
import base64
import couchdb
import StringIO
import time
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

USERNAME = '4130eca0-56cb-4702-b21b-d6b68101e520-bluemix'
KEY_IMAGES = 'angstiouldallikedstsedle'
PASS_IMAGES = 'eJi3CuSkWv4ScbrneKgIltFt'

couch = couchdb.Server('https://%s.cloudant.com' % USERNAME)
couch.resource.credentials = (KEY_IMAGES, PASS_IMAGES)
db_images = couch['images']
db_idb= couch['idb']
MAX_WIDTH = 300
LIMIT = 10



def store_image(b64_image, lat, long, tag):
    #process image, create a shrinked thumbnail
    print('Convert b64_image to Image')
    image = __base64_to_image(b64_image)
    #exif = get_exif_data(image)
    #print(exif)
    #lat, long = get_lat_lon(exif)
    print('lat:' + str(lat))
    print('long:' + str(long))
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
      'thumb_id' : thb_id,
      'date_taken' : int(time.time()),
      'lat' : lat,
      'long' : long
      #'city' : None,
      #'country' : None,
    })
    print('saved idb entry - id: ' + doc_id)
    return True

def get_image(uuid):
    #get the image from DB:images
    doc = db_images[uuid]
    #decode the value, return the picture
    return StringIO.StringIO(base64.b64decode(doc['b64_image']))


def get_recent_images(start_key):
    if start_key:
        print('DEBUG')
        reuslt =  db_idb.view('dates/recent', descending=True, startkey=str(start_key))
        print(len(reuslt))
        return reuslt
    else:
        return db_idb.view('dates/recent', descending=True, limit=LIMIT)
    
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
    
def get_exif_data(image):
    """Returns a dictionary from the exif data of an PIL Image item. Also converts the GPS Tags"""
    exif_data = {}
    info = image._getexif()
    print(info)
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    print(t)
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]
 
                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value
 
    return exif_data

def get_lat_lon(exif_data):
    """Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)"""
    lat = None
    lon = None
 
    if "GPSInfo" in exif_data:        
        gps_info = exif_data["GPSInfo"]
 
        gps_latitude = _get_if_exist(gps_info, "GPSLatitude")
        gps_latitude_ref = _get_if_exist(gps_info, 'GPSLatitudeRef')
        gps_longitude = _get_if_exist(gps_info, 'GPSLongitude')
        gps_longitude_ref = _get_if_exist(gps_info, 'GPSLongitudeRef')
 
        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = _convert_to_degress(gps_latitude)
            if gps_latitude_ref != "N":                     
                lat = 0 - lat
 
            lon = _convert_to_degress(gps_longitude)
            if gps_longitude_ref != "E":
                lon = 0 - lon
 
    return lat, lon
    
    
    
    
    
    
    
    
    