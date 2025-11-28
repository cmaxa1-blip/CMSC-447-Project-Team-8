function route_gen(){
    let start = document.getElementById("starts").value;
    let end = document.getElementById("destinations").value;
    generate_route(start, end);

}

let choose_start = document.getElementById("starts");
let choose_end = document.getElementById("destinations");
for(const key of school_map.keys()){
    const option = document.createElement('option');
    const option2 = document.createElement("option");
    option.value = key;
    option2.value = key;
    option.textContent = key;
    option2.textContent = key;
    choose_end.appendChild(option);
    choose_start.appendChild(option2);
}