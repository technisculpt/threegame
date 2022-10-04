import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'

export default class Player
{
    constructor(scene, camera, width, height, grid_size, x_vel, y_vel, keys, player_name, colour)
    {
        const tween_duration = 20;
        const geometry = new THREE.CylinderGeometry(grid_size/2, grid_size/2, grid_size, 20);
        const material = new THREE.MeshBasicMaterial({color: colour})
        const player_mesh = new THREE.Mesh(geometry, material)
        player_mesh.name = player_name
        player_mesh.position.x = grid_size - width/2
        player_mesh.position.y = grid_size - height/2
        player_mesh.position.z += grid_size
        player_mesh.rotation.x += Math.PI/2
        scene.add(player_mesh)

        document.addEventListener('keydown', logKey);
        //document.addEventListener('mousemove', logMovement);

        function logMovement(e)
        {
            camera.rotation.y -= e.movementX/100;
        }

        function logKey(e)
        {
            let x_pos = Math.floor((player_mesh.position.x + width/2)/grid_size)
            let y_pos = Math.floor((player_mesh.position.y + height/2)/grid_size)
            if (e.code == keys[0]) // up
            {
                if (!document.grid.grid[x_pos][y_pos + 1])
                {  
                    new TWEEN.Tween(player_mesh.position).to({y: player_mesh.position.y + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y + grid_size},tween_duration).start()
                }
                else if (!document.grid.grid[x_pos][y_pos + 2])
                {
                    document.grid.grid[x_pos][y_pos + 1] = 0;
                    document.grid.grid[x_pos][y_pos + 2] = 1;
                    var selected_box = scene.getObjectByName(String(x_pos) + String(y_pos + 1));
                    selected_box.name = String(x_pos) + String(y_pos + 2)
                    new TWEEN.Tween(selected_box.position).to({y: selected_box.position.y + grid_size},tween_duration).start()
                    new TWEEN.Tween(player_mesh.position).to({y: player_mesh.position.y + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y + grid_size},tween_duration).start()
                }
            }

            if (e.code == keys[1])
            {
                if (!document.grid.grid[x_pos][y_pos - 1])
                {
                    new TWEEN.Tween(player_mesh.position).to({y: player_mesh.position.y - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y - grid_size},tween_duration).start()
                }
                else if (!document.grid.grid[x_pos][y_pos - 2])
                {
                    document.grid.grid[x_pos][y_pos - 1] = 0;
                    document.grid.grid[x_pos][y_pos - 2] = 1;
                    var selected_box = scene.getObjectByName(String(x_pos) + String(y_pos - 1));
                    selected_box.name = String(x_pos) + String(y_pos - 2)
                    new TWEEN.Tween(selected_box.position).to({y: selected_box.position.y - grid_size},tween_duration).start()
                    new TWEEN.Tween(player_mesh.position).to({y: player_mesh.position.y - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({y: camera.position.y - grid_size},tween_duration).start()
                }
            }
            if (e.code == keys[2])
            {
                if (!document.grid.grid[x_pos - 1][y_pos])
                {
                    new TWEEN.Tween(player_mesh.position).to({x: player_mesh.position.x - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x - grid_size},tween_duration).start()
                }
                else if (!document.grid.grid[x_pos - 2][y_pos])
                {
                    document.grid.grid[x_pos - 1][y_pos] = 0;
                    document.grid.grid[x_pos - 2][y_pos] = 1;
                    var selected_box = scene.getObjectByName(String(x_pos - 1) + String(y_pos));
                    selected_box.name = String(x_pos - 2) + String(y_pos)
                    new TWEEN.Tween(selected_box.position).to({x: selected_box.position.x - grid_size},tween_duration).start()
                    new TWEEN.Tween(player_mesh.position).to({x: player_mesh.position.x - grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x - grid_size},tween_duration).start()
                }
            }
            if (e.code == keys[3])
            {
                if (!document.grid.grid[x_pos + 1][y_pos])
                {
                    new TWEEN.Tween(player_mesh.position).to({x: player_mesh.position.x + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x + grid_size},tween_duration).start()
                }
                else if (!document.grid.grid[x_pos + 2][y_pos])
                {
                    document.grid.grid[x_pos + 1][y_pos] = 0;
                    document.grid.grid[x_pos + 2][y_pos] = 1;
                    var selected_box = scene.getObjectByName(String(x_pos + 1) + String(y_pos));
                    selected_box.name = String(x_pos + 2) + String(y_pos)
                    new TWEEN.Tween(selected_box.position).to({x: selected_box.position.x + grid_size},tween_duration).start()
                    new TWEEN.Tween(player_mesh.position).to({x: player_mesh.position.x + grid_size},tween_duration).start()
                    new TWEEN.Tween(camera.position).to({x: camera.position.x + grid_size},tween_duration).start()
                }
            }
        }
    }
}
