

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

                            var options2 = {maximumAge: 30000, timeout: 10000, enableHighAccuracy:true};


                            navigator.geolocation.getCurrentPosition(
                                function(position) {

                                     alert(position.coords.latitude + ',' + position.coords.longitude);

                                    formData['lat'] = position.coords.latitude;
                                    formData['long'] = position.coords.longitude;

                                    alert(formData.lat);
                                    $.ajax({
                                type:'POST',
                                url: "http://wau-api.mybluemix.net/upload",
                                data:formData,
                                //contentType: false,
                                //processData: false,
                                error:function (jqXHR, textStatus, errorThrown) {
                                    alert('Failed to upload file')
                                },
                                success:function () {
                                    alert('File uploaded')
                                }
                            });

                                   
                                },
                                function(error) {
                                    alert('Could not retrieve location! code: '    + error.code    + '\n' +
                                    'message: ' + error.message + '\n');
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