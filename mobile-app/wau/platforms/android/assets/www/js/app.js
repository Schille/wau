

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
                        function(imageData) {

                            //TODO send image data to server
                            // get tags from user

                            var tagList = window.prompt("Any tags?");

                                alert(tagList);


                            $.ajax({
                              type: "POST",
                              url: "upload.php",
                              data: { image: imageData, tags: tagList }
                          })
                            .done(function( msg ) {
                                alert( "Picture uploaded!");
                            });

                            
                        },
                        //onError
                        function() {
                            alert('Error taking picture', 'Error');
                        },
                        options);

                    return false;
                });