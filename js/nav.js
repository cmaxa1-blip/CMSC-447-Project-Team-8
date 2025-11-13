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
