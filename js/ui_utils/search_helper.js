const search = document.getElementById("dest_search");
const results = document.getElementById("results");

function generate_result(group_name) {
    const filteredGroups = Array.from(groups.keys()).filter(key => key.toLowerCase().includes(group_name));

    console.log("Results", filteredGroups);
    filteredGroups.forEach((name) => {
        let cur_res = document.createElement("div");
        cur_res.classList.add('res');

        // result info test
        let info = document.createElement('div');
        info.classList.add('res-text');
        cur_res.appendChild(info);

        let p_name = document.createElement('p');
        p_name.textContent = name;
        let dist = document.createElement('p');
        let stats = get_closest_member(name, school_map.get(closest_id).coords);
        cur_res.onclick = function () { generate_route(stats.id) };

        dist.textContent = (stats.distance * 3.28).toFixed(1).toString() + "ft";
        info.appendChild(p_name);
        info.appendChild(dist);

        let go = document.createElement('button');
        go.textContent = "Go";
        go.classList.add('rounded-btn');
        go.onclick = function() {start_route()}

        cur_res.appendChild(go);

        results.appendChild(cur_res);
    })
}
search.addEventListener('input', () => {
    results.innerHTML = ""; // clears results

    const query = search.value.toLowerCase();

    generate_result(query);
})