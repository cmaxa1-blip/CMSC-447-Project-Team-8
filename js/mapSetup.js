const lat = 39.2557; // latitude of UMBC
const long = -76.7113; // longitude of UMBC
const zoom_lvl = 15; // base nice size zoom level (can play around with this)

const nav_map = L.map("map").setView([lat, long], zoom_lvl);

// {z}, {x}, {y} are correct, leaflet will substitute them with the correct coords based on the longitude and lat I specified
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors'}).addTo(nav_map); // We need to attribute OSM per their license

let blueDot; // marker ref

function placeBlueDot(lat, lng) {
  if (!blueDot) {
    blueDot = L.circleMarker([lat, lng], {
      radius: 8,
      weight: 2,
      fillOpacity: 0.9,
      color: "#1f75fe",
      fillColor: "#1f75fe"
    }).addTo(nav_map);
  } else {
    blueDot.setLatLng([lat, lng]);
  }
}

function onGeoSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  placeBlueDot(latitude, longitude);
  // center the map on beginning
  nav_map.setView([latitude, longitude], zoom_lvl);
}

function onGeoError(err) {
  console.warn("Geolocation error:", err.message);
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
}
