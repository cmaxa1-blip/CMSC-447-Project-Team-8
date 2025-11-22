const STRAIGHT_TOLERANCE = 1; // all cross products in the range (-STRAIGHT_TOLERANCE, STRAIGHT_TOLERANCE)
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

function cross_product(v1, v2){
    // cross product of two 2d vectors

    return [0, 0, v1[0] * v2[1] - v1[1] * v2[0]]
}
function direction(v1, v2) {
    // calculate angle in degrees between two vectors
    let k = cross_product(v1, v2)[2];

    let direction;
    if(Math.abs(k) < 1){
        direction = "Straight";
    }else if(k >= 1){
        direction = "Left";
    }else if(k <= -1){
        direction = "Right";
    }

    return direction;
}