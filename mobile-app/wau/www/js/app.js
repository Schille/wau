
var pushNotification;

document.addEventListener("deviceready", function(){
    pushNotification = window.plugins.pushNotification;
    

if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){

    pushNotification.register(
    successHandler,
    errorHandler,
    {
        "senderID":"632573951486",
        "ecb":"onNotification"
    });
} else {
    pushNotification.register(
    tokenHandler,
    errorHandler,
    {
        "badge":"true",
        "sound":"true",
        "alert":"true",
        "ecb":"onNotificationAPN"
    });
}

});

function successHandler (result) {
    alert('result = ' + result);
}

function errorHandler (error) {
    alert('error = ' + error);
}

function onNotification(e) {
    alert("event received");
    // $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            // $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            alert("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            // $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // on Android soundname is outside the payload. 
            // On Amazon FireOS all custom attributes are contained within payload
            var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
            var my_media = new Media("/android_asset/www/"+ soundfile);
            my_media.play();
        }
        // else
        // {  // otherwise we were launched because the user touched a notification in the notification tray.
        //     if ( e.coldstart )
        //     {
        //         $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
        //     }
        //     else
        //     {
        //         $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
        //     }
        // }

       // $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
       alert(e.payload.message);
           //Only works for GCM
       // $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
       //Only works on Amazon Fire OS
       // $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
    break;

    case 'error':
        alert('error');
        // $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        alert('The unknown shit.');
        // $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}



$('#camera').click(function (event) {
    event.preventDefault();
    if (!navigator.camera) {
        alert("Camera API not supported", "Error");
        return;
    }
    var options =   {   quality: 50,
       destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
                        encodingType: 0     // 0=JPG 1=PNG
                    };

                    navigator.camera.getPicture(
                        //onSuccess
                        function(imageURI) {

                            //TODO send image data to server
                            // get tags from user


                            // var tagList = window.prompt("Any tags?");

                            // var options = new FileUploadOptions();
                            // options.fileKey="file";
                            // options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                            // options.mimeType="image/jpeg";

                            // var params = {};
                            // params.base64_image = "test";
                            // params.tags = "param";

                            // // options.params = params;

                            // var ft = new FileTransfer();
                            // ft.upload(imageURI, encodeURI("http://wau-api.mybluemix.net/upload"), win, fail, options);


                            formData = new Object();
                            formData['b64_image'] = imageURI;

                            var options2 = {maximumAge: 30000, timeout: 10000, enableHighAccuracy:false};

                            var tagList = window.prompt('Any Tags?', '');
                            formData['tags'] = tagList;

                            navigator.geolocation.getCurrentPosition(
                                function(position) {


                                    formData['lat'] = position.coords.latitude;
                                    formData['long'] = position.coords.longitude;

                                    $.ajax({
                                type:'POST',
                                url: "http://wau-api.mybluemix.net/upload",
                                data:formData,
                                //contentType: false,
                                //processData: false,
                                error:function (jqXHR, textStatus, errorThrown) {
                                    alert('Seems our server has got a problem ;( Sorry!')
                                },
                                success:function () {
                                    alert('File uploaded!')
                                }
                            });

                                   
                                },
                                function(error) {
                                    alert('Could not retrieve location! code: '    + error.code    + '\n' +
                                    'message: ' + error.message + '\n');

                                     $.ajax({
                                type:'POST',
                                url: "http://wau-api.mybluemix.net/upload",
                                data:formData,
                                //contentType: false,
                                //processData: false,
                                error:function (jqXHR, textStatus, errorThrown) {
                                    alert('Seems our server has got a problem ;( Sorry!')
                                },
                                success:function () {
                                    alert('File uploaded!')
                                }
                            });


                                }, options2);


                            

                        },
                        //onError
                        function() {
                            alert('Error taking picture', 'Error');
                        },
                        options);



return false;
});

$('#menu2').click(function () {
    $.ajax({
      type: "GET",
      dataType: "script",
      url: "http://wau-api.mybluemix.net/upload"
  }).done(function (msg) {
    alert(msg);
});
});