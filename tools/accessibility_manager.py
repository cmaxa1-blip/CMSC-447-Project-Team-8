import osmnx as ox
import folium


walkable = ["footway", "steps", "path", "pedestrian", "living_street"] # All walkable highway assignments 
def prune_non_walkways(G):
    raw_nodes = dict(G.nodes(data=True))

    remove_nodes = []
    # Prunes nodes that are only accessible via road
    for node in raw_nodes:
        
        # check if all edges are streets
        has_walkway = False
        remove_edges = {}
        for neighbor in G.neighbors(node):
            ed = G.get_edge_data(node, neighbor)
            
            if ed:
                # Check each edge between neighbors
                for edge in ed:
                    # If at least one is a walkway we can keep the node
                    for w_path in walkable:
                        if w_path in ed[edge].get("highway", False):
                            has_walkway = True
                            break
                    
                    if not has_walkway:
                        # Remove edges that are roadways we have no need
                        if remove_edges.get(neighbor, []):
                            # Add the edge id to a dictionary where keys are neighbor --> list of edge ids between source and neighbor to delete
                            remove_edges[neighbor].append(edge)
                        else:
                            remove_edges[neighbor] = [edge]
            
        # Remove non-footpath edges
        for neighbor in remove_edges:
            for index in remove_edges[neighbor]:
                G.remove_edge(node, neighbor, index)
            
        
        # Delete nodes not accessible via footpaths
        if not has_walkway:
            remove_nodes.append(node)
        
                    
        
    for node in remove_nodes:
        G.remove_node(node)
    
def draw_graph(G):
    # Convert to GeoDataFrames
    # Grab longitude and latitude
    nodes, edges = ox.graph_to_gdfs(G)

    # Create Folium map centered on UMBC
    center_lat = nodes.geometry.y.mean()
    center_lon = nodes.geometry.x.mean()
    m = folium.Map(location=[center_lat, center_lon], zoom_start=16)

    # Add edges as lines
    for _, row in edges.iterrows():
        if row.geometry.geom_type == 'LineString':
            folium.PolyLine(locations=[(pt[1], pt[0]) for pt in row.geometry.coords],
                            color='blue', weight=8, opacity=0.6,  popup=folium.Popup(f"{row['osmid']}")).add_to(m)

    # Optional: Add nodes as red dots
    for _, row in nodes.iterrows():
        folium.CircleMarker(location=(row.geometry.y, row.geometry.x),
                            radius=2, color='red', fill=True, popup=folium.Popup(f"{_}")).add_to(m) # The popup here is temporary and is only for iding nodes for navigation testing purposes

    # Add js interaction
    m.get_root().html.add_child(folium.Element("""
    <script>
    let routes = new Map();
  setTimeout(function() {
    let layers = document.querySelectorAll('.leaflet-interactive');
    
    layers.forEach(function(layer) {
        layer.addEventListener('click', function(e) {
        setTimeout(function() {
            let pops = document.getElementsByClassName("leaflet-popup-content");
        
            console.log("Mapping:", routes);
            // Toggle color
            if (e.srcElement.style.stroke == "gray"){
                e.srcElement.style.stroke = "blue";
                
                if (pops.length > 0){
                    routes.set(pops[0].firstChild.innerHTML, true);
                }
            }else{
                e.srcElement.style.stroke = "gray"
                
                if (pops.length > 0){
                    routes.set(pops[0].firstChild.innerHTML, false);
                }
            }
            
        }, 10);
      });
      
    });
  }, 500);
  
  function edge_to_json(){
      let modifications = JSON.stringify(Array.from(routes.entries()));
      const mods = new Blob([modifications], {type: "text/plain"});
      const url = URL.createObjectURL(mods);
      const link = document.createElement("a");
      link.href = url;
      link.download = "modifications.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("mods:", modifications);
      
  }
  </script>
  <button onclick="edge_to_json()">Generate Map</button>
    """))
    # Save or display
    m.save("umbc_node_map_mod.html")

if __name__ == "__main__":
    G = ox.load_graphml("UMBC.graphml")
    prune_non_walkways(G)
    draw_graph(G)
