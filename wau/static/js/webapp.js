var map;
function initialize() {
  var map_canvas = document.getElementById('map');
  var map_options = {

    scrollwheel: true,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: true,
    draggable: true,
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    panControl: false,
    disableDoubleClickZoom: false,

    center: new google.maps.LatLng(48.776882,9.181484),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#f5f5f2"},{"visibility":"on"}]},{"featureType":"administrative","stylers":[{"visibility":"on"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"color":"#ffffff"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#71c8d4"}]},{"featureType":"landscape","stylers":[{"color":"#e5e8e7"}]},{"featureType":"poi.park","stylers":[{"color":"#8ba129"}]},{"featureType":"road","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"color":"#c7c7c7"},{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#a0d3d3"}]},{"featureType":"poi.park","stylers":[{"color":"#91b65d"}]},{"featureType":"poi.park","stylers":[{"gamma":1.51}]},{"featureType":"road.local","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","stylers":[{"visibility":"simplified"}]},{"featureType":"road"},{"featureType":"road"},{},{"featureType":"road.highway"}],


  }

  map = new google.maps.Map(document.getElementById("map"), map_options);

}
google.maps.event.addDomListener(window, 'load', initialize);


function createStreamItem (jsonObject) {

  var thumbPath = jsonObject.tPath;
  var pPath = jsonObject.pPath;

  var objectId = jsonObject.id;

  var location = jsonObject.city +", "+jsonObject.country;
  var tagList = jsonObject.tags;

  var streamItem = $(document.createElement('div')).addClass('stream-item').attr('id', objectId);

  var streamItemLoc = $(document.createElement('div')).addClass('stream-item-location').text(location);

  var streamItemImg = $(document.createElement('img')).addClass('stream-item-img');

  streamItemImg.attr('src', thumbPath);

  var streamItemTags = $(document.createElement('div')).addClass('stream-item-tags').text(tagList);

  streamItem.append(streamItemLoc).append(streamItemImg).append(streamItemTags);

  $('#stream').append(streamItem);


}
      var ob =  {id: "1", tPath: "static/img/logo.png", city: 'Demmin', country: 'Germany', tags: 'bla', longitude: 48.776882, latitude: 9.181484};
      var ob2 = {id: "2", tPath: "static/img/logo.png", city: 'Demmin', country: 'Germany', tags: 'bla', longitude: 48.767992, latitude: 9.172594};
      var ob3 = {id: "3", tPath: "static/img/logo.png", city: 'Demmin', country: 'Germany', tags: 'bla', longitude: 48.755772, latitude: 9.190374};


$(document).ready(function(){
$('#stream').scroll(function () {
 

var windowHeight = $(window).height();
var streamHeight = $('#stream')[0].scrollHeight;

console.log();
$('#stream').hide().show();
console.log();
if(streamHeight*0.97 < windowHeight+$('#stream').scrollTop()) {
  loadContent();
}


});
});




function loadContent() {


$.getJSON( "http://wau-api.mybluemix.net/img/latest", function( data ) {
  console.log(data);
});



        var objectList = [ob, ob2, ob3];



        for (i = 0; i < objectList.length; i++) {
          createStreamItem(objectList[i]);

          addMarker(objectList[i].longitude, objectList[i].latitude, objectList[i].id);

        }

      }


      function addMarker(longi, lati, objectId) {
        var lnglat = new google.maps.LatLng(longi, lati);

        var marker = new google.maps.Marker({
          position: lnglat,
          title: '',
          draggable: false,
          map: map
        });

        

        google.maps.event.addListener(marker, 'mouseover', function() {
           $('#stream').animate({
                        scrollTop: ($("#"+objectId).offset().top-$('#stream').scrollTop())
        }, 200);
        });

      }

