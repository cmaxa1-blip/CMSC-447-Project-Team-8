
let blueDot; // marker ref
var initial_connect = true;
var too_far = false; // is the user too far from UMBC
const MAX_DIST_FROM_UMBC = 416.97; // max radius from 
var closest_id = null;

  function placeBlueDot(lat, lng) {
    if (!blueDot) {
      blueDot = L.circleMarker([lat, lng], {
        radius: 10,
        weight: 2,
        fillOpacity: 1,
        color: "#000000ff",
        fillColor: "#e1d200ff"
      }).addTo(nav_map);
    } else {
      blueDot.setLatLng([lat, lng]);
    }
  }

function onGeoSuccess(pos) {
  const { latitude, longitude } = pos.coords;

  placeBlueDot(latitude, longitude);
  if (initial_connect) {
    closest_id = get_closest_node([longitude, latitude]).id;
    console.log("Id",closest_id);
    nav_map.setView([latitude, longitude], zoom_lvl);

    // check if user is too far from UMBC
    if (get_distance([longitude, latitude], [long, lat]) > MAX_DIST_FROM_UMBC) {
      too_far = true;
      alert("Your too far from campus to use the navigator!");
    }

    initial_connect = false;
  }
}

function onGeoError(err) {
  console.warn("Geolocation error:", err.message);
  if (initial_connect) {
    alert("Location services are not working on your device. The app will not work without these");
    initial_connect = false;
  }
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });

  const watchId = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 2000
  });

} else {
  console.warn("Geolocation not supported in this browser.");
  if (initial_connect) {
    alert("Location services are not working on your device. The app will not work without these");
    initial_connect = false;
  }
}

