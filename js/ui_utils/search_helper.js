const search = document.getElementById("dest_search");
const results = document.getElementById("results");


search.addEventListener('input', () => {
    const query = search.value.toLowerCase();
    const result1 = document.createElement("div");
    
    result1.textContent = "Hello";

    console.log("Get ret");
    results.appendChild(result1)

})