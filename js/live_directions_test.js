
function get_slope(pt1, pt2, time) {
    pt1 = sphere_to_cart(pt1);
    pt2 = sphere_to_cart(pt2);

    let slope = make_vec(pt1, pt2);
    slope = [slope[0] / time, slope[1] / time];

    return slope;
}

function walk_line(pt1, slope, steps){
    
}