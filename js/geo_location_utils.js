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
