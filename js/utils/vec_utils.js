const STRAIGHT_TOLERANCE = 20; // all cross products in the range (-STRAIGHT_TOLERANCE, STRAIGHT_TOLERANCE)
// and if the cross product is greater than STRAIGHT_TOLERANCE then we turn left
// and if the cross product is less than -STRAIGHT_TOLERANCE then we turn right
// increase for more stability but possibly less responsiveness

function make_vec(coord1, coord2) {
    // makes a vec out of a pair or coordinates
    return [coord2[0] - coord1[0], coord2[1] - coord1[1]]
}

function dot_prod(v1, v2) {
    // calculates dot product between vectors
    return v1[0] * v2[0] + v1[1] * v2[1];
}

function cross_product(v1, v2) {
    // cross product of two 2d vectors

    return [0, 0, v1[0] * v2[1] - v1[1] * v2[0]]
}
function direction(v1, v2) {
    // indicate direction using right hand rule
    let k = cross_product(v1, v2)[2];

    let direction;
    if (Math.abs(k) < STRAIGHT_TOLERANCE) {
        direction = "Straight";
    } else if (k >= STRAIGHT_TOLERANCE) {
        direction = "Left";
    } else if (k <= -STRAIGHT_TOLERANCE) {
        direction = "Right";
    }

    return direction;
}

function get_dist_from_line(p1, p2, p3) {
    // calculates the distance of p3 from the line going through p1 to p2 
    // all coords are in cartesian

    let pt_line = make_vec(p1, p3);
    let route_line = make_vec(p1, p2);

    let proj_scalar = dot_prod(pt_line, route_line) / dot_prod(route_line, route_line);

    let rejection = [pt_line[0] - proj_scalar * route_line[0], pt_line[1] - proj_scalar * route_line[1]];

    return Math.sqrt(dot_prod(rejection, rejection));
}


function calculate_distance(pair1, pair2){
    // calculates the distance between two cart coords
    let v = make_vec(pair1, pair2);

    return Math.sqrt(dot_prod(v, v));
}