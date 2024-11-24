let btn = document.getElementById("button");
btn.addEventListener("click", generate_grid);

let stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", stop_game);

let input = document.getElementById("desired_size");

let intervalId
let counter = 0;
let grid_size = NaN;
let grid_state = [];


function update_grid() {
    let next_state = []
    for (let i = 0; i < grid_state.length; i++) {
        cell_neighbors = get_neighbors(i, grid_size)
        alive_neighbors = calculate_alive_neighbors(cell_neighbors)
        
        // applying game of life rules
        if (grid_state[i] === "alive") {
            next_state[i] = (alive_neighbors === 2 || alive_neighbors === 3) ? "alive" : "dead";
        } else {
            next_state[i] = (alive_neighbors === 3) ? "alive" : "dead";
        }
    }
    grid_state = next_state;
    render_grid()
           
}
function add_child(id) {
    let state = Math.random() < 0.333 ? "alive" : "dead"; // Randomly decide if cell is alive or dead
    document.getElementById("container").innerHTML += `<div id="${id}"class="child ${state}"></div>`;
    grid_state[id] = state
}

function generate_grid() {
    grid_size = parseInt(input.value);

    if (isNaN(grid_size) || grid_size <= 0) {
        alert("ERROR! Introdueix un numero valid");
        return;
    }
    container.style.gridTemplateColumns = `repeat(${grid_size}, 10px)`;
    document.getElementById("container").innerHTML = "";

    for (let i = 0; i < grid_size*grid_size; i++) add_child(i);

    // Call render_grid to reflect the current state
    render_grid();

    // Start the automatic updates 
    if (intervalId) {
        clearInterval(intervalId); // Clear any previous intervals before starting a new one
        counter = 0
    }
    intervalId = setInterval(update_grid, 100); // Update the grid every 100ms
}

function stop_game() {
    if (intervalId) {
        clearInterval(intervalId); // Stop the grid updates
    }
}

function get_neighbors(index, size) {
    let neighbors = []
    let row = Math.floor(index / size); // cell row
    let col = index % size; // cell column
    let neighborPositions = [
        [-1, -1 ],   [-1,0],    [-1, 1],
        [ 0, -1 ],              [ 0, 1],
        [ 1, -1 ],   [ 1,0],    [ 1, 1]
    ];

    for (let [dRow, dCol] of neighborPositions) {
        let newRow = row + dRow; // converting the row from relative to the cell to relative to the grid
        let newCol = col + dCol; // converting the column from relative to the cell to relative to the grid
        
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
            // Convert the 2D (newRow, newCol) back to a 1D index
            let neighborIndex = newRow * size + newCol;
            neighbors.push(neighborIndex);
        }    
    }
    return neighbors
}

function calculate_alive_neighbors(neighbors){
    let alive_neighbors = 0
    for (let j = 0; j < neighbors.length; j++) {
        let neighborIndex = neighbors[j]
        if (grid_state[neighborIndex] === "alive") alive_neighbors += 1
    }
    return alive_neighbors
}

function render_grid(){
    counter+=1;
    let counter_screen = document.getElementById("counter")
    counter_screen.innerHTML = `Iterations: ${counter}`
    let container = document.getElementById("container");
    // Iterate over each cell and update its class based on the current state
    for (let i = 0; i < grid_state.length; i++) {
        let cell = document.getElementById(i.toString());
        if (cell) {
            let state = grid_state[i];
            if (cell.classList.contains("alive") && state !== "alive") {
                cell.classList.remove("alive");
                cell.classList.add("dead");
            } else if (!cell.classList.contains("alive") && state === "alive") {
                cell.classList.remove("dead");
                cell.classList.add("alive");
            }
        }
    }

}