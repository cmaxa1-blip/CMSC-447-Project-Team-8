L.Control.DarkMode = L.Control.extend({
    onAdd: function (map) {
        const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
        btn.innerHTML = '🌙'; // icon or text
        btn.title = 'Toggle Dark Mode';

        // Prevent map drag when clicking
        L.DomEvent.disableClickPropagation(btn);

        btn.onclick = function () {
            // Toggle dark mode class on body or map container
            document.body.classList.toggle('dark-mode');

            // Swap tile layers (light ↔ dark)
            if (map.hasLayer(lightTiles)) {
                map.removeLayer(lightTiles);
                map.addLayer(darkTiles);
            } else {
                map.removeLayer(darkTiles);
                map.addLayer(lightTiles);
            }
        };

        return btn;
    },
    onRemove: function (map) {
        // Nothing to clean up
    }
});


const lat = 39.2557; // latitude of UMBC
const long = -76.7113; // longitude of UMBC
const zoom_lvl = 20; // base nice size zoom level (can play around with this)

const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
});

const nav_map = L.map("map", { maxZoom: 18, zoomControl: false }).setView([lat, long], zoom_lvl);
nav_map.locate({ watch: true });
L.control.zoom({
    position: 'topright'
}).addTo(nav_map);

// {z}, {x}, {y} are correct, leaflet will substitute them with the correct coords based on the longitude and lat I specified
lightTiles.addTo(nav_map); // Start with light mode

const myButton = new L.Control.DarkMode({ position: 'topright' });
nav_map.addControl(myButton);