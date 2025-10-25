// A* will dequeue [node_id, cumulative path cost, heuristic, history array, the list of node ids which have led from the start node to the current node]
// expand node and enqueue children with [child node, cum path cost of parent + edge cost, heuristic]



// tested this and seems to work
class priorityQueue {
    constructor(f) {
        this.items = []; // will store arrays [node, path cost from start, estimated remaining distance]
        this.ordering = f; // ordering function
    }

    size(){
      return this.items.length;
    }
    bubbleSort(arr) {
        let n = arr.length;
        let swapped;

        // this bubble sort was AI generated, lets hope it works...
        // looks right....
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                let cur = arr[i];
                let next = arr[i + 1];
                
                // change to include goal node in ordering args (when done testing)
                // first: we need to make the sorting order nodes based on edges between their parent (if multiple parents then the one that was expanded to add it)
                if (this.ordering(cur) > this.ordering(next)) {
                    // Swap
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // swaps adjacent elements
                    swapped = true;
                }
            }
            n--; // since end of the array is already sorted--makes it a little quicker
        } while (swapped);

        return arr;
    }


    enqueue(node) {
        this.items.push(node);
        this.items = this.bubbleSort(this.items);
    }

    dequeue(){
        if (this.items == []) throw new Error("Cannot dequeue! Queue is empty...");

        return this.items.shift(); // should return first element and shift everything over one
    }
};

// AI generated will look over this later
// encountered some issues while using this instead of my list-based queue
// good idea to look at using heap-based later to improve efficiency
class PriorityQueue {
  constructor(comparator) {
    if (typeof comparator !== 'function') {
      throw new Error('Comparator must be a function');
    }
    this.compare = comparator;
    this.heap = [];
  }

  // Index helpers
  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  // Swap elements
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Insert element
  enqueue(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  // Remove highest-priority element
  dequeue() {
    if (this.size() === 0) return null;
    if (this.size() === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return top;
  }

  // Peek at top element
  peek() {
    return this.size() > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  heapifyUp() {
    let index = this.size() - 1;
    while (
      index > 0 &&
      this.compare(this.heap[index], this.heap[this.getParentIndex(index)]) < 0
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    const length = this.size();

    while (this.getLeftChildIndex(index) < length) {
      let bestChild = this.getLeftChildIndex(index);
      const right = this.getRightChildIndex(index);

      if (
        right < length &&
        this.compare(this.heap[right], this.heap[bestChild]) < 0
      ) {
        bestChild = right;
      }

      if (this.compare(this.heap[index], this.heap[bestChild]) <= 0) break;

      this.swap(index, bestChild);
      index = bestChild;
    }
  }
}
