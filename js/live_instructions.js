var routeStarted = false;
var route = [];
var full_route;
var cur_coords, prev_coords = null;
let route_as_lngs = null;
const ARRIVED_DIST = 10; // meters away from ending node that we say the user has arrived
const UPDATE_POS_DIST = 5 // only update tron line if distance is gtr than this (meters)


/* The main function to call to begin live navigation
when started: 
    - will track user's location
    - serve next instruction based on closest node
    - will read tts instructions
    - will update graphical display: tron line shrinks with user's route and user's location on map is updated
*/
// while I'm not at destination
// get my location
// get closest node id
// look at next node
// get next instruction (left/right/straight/elevator/entrance)
// display it + speak it (optional)
// sleep for a period and then refresh


// use long + lat to approximate direction:
/*
    Calculate angle between line connecting two nodes and the line normal (straight ahead to cur node):
        - depending on interval angle falls in say left/right/slight left/right/ straight

    if next node is a door/elevator give special instructions
*/

// create interval function:
/*
Refresh map (called every ~30 s)
Update user's map position

if (hasRoute){
    Update tron line according to position

    if current position is at destination, then clear tron line
    and set hasRoute to false and route_started to false
}

if (route_started){
    Update on screen instructions
    Narrate instructions
}
*/
function get_next_pt(pos, route) {
    // route is the route converted to individual longs and lat pairs
    // pos is a long lat pair representing user position
    // assume position is relatively close to tron line
    // assumes they have not arrived

    // going to need funciton to convert polyline with lng and lat attributes into swapped arrays
    let pts = get_nearest_coord_pair(pos, route);
    pos = sphere_to_cart(pos);

    let v1 = null; // vector user is traveling along
    let v2 = null; // next vector the user will have to travel along

    /*let d = calculate_distance(pos, sphere_to_cart(route[pts]));
    d = get_dist_from_line()
    if (d > REDIRECT_CUTOFF && d < REROUTE_CUTOFF) {
        return "Turn around";
    } else if (d >= REROUTE_CUTOFF) {
        return "Rerouting";
    }*/


    if (pts == route.length - 1 && calculate_distance(pos, sphere_to_cart(route[pts])) <= ARRIVED_DIST) {
        //routeStarted = false;
        return -1;
    } else if (pts == route.length - 1) {
        return route.length - 1;
    } else if (pts == 0) {
        if (route.length < 3) {
            return 1; // only 2 pts return 2nd
        }
        let p0 = sphere_to_cart(route[0]);
        let p1 = sphere_to_cart(route[1]);
        let p2 = sphere_to_cart(route[2]);
        v1 = [p1[0] - p0[0], p1[1] - p0[1]];
        v2 = [p2[0] - p1[0], p2[1] - p1[1]];

        if (calculate_distance(pos, p1) > UPDATE_POS_DIST)
            return -1;

        return 1;
    } else {
        let p1 = sphere_to_cart(route[pts - 1]);
        let p2 = sphere_to_cart(route[pts + 1]);
        let p = sphere_to_cart(route[pts]);

        let d1 = get_dist_from_line(p1, p, pos);
        let d2 = get_dist_from_line(p, p2, pos);

        if (d1 <= d2) {
            v1 = make_vec(p1, p);
            v2 = make_vec(p, p2);

            if (calculate_distance(pos, p) > calculate_distance(p1, p))
                return -2; // return to line warning

            // might cause trouble check it out
            if (calculate_distance(pos, p) > UPDATE_POS_DIST){
                return -1;
            }

            return pts;
        } else {
            if (pts + 1 == route.length - 1) {
                return route.length - 1;
            }

            v1 = make_vec(p, p2);

            if (route.length < 3) {
                return 1;
            }
            if (calculate_distance(pos, p2) > calculate_distance(p, p2))
                return -2;
            if (calculate_distance(pos, sphere_to_cart(route[pts + 1])) > UPDATE_POS_DIST)
                return -1;
            v2 = make_vec(p2, sphere_to_cart(route[pts + 2]));

            return pts + 1;
        }
    }

}

function update_route(pos) {
    // takes position as an array [long, lat]
    // new strat:
    // go through initial tron line long and lats
    // find top 2 closest coords
    // return the one with the higher index
    // draw a line from the current coords to the returned coord

    let nxt = get_next_pt(pos, route_as_lngs);
    if (nxt < 0)
        return;

    let modified = full_route.slice(nxt, full_route.length);
    let newPt = { lat: pos[1], lng: pos[0] };
    modified.unshift(newPt);
    __tronLayer.setLatLngs(modified);

    ///
    /*let nearest = get_nearest_coord(pos, full_route);
    let modified = full_route.slice(nearest, full_route.length);
    let newPt = { lat: pos[1], lng: pos[0] };
    modified.unshift(newPt);
    __tronLayer.setLatLngs(modified);*/
}

function check_arrays_equal(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i])
            return false;
    }
    return true;
}

/*function get_next_instruction(pos) {
    // some times this gets hooked on points behind the user -- fix
    // returns a string representing the next instruction
    let v1 = make_vec(prev_coords, cur_coords);

    let final = full_route[full_route.length - 1] // get final point
    let final_coords = sphere_to_cart([final.lng, final.lat]);
    let diff = get_distance(cur_coords, final_coords);

    if (diff < ARRIVED_DIST)
        return "Arrived";

    let index = get_nearest_coord(pos, full_route);
    let nearest = full_route[index];


    index = check_arrays_equal([nearest.lng, nearest.lat], [pos[0], pos[1]]) ? index + 1 : index; // if we happen to be at the current line point look ahead to the next one
    nearest = full_route[index];
    nearest = [nearest.lng, nearest.lat];
    nearest = sphere_to_cart(nearest);

    let v2 = make_vec(cur_coords, nearest);

    return direction(v1, v2);

}*/

function cartToLngLat([x, y]) {
    const R = 6378137; // Earth radius in meters (WGS84)
    const lng = (x / R) * (180 / Math.PI);
    const lat = (Math.atan(Math.exp(y / R)) * 2 - Math.PI / 2) * (180 / Math.PI);
    return [lng, lat];
}


function update_instruction(pos) {
    // need to fix
    // updates the instructions on screen
    let nxt_instruc = get_next_instruc(pos, route_as_lngs);
    let msg = new SpeechSynthesisUtterance(nxt_instruc);
    window.speechSynthesis.speak(msg);

    document.getElementById("instruc").textContent = "Instruction: " + nxt_instruc;

    if (nxt_instruc == "Arrived")
        return true;

    return false;
}

function swap(arr) {
    return [arr[1], arr[0]];
}
//let walker = null;
// longitudes are usually around -76
function map_refresh(e) {
    //let pos = null;
    let pos = [e.latlng.lng, e.latlng.lat]; // get current position
    //pos = swap([39.09265292728514, -76.53798566557292]);
    /*var circleMarker = L.circleMarker(swap(pos), {
        radius: 10, // Radius in pixels
        color: 'blue', // Border color
        fillColor: 'red', // Fill color
        fillOpacity: 0.5 // Fill opacity
    }).addTo(nav_map);*/



    // TESTING
    //pos = [full_route[6].lng, full_route[6].lat];
    //prev_coords = sphere_to_cart([full_route[5].lng, full_route[5].lat])

    prev_coords = cur_coords;
    cur_coords = sphere_to_cart(pos);



    //let dist_v = [cur_coords[0] - prev_coords[0], cur_coords[1] - prev_coords[1]];
    if (route.length > 0) {
        update_route(pos, route);
    }

    if (routeStarted) {
        let finished = update_instruction(pos)

        if (finished) {
            route = [];
            routeStarted = false;
            full_route = null;
        }

    }


}

function generate_route(n) {
    // n is the destination node id
    // calculates and draws the route and gets it ready for live instruction
    /*var circleMarker = L.circleMarker(swap(school_map.get(closest_id).coords), {
        radius: 10, // Radius in pixels
        color: 'blue', // Border color
        fillColor: 'red', // Fill color
        fillOpacity: 0.5 // Fill opacity
    }).addTo(nav_map);*/
    route = A_star(closest_id, n);
    tron_line(route);
    full_route = __tronLayer.getLatLngs();
    route_as_lngs = convert_polypath_to_long_lats(full_route);
}

function start_route() {
    routeStarted = true;
    let ins_over = document.getElementById("ins");
    ins_over.style.display = 'block';
    //walker = simulateWalker(route, 1.4); // ~1.4 m/s (average walking speed)
    //document.getElementById('instruc').textContent = ""
}

// refreshes the map every time the user's location changes
/* for testing */
//setInterval(map_refresh, 10);
nav_map.on("locationfound", map_refresh)