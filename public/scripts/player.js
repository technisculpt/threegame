import * as THREE from 'three'

export default class Player
{
    constructor(scene, width, height, grid_size, x_vel, y_vel, keys, player_name, colour)
    {
        const geometry2 = new THREE.BoxGeometry(grid_size, grid_size, grid_size)
        const material2 = new THREE.MeshPhongMaterial({color: colour})
        const player_1 = new THREE.Mesh(geometry2, material2)
        player_1.name = player_name
        player_1.position.x = grid_size - width/2
        player_1.position.y = grid_size - height/2
        player_1.position.z += grid_size
        scene.add(player_1)

        document.addEventListener('keydown', logKey);

        function logKey(e)
        {
            var player1 = scene.getObjectByName(player_name);
            let x_pos = Math.floor((player1.position.x + width/2)/grid_size)
            let y_pos = Math.floor((player1.position.y + height/2)/grid_size)
            if (e.code == keys[0]) // up
            {
                if (document.grid.grid[x_pos][y_pos + 1] == 1)
                {
                    //pass
                }
                else
                {
                    player1.position.y += grid_size;
                }
            }
            if (e.code == keys[1])
            {
                if (document.grid.grid[x_pos][y_pos - 1] == 1)
                {
                    //pass
                }
                else
                {
                    player1.position.y -= grid_size;
                }
            }
            if (e.code == keys[2])
            {
                if (document.grid.grid[x_pos - 1][y_pos] == 1)
                {
                    //pass
                }
                else
                {
                    player1.position.x -= x_vel;
                }
            }
            if (e.code == keys[3])
            {
                if (document.grid.grid[x_pos + 1][y_pos] == 1)
                {
                    //pass
                }
                else
                {
                    player1.position.x += x_vel;
                }
            }
        }
    }
}
