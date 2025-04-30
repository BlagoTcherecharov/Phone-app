// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
  root: '#app', 				// App root element
  id: 'bg.tugab.kst.sensors1',  // App bundle ID
  name: 'Sensors', 	            // App name
  theme: 'auto', 				// Automatic theme detection

  // App routes
  routes: routes,

});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

// Init/Create left panel view
var leftView = app.views.create('.view-left', {
  url: '/'
});

// wait Cordova.js to be ready
$$(document).on('deviceready', function () {

  startAccelerometer();
  startCompass();
  startGps();

});

// Accelerometer
// --------------------------------------------------------------------------------------------
var accelerometerId = null;
var lastPosition = null;

function startAccelerometer() {
  var options = {
    frequency: 250
  };
  accelerometerId = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

function onSuccess(acceleration) {
  var x = acceleration.x.toFixed(2);
  var y = acceleration.y.toFixed(2);
  var z = acceleration.z.toFixed(2);

  let direction = [];

  if(x < 0)
    direction.push("Насочен на дясно");
  else if(x > 0)
    direction.push("Насочен на ляво");
  else
    direction.push("Насочен нито на ляво нито на дясно");

  if(z < 0)
    direction.push(" насочен на долу");
  else
    direction.push(" насочен на горе");

  $$(".accelerometer-data")
    .html(`X acceleration: ${x} m/s<sup>2</sup><br/>
			Y acceleration: ${y} m/s<sup>2</sup><br/>
			Z acceleration: ${z} m/s<sup>2</sup>`);
  $$('.device-orientation').html(direction);
}
function onError(error) {
  let info;
  let message = error.message;
  if (message === undefined) {
    info = 'Липсва акселерометър!';
  }
  else {
    info = "Грешка при достъп до акселерометъра:<br/>" + message;
    stopAccelerometer();
  }
  $$(".accelerometer-error").html(info);
}
function stopAccelerometer() {
  if (accelerometerId) {
    navigator.accelerometer.clearWatch();
  }
}

// Compass
// ---------------------------------------------------------------------------
var compassId = null;

function startCompass() {
  var options = { frequency: 1000 };
  compassId = navigator.compass.watchHeading(onSuccessCompass, onErrorCompass, options);
}
var onSuccessCompass = function (heading) {
  var value = Math.abs(heading.magneticHeading);
  value = value.toFixed(2);
  $$(".compass-data").html(`Посока: ${value}&deg;`);
};

function onErrorCompass(error) {
  let info;
  let message = error.message;
  if (message === undefined) {
    info = 'Липсва компас!';
  }
  else {
    info = "Грешка при достъп до компаса:<br/>" + message;
    stopCompass();
  }
  $$(".compass-error").html(info);
}
function stopCompass() {
  if (compassId) {
    navigator.compass.clearWatch(compassId);
    compassId = null;
  }
}

// GPS приемник
// ---------------------------------------------------------------------------
var gpsId = null;

function startGps() {
  if (navigator.geolocation) {
    var options = { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 };
    gpsId = navigator.geolocation.watchPosition(onSuccessGps, onErrorGps, options);
    $$(".gps-data").html("Изчакване за връзка с GPS приемника ...");
  } else {
    $$(".gps-error").html("Невъзможно е получаването на позицията!");
  }
}

function onSuccessGps(position) {
  var lon = position.coords.longitude;
  var lat = position.coords.latitude;
  var alt = Math.round(position.coords.altitude);
  var speed = position.coords.speed;
  if (speed != null) {
    speed = speed.toFixed(2);
  }
  var accuracy = position.coords.accuracy.toFixed(2);

  $$(".gps-data").html(`Географска дължина: ${lon}<br/>
                          Географска ширина: ${lat}<br/>
                          Височина: ${alt} m<br/>
                          Скорост: ${speed} km/h<br/>
                          Точност: ${accuracy} m`);

  window.currentLat = lat;
  window.currentLon = lon;

  if (!window.mapInitialized) {
    periodicMapUpdate();
    window.mapInitialized = true;
    setInterval(periodicMapUpdate, 30000);
  }
}

function periodicMapUpdate() {
  if (window.currentLat != null && window.currentLon != null) {
    $$('.gps-map').html(`
      <iframe
        id="mapIframe"
        src="https://www.google.com/maps?q=${window.currentLat},${window.currentLon}&output=embed"
        loading="lazy">
      </iframe>
    `);
  }
}

function onErrorGps(error) {
  let info = error.message;
  $$(".gps-error").html(`GPS грешка: ${info}<br/>
	Проверете дали е резрешено получаване на местоположението!`);
  stopGps();
}
function stopGps(id) {
  if (gpsId) {
    navigator.geolocation.clearWatch(gpsId);
    gpsId = null;
  }
}
// --------------------------------------------------------------------------
