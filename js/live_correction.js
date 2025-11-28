// both are in meters
const REDIRECT_CUTOFF = 5; // smallest distance from route we should tell the user to return to the route
const REROUTE_CUTOFF = 8; // largest distance from route allowed before we reroute
const NEXT_INSTRUC_DIST = 15; // distance from next bend in path to update instructions

function get_next_instruc(pos, route) {
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
    console.log("Distance", d);
    if (d > REDIRECT_CUTOFF && d < REROUTE_CUTOFF) {
        return "Turn around";
    } else if (d >= REROUTE_CUTOFF) {
        return "Rerouting";
    }*/


    if (pts == route.length - 1 && calculate_distance(pos, sphere_to_cart(route[pts])) <= ARRIVED_DIST) {
        routeStarted = false;
        return "Arrived";
    } else if (pts == route.length - 1) {
        return "Straight";
    } else if (pts == 0) {
        if (route.length < 3) {
            return "Straight";
        }
        let p0 = sphere_to_cart(route[0]);
        let p1 = sphere_to_cart(route[1]);
        let p2 = sphere_to_cart(route[2]);
        v1 = [p1[0] - p0[0], p1[1] - p0[1]];
        v2 = [p2[0] - p1[0], p2[1] - p1[1]];

        if (calculate_distance(pos, p1) > NEXT_INSTRUC_DIST)
            return "Straight";
    } else {
        let p1 = sphere_to_cart(route[pts - 1]);
        let p2 = sphere_to_cart(route[pts + 1]);
        let p = sphere_to_cart(route[pts]);

        let d1 = get_dist_from_line(p1, p, pos);
        let d2 = get_dist_from_line(p, p2, pos);

        if (d1 <= d2) {
            v1 = make_vec(p1, p);
            v2 = make_vec(p, p2);

            if(calculate_distance(pos, p) >= calculate_distance(p1, p))
                return "Return to the route";

            if (calculate_distance(pos, p) > NEXT_INSTRUC_DIST)
                return "Straight";
        } else {
            if (pts + 1 == route.length - 1) {
                return "Straight";
            }

            v1 = make_vec(p, p2);

            if (route.length < 3) {
                return "Straight";
            }
            if (calculate_distance(pos, p2) >= calculate_distance(p, p2))
                return "Return to the route";
            if (calculate_distance(pos, sphere_to_cart(route[pts + 1])) > NEXT_INSTRUC_DIST)
                return "Straight";
            v2 = make_vec(p2, sphere_to_cart(route[pts + 2]));
        }
    }

    return direction(v1, v2);

    /*
    1. get anchor points user is in between
    2. Get next 2 anchor points
    3. use cross product to determine direction between the 2 vectors
    */
}