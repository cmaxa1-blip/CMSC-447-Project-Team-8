
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
    opacity: 0.9, color:'gold', line:'black'
  }).addTo(nav_map);

  // fit view
  if (latLngs.length > 1) {
    try {
      nav_map.fitBounds(__tronLayer.getBounds(), { padding: [30, 30] });
    } catch (_) { }
  }
}
