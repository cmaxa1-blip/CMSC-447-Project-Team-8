const lat = 39.2557; // latitude of UMBC
const long = -76.7113; // longitude of UMBC
const zoom_lvl = 15; // base nice size zoom level (can play around with this)

const nav_map = L.map("map", {maxZoom: 18}).setView([lat, long], zoom_lvl);
nav_map.locate({ watch: true });

// {z}, {x}, {y} are correct, leaflet will substitute them with the correct coords based on the longitude and lat I specified
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(nav_map); // We need to attribute OSM per their license
