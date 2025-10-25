import osmnx as ox
import json
from sys import argv
from accessibility_manager import prune_non_walkways

nodes = {}

# ------------------------------------------------------------------------ #
# Used this to grab from API

# place_name = "University of Maryland, Baltimore County, Maryland, USA"
# G = ox.graph_from_place(place_name, network_type='walk')

# Saves to file
# ox.save_graphml(G, filepath="UMBC.graphml")

# ------------------------------------------------------------------------ #
walkable = ["footway", "steps", "path", "pedestrian", "living_street"] # All walkable highway assignments 
mods = {}
try:
    with open("modifications.json", 'r')as f:
        mods = json.load(f)
except FileNotFoundError:
    pass

mods = dict(mods)

try:
    G = ox.load_graphml("UMBC.graphml")
except:
    print("Make sure you have UMBC.graphml in the working directory")

prune_non_walkways(G)
raw_nodes = dict(G.nodes(data=True))

def is_walkable(h_way):
    if type(h_way) != list:
        return h_way in walkable
    
    for p in h_way:
        if p in walkable:
            return True
    return False

def node_to_dict(id, node_data):
    """
    Converts a node with attributes into dictionary
    
    id: DiGraph node id
    node_data: attribute dictionary returned by raw_nodes[id]
    """
    edges = []
    
    # Get each neighboring node's id
    for neighbor in G.neighbors(id):
        # Get dictionary with edge number --> edge attribute data
        edge = G.get_edge_data(id, neighbor)
        
        # Iterate over edges between id and neighbor since could be multiple (unlikely in UMBC case)
        for k, v in edge.items():
            edge_id = v.get("osmid", "")

            # Make sure we only include pedestrian walkways between nodes
            if is_walkable(v.get("highway", False)): 
                geo = v.get("geometry", False) # Gets the LineString of long lat pairs showing how to draw path
                
                # Notice that we assume the path is accessible since a majority of paths are accessible
                accesibility = mods.get(str(edge_id), True)
                edges.append({"source":id, "target":neighbor, "length":v.get("length", 0), "accessible":accesibility, "path": [list(pair) for pair in list(geo.coords)] if geo else []})
        
        
    return {"coords":[node_data['x'], node_data['y']], "edges":edges}

def write_js_file():
    with open("school_map.js", 'w') as file:
        file.write("const school_map = new Map();\n")
        
        for node in nodes:
            obj = str(nodes[node]).replace('\'', "").lower()
            
            file.write(f"school_map.set(\"{node}\", {obj});\n")
    
    
# Go through all nodes
for id, data in raw_nodes.items():
    nodes[id] = node_to_dict(id, data)

write_js_file()