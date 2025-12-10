
var d_mode = false;
function enableDMode() {
    console.log("Clicked the button");
    document.body.classList.toggle('dark-mode');

    // Using Carto Dark tiles
    if (d_mode) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(nav_map); // We need to attribute OSM per their license
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(nav_map);
    }

    d_mode = d_mode ? false : true;

}