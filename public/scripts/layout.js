import * as THREE from 'three'

export default class Layout {
    constructor(scene, ratio, width, height, grid_size, box_colour)
    {
        let rows = Math.floor(width/grid_size);
        let cols = Math.floor(height/grid_size);
        this.grid = Array(rows).fill().map(() => Array(cols).fill(0));
        let boxes = Math.floor(ratio * width/grid_size);

        for(let col = 0; col < cols; col++)
        {

            let box_count = 0;
            while(box_count < boxes)
            {
                let new_row = Math.floor((Math.random() * rows));
                if (!this.grid[col][new_row])
                {
                    this.grid[col][new_row] = 1;
                    new Box(scene, grid_size, col, new_row, width, height, box_colour);
                    box_count += 1;
                }
            }
        }
    }
}

class Box {
    constructor(scene, grid_size, x_pos, y_pos, width, height, box_colour)
    {
        const geometry = new THREE.BoxGeometry(grid_size, grid_size, grid_size);
        const material = new THREE.MeshPhongMaterial({color: box_colour});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (x_pos * grid_size) - width/2;
        cube.position.y = (y_pos * grid_size) - height/2;
        cube.position.z += grid_size;
        cube.name = String(x_pos) + ',' + String(y_pos)
        scene.add(cube);
    }

}