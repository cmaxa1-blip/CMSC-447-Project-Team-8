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


function A_star(start_id, end_id) {
    // returns an empty array if no path could be found
    // start_id and end_id are valid node ids (strings)
    // returns sequence of nodes to visit for shortest path or [] if no path could be found
    if (start_id == end_id) return [start_id];

    if (!school_map.has(start_id) || !school_map.has(end_id)) throw new Error("Invalid node id");

    // priority queue ordered based on lowest total estimated cost
    let pq = new priorityQueue((triplet) => triplet[1] + triplet[2]);

    //let pq = new PriorityQueue((triplet) => (triplet[1] + triplet[2])); // heap based priority queue

    let visited = new Map(); // List of visited nodes

    pq.enqueue([start_id, 0, h(start_id, end_id), [start_id]]); // enqueue start node
    visited.set(start_id, [start_id, 0, h(start_id, end_id), [start_id]]);

    while (pq.size() != 0){
        let cur = pq.dequeue();
        let cur_id = cur[0];
        let cur_cost = cur[1];
        let cur_history = cur[3];

        if(cur_id == end_id) return cur_history; // returns the history if this is the goal

        let cur_node = school_map.get(cur[0]);

        // expand node
        for(const child of cur_node.edges){
            let child_id = child.target.toString();
            let visit = true;

            // check if we've visited it before
            // visit again if our new path is shorter than the previously discovered one
            if(visited.has(child_id))
                visit = cur_cost + child.length < visited.get(child_id)[1];

            // route needs to be accessible
            // can easily toggle on and off for full-nav features
            visit &= child.accessible;

            if(visit){
                //console.log("child id", child_id, "is accessible");
                let data = [child_id, child.length + cur_cost, h(child_id, end_id), [...cur_history, child_id]]
                pq.enqueue(data);
                visited.set(child_id, data);
            }
        }
    }

    return [];
    
}

/* bad nodes -- freezes algo: should test again since update
let id1 = "37753401";
let id2 = "5804970761";
let id3 = "345871676";
let id4 = "6786491120";
*/

// ----TRON LINE TRON LINE TRON LINE TRON LINE ----
let __tronLayer = null;

/**
 * Draws the route for a list of node IDs.
 * Uses each edge's saved polyline in edge.path.
 * Clears the old route first.
 * @param {string[]} path
 */
function tron_line(path) {
  if (!Array.isArray(path) || path.length < 2) return;

  // clear old route
  if (__tronLayer) {
    nav_map.removeLayer(__tronLayer);
    __tronLayer = null;
  }

  // find edge u -> v
  function findEdge(uId, vId) {
    const uNode = school_map.get(uId);
    if (!uNode) return null;
    for (const e of uNode.edges) {
      if (e.target.toString() === vId.toString()) return e;
    }
    return null;
  }

  // Leaflet wants [lat, lng]; data is [lng, lat]
  const latLngs = [];

  // build points for each pair (u -> v)
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];

    const edge = findEdge(u, v);
    if (edge && Array.isArray(edge.path) && edge.path.length > 0) {
      // use stored polyline
      for (let j = 0; j < edge.path.length; j++) {
        const [lng, lat] = edge.path[j];
        const pt = [lat, lng];

        // avoid duplicate joints
        if (
          latLngs.length === 0 ||
          latLngs[latLngs.length - 1][0] !== pt[0] ||
          latLngs[latLngs.length - 1][1] !== pt[1]
        ) {
          latLngs.push(pt);
        }
      }
    } else {
      // fallback: straight line between nodes
      const uNode = school_map.get(u);
      const vNode = school_map.get(v);
      if (!uNode || !vNode) continue;

      const [uLng, uLat] = uNode.coords;
      const [vLng, vLat] = vNode.coords;
      const uPt = [uLat, uLng];
      const vPt = [vLat, vLng];

      if (
        latLngs.length === 0 ||
        latLngs[latLngs.length - 1][0] !== uPt[0] ||
        latLngs[latLngs.length - 1][1] !== uPt[1]
      ) {
        latLngs.push(uPt);
      }
      latLngs.push(vPt);
    }
  }

  // draw
  __tronLayer = L.polyline(latLngs, {
    weight: 6,
    opacity: 0.9
  }).addTo(nav_map);

  // fit view
  if (latLngs.length > 1) {
    try {
      nav_map.fitBounds(__tronLayer.getBounds(), { padding: [30, 30] });
    } catch (_) {}
  }
}