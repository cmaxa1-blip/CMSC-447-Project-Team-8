/**
 * Simulates a person walking along a route with minor noise.
 * @param {Array} route - Array of [lng, lat] pairs representing the path.
 * @param {number} velocity - Walking speed in meters per second.
 * @param {number} dt - Time step in seconds (default 1s).
 * @param {number} noise - Max noise in meters (default 0.5m).
 * @returns {Generator} Yields simulated positions along the route.
 */
function* simulateWalker(route, velocity, dt = 1, noise = 0.5) {
    if (route.length < 2) throw new Error("Route must have at least 2 points");

    let currentIndex = 0;
    let pos = sphere_to_cart(route[0]); // start at first point
    let next = sphere_to_cart(route[1]);

    // Helper: add Gaussian-ish noise
    const addNoise = (coord) => {
        const rand = () => (Math.random() - 0.5) * 2 * noise;
        return [coord[0] + rand(), coord[1] + rand(), coord[2] + rand()];
    };

    while (currentIndex < route.length - 1) {
        // Vector from current to next
        let vec = [
            next[0] - pos[0],
            next[1] - pos[1],
            next[2] - pos[2]
        ];
        let dist = Math.sqrt(vec[0]**2 + vec[1]**2 + vec[2]**2);

        // Step size
        let step = velocity * dt;

        if (step >= dist) {
            // Move to next anchor
            pos = next;
            currentIndex++;
            if (currentIndex < route.length - 1) {
                next = sphere_to_cart(route[currentIndex + 1]);
            }
        } else {
            // Move along vector
            pos = [
                pos[0] + (vec[0] / dist) * step,
                pos[1] + (vec[1] / dist) * step,
                pos[2] + (vec[2] / dist) * step
            ];
        }

        yield addNoise(pos); // return noisy position
    }
}


