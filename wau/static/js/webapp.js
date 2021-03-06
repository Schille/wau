var map;

var lastDate = 0;
var markersArray = [];
var thumbArray = [];
var noMoreRequest = false;

var requestURL = "http://wau.mybluemix.net/img/latest";


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

  var uri = "http://wau.mybluemix.net/img/"

  var thumbPath = uri+jsonObject.thumb_id;
  var pPath = uri+jsonObject.image_id;

  var objectId = jsonObject._id;

  var location = jsonObject.city +", "+jsonObject.country;
  var tagList = jsonObject.tags;

  var streamItem = $(document.createElement('div')).addClass('stream-item');

  var streamItemLoc = $(document.createElement('div')).addClass('stream-item-location').text(location);

  var streamImgLink = $(document.createElement('a')).attr('href', 'http://wau.mybluemix.net/image/'+objectId);

  var streamItemImg = $(document.createElement('img')).addClass('stream-item-img').attr('id', objectId);

  streamItemImg.attr('src', thumbPath);

  var streamItemTags = $(document.createElement('div')).addClass('stream-item-tags');
  if(tagList)
    tagList.forEach( function(object, index) {
      streamItemTags.append($(document.createElement('span')).addClass('stream-item-tag').text(object+" ").click(function () {
        search(object);
      }));
      
    });

  streamItem.append(streamItemLoc).append(streamImgLink.append(streamItemImg)).append(streamItemTags);

  thumbArray.push(streamItem);

  $('#stream').append(streamItem);


}

var block = false;

$(document).ready(function(){




  $('#search-form').submit(function() {
    search();

    return false;
  });


  if (block == true)
    return;
  block = true;
  loadContent();
  $('#stream').scroll( function () {



    var windowHeight = $(window).height();
    var streamHeight = $('#stream')[0].scrollHeight;


    if(streamHeight*0.97 < windowHeight+$('#stream').scrollTop()) {
      loadContent();
    }


  });
});




function loadContent() {
  if (noMoreRequest)
    return;
  if(requestURL != "http://wau.mybluemix.net/img/latest")
    return;

  
  if (lastDate == 0) {
    $.getJSON( requestURL, function( data ) {
      lastDate = data[data.length-1].date_taken;
      data.forEach(function(object) {
        createStreamItem(object);
        addMarker(object.long, object.lat, object._id);

      });

      


    });
  }
  else {

    $.ajax({
      type: 'GET',
      url: requestURL+"?startkey="+lastDate,
      dataType: 'json',
      success: function( data ) {

       lastDate = data[data.length-1].date_taken;
       data.forEach(function(object, index) {
        if (data.length == 1)
          noMoreRequest = true;
        if(index != 0) {

          createStreamItem(object);
          addMarker(object.long, object.lat, object._id);
        }
        else
          return;

      });


       block = false;


     },
     data: {},
     async: false
   });

  }
  
  console.log("load");
}

function search(tag) {

  wipeDisplayData();

  if(!tag)
    var searchTag = $('#search-field').val();
  else
    searchTag = tag;

  requestURL = "http://wau.mybluemix.net/search?tags=";

  $.ajax({
    type: 'GET',
    url: requestURL+searchTag,
    dataType: 'json',
    success: function( data ) {
      console.log(data);

      data.forEach(function(object, index) {


        createStreamItem(object);
        addMarker(object.long, object.lat, object._id);
        


      });

    }
  });
}

function wipeDisplayData() {

  for(i=0; i<markersArray.length; i++) {
    thumbArray[i].remove();
    markersArray[i].setMap(null);
  }
  thumbArray.length = 0;
  markersArray.length = 0;
}



function addMarker(lati, longi, objectId) {
  console.log(longi + " " + lati + " " + objectId);
  var lnglat = new google.maps.LatLng(longi, lati);

  var marker = new google.maps.Marker({
    position: lnglat,
    title: '',
    animation: google.maps.Animation.DROP,
    draggable: false,
    map: map
  });

  markersArray.push(marker);
  $("#"+objectId).mouseenter(function (){

    function toggleBounce() {

      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    toggleBounce();
 
 });


  $("#"+objectId).mouseleave(function (){

    function toggleBounce() {

      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    toggleBounce();
 
 });

  


  google.maps.event.addListener(marker, 'mouseover', function() {
   $('#stream').animate({
    scrollTop: ($("#"+objectId).offset().top-$('#stream').scrollTop())
  }, 200);



 });

}




