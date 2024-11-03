const graph = {
    A: { B: 2, D: 8 },
    B: { A: 2, C: 4 },
    C: { B: 4, D: 1, E: 3 },
    D: { A: 8, C: 1, E: 5 },
    E: { C: 3, D: 5 }
};

function findShortestPath() {
    const startNode = document.getElementById("start").value;
    const endNode = document.getElementById("end").value;

    const distances = {};
    const previous = {};
    const visited = new Set();
    const queue = new PriorityQueue();

    for (let node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[startNode] = 0;
    queue.enqueue(startNode, 0);

    // Ha partir de acá iniciará el algoritmo como tal
    while (!queue.isEmpty()) {
        const { element: currentNode } = queue.dequeue();
        if (visited.has(currentNode)) continue;
        visited.add(currentNode);

        for (let neighbor in graph[currentNode]) {
            const distance = graph[currentNode][neighbor];
            const newDistance = distances[currentNode] + distance;

            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = currentNode;
                queue.enqueue(neighbor, newDistance);
            }
        }
    }

   
    let path = [];
    let node = endNode;
    while (node) {
        path.unshift(node);
        node = previous[node];
    }


    if (distances[endNode] !== Infinity) {
        document.getElementById("output").textContent = 
            `El camino más corto de ${startNode} a ${endNode} es ${path.join(" -> ")} con una distancia de ${distances[endNode]}.`;
        highlightPath(path);
    } else {
        document.getElementById("output").textContent = 
            `No existe un camino de ${startNode} a ${endNode}.`;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(element, priority) {
        this.values.push({ element, priority });
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    isEmpty() {
        return this.values.length === 0;
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

function highlightPath(path) {
    document.querySelectorAll('.node, .edge').forEach(el => el.classList.remove('highlight'));

    path.forEach((node, index) => {
        if (index > 0) {
            const prevNode = path[index - 1];
            const edge = document.querySelector(`line[data-weight="${graph[prevNode][node]}"]`);
            if (edge) edge.classList.add('highlight');
        }
        document.getElementById(node).classList.add('highlight');
    });
}
