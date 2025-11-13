
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
