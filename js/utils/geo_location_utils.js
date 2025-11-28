// This file contains some helper functions for general usage in geo location algorithms


EARTH_RADIUS = 6371 * Math.pow(10, 3); // Earth's radius in meters

// tested loosely--should work
function sphere_to_cart(coord) {
    // coord is long and lat pair
    // produces cartesian coords equiv of spherical

    rads = [coord[0] * Math.PI / 180, coord[1] * Math.PI / 180]; // still long, lat

    x = EARTH_RADIUS * Math.cos(rads[1]) * Math.cos(rads[0]);
    y = EARTH_RADIUS * Math.cos(rads[1]) * Math.sin(rads[0]);
    z = EARTH_RADIUS * Math.sin(rads[1]);

    return [x, y, z];
}

function get_closest_node(pos) {
    // pos is long lat pair
    // returns id of closest node

    let n_list = Array.from(school_map.keys());

    let cur_min_id = null;
    let cur_min_dist = Infinity;

    n_list.forEach((n_id) => {
        let nd = school_map.get(n_id);

        let d = get_distance(pos, nd.coords);
        cur_min_dist = Math.min(d, cur_min_dist);

        if (cur_min_dist == d)
            cur_min_id = n_id;

    });

    return { id: cur_min_id, distance: cur_min_dist };
}

function get_closest_member(group_name, pos) {
    // returns node id of closest member in the input group to pos (long lat) and distance from it
    let cur_min_id = null;
    let cur_min_dist = Infinity;

    let n_list = groups.get(group_name);

    n_list.forEach((n_id) => {
        let cds = school_map.get(n_id).coords;

        let d = get_distance(pos, cds);
        cur_min_dist = Math.min(d, cur_min_dist);

        if (cur_min_dist == d)
            cur_min_id = n_id;
    });

    return { id: cur_min_id, distance: cur_min_dist };
}
function get_distance(coord1, coord2) {
    // n1 and n2 are valid node ids (strings)
    // aproximate distance in meters between nodes

    coords1 = sphere_to_cart(coord1);
    coords2 = sphere_to_cart(coord2);

    dx = coords1[0] - coords2[0];
    dy = coords1[1] - coords2[1];
    dz = coords1[2] - coords2[2];

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

}

function get_nearest_coord(pos, coords) {
    // coords is an array of objects having lng and lat attributes
    // pos is a long, lat pair
    // returns the closest coord pair and picks out of the closest 2 the one the farthest along the path (largest index)


    let cur_min = Infinity;
    let sec_min_index = null;
    let cur_min_index;
    let pos_cart = sphere_to_cart(pos)



    for (let i = 0; i < coords.length; i++) {
        let coord = sphere_to_cart([coords[i].lng, coords[i].lat]);

        let cur_dist = get_distance(pos_cart, coord);

        if (cur_dist < cur_min) {
            if (cur_min != Infinity)
                sec_min_index = cur_min_index;

            cur_min = cur_dist;
            cur_min_index = i;
        }
    }

    let ret_index = cur_min_index > sec_min_index || !sec_min_index ? cur_min_index : sec_min_index;

    return ret_index;
}

// tested loosely--should work to calculate straight line distance between two nodes
function h(n1, n2) {
    // n1 and n2 are valid node ids (strings)
    // aproximate distance in meters between nodes

    n1 = school_map.get(n1);
    n2 = school_map.get(n2);

    coords1 = sphere_to_cart(n1.coords);
    coords2 = sphere_to_cart(n2.coords);

    dx = coords1[0] - coords2[0];
    dy = coords1[1] - coords2[1];
    dz = coords1[2] - coords2[2];

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
}

function get_nearest_coord_pair(pos, coords) {
    // coords is an array of long lat pairs
    // pos is a long, lat pair
    // returns the closest coord pair and picks out of the closest 2 the one the farthest along the path (largest index)


    let cur_min = Infinity;
    let sec_min_index = null;
    let cur_min_index;
    let pos_cart = sphere_to_cart(pos)



    for (let i = 0; i < coords.length; i++) {
        let coord = sphere_to_cart(coords[i]);

        let cur_dist = get_distance(pos_cart, coord);

        if (cur_dist < cur_min) {
            if (cur_min != Infinity)
                sec_min_index = cur_min_index;

            cur_min = cur_dist;
            cur_min_index = i;
        }
    }

    let ret_index = cur_min_index > sec_min_index || !sec_min_index ? cur_min_index : sec_min_index;

    return ret_index;
}

function convert_polypath_to_long_lats(polyPath) {
    // converts an array of objects representing a polyline (each having lng and lat as an attribute)
    // into [lng, lat] pairs

    let new_arr = [];

    polyPath.forEach(function (pt) {
        new_arr.push([pt.lng, pt.lat]);
    })

    return new_arr;
}