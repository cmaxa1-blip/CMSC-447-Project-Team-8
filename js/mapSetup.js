const lat = 39.2557;
const long = -76.7113;
const zoom_lvl = 15;

const nav_map = L.map("map").setView([lat, long], zoom_lvl);

// {z}, {x}, {y} are correct, leaflet will substitute them with the correct coords based on the longitude and lat I specified
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors'}).addTo(nav_map); // We need to attribute OSM per their license
