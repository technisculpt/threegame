import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'

export default class Player
{
    constructor(scene, camera, width, height, grid_size, x_vel, y_vel, keys, player_name, colour)
    {
        const tween_duration = 20;
        const geometry2 = new THREE.BoxGeometry(grid_size, grid_size, grid_size)
        const material2 = new THREE.MeshBasicMaterial({color: colour})
        const player_1 = new THREE.Mesh(geometry2, material2)
        player_1.name = player_name
        player_1.position.x = grid_size - width/2
        player_1.position.y = grid_size - height/2
        player_1.position.z += grid_size
        scene.add(player_1)

        document.addEventListener('keydown', logKey);
        //document.addEventListener('mousemove', logMovement);

        function logMovement(e)
        {
            camera.rotation.y -= e.movementX/100;
        }

        function logKey(e)
        {
            var player1 = scene.getObjectByName(player_name);
            let x_pos = Math.floor((player1.position.x + width/2)/grid_size)
            let y_pos = Math.floor((player1.position.y + height/2)/grid_size)
            if (e.code == keys[0]) // up
            {
                if (!document.grid.grid[x_pos][y_pos + 1])
                {  
                    new TWEEN.Tween(player1.position).to({y: player1.position.y + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y + grid_size},tween_duration).start()
                }
            }
            if (e.code == keys[1])
            {
                if (!document.grid.grid[x_pos][y_pos - 1])
                {
                    new TWEEN.Tween(player1.position).to({y: player1.position.y - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y - grid_size},tween_duration).start()
                }
            }
            if (e.code == keys[2])
            {
                if (!document.grid.grid[x_pos - 1][y_pos])
                {
                    new TWEEN.Tween(player1.position).to({x: player1.position.x - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x - grid_size},tween_duration).start()
                }
            }
            if (e.code == keys[3])
            {
                if (!document.grid.grid[x_pos + 1][y_pos])
                {
                    new TWEEN.Tween(player1.position).to({x: player1.position.x + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x + grid_size},tween_duration).start()
                }
            }
        }
    }
}
