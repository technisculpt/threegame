import * as THREE from 'three'

export default class Layout {
    constructor(scene, ratio, width, height, grid_size)
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
                let new_position = Math.floor((Math.random() * rows));
                console.log(new_position)
                if (this.grid[col][new_position])
                {
                    // pass
                }
                else
                {
                    this.grid[col][new_position] = 1;
                    let box = new Box(scene, grid_size, col, new_position, width, height);
                    box_count += 1;
                }
            }
        }
    }
}

class Box {
    constructor(scene, grid_size, x_pos, y_pos, width, height)
    {
        const geometry = new THREE.BoxGeometry(grid_size, grid_size, grid_size);
        const material = new THREE.MeshPhongMaterial({color: 0xAA90A7});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = x_pos * grid_size - width/2;
        cube.position.y = y_pos * grid_size - height/2;
        cube.position.z += grid_size;
        scene.add(cube);
    }

}