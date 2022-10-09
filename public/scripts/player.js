import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'

export default class Player
{
    constructor(scene, camera, width, height, grid_size, x_vel, y_vel, keys, player_name, colour)
    {
        this.debounce = false;
        this.tween_duration = 100;
        this.camera = camera;
        this.keys = keys;
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        const geometry = new THREE.CylinderGeometry(this.grid_size/2, this.grid_size/2, this.grid_size, 20);
        const material = new THREE.MeshBasicMaterial({color: colour})
        this.player_mesh = new THREE.Mesh(geometry, material)
        this.player_mesh.name = player_name
        this.player_mesh.position.x = grid_size - width/2
        this.player_mesh.position.y = grid_size - height/2
        this.player_mesh.position.z += grid_size
        this.player_mesh.rotation.x += Math.PI/2
        this.scene = scene
        this.scene.add(this.player_mesh)

        document.addEventListener('keydown', this.logKey);
        //document.addEventListener('mousemove', logMovement);
    }
    
    logMovement = (e) =>
    {
        this.camera.rotation.y -= e.movementX/100;
    }

    set_debounce = () =>
    {
        this.debounce = false;

    }

    logKey = (e) =>
    {
        if(!this.debounce)
        {
            this.debounce = true;
            setTimeout(this.set_debounce, this.tween_duration + 50);
            let x_pos = Math.floor((this.player_mesh.position.x + this.width/2)/this.grid_size)
            let y_pos = Math.floor((this.player_mesh.position.y + this.height/2)/this.grid_size)
            if (e.code == this.keys[0]) // up
            {
                if (!document.grid.grid[x_pos][y_pos + 1])
                {  
                    new TWEEN.Tween(this.player_mesh.position).to({y: this.player_mesh.position.y + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({y: this.camera.position.y + this.grid_size},this.tween_duration).start()
                }
                else if (!document.grid.grid[x_pos][y_pos + 2])
                {
                    document.grid.grid[x_pos][y_pos + 1] = 0;
                    document.grid.grid[x_pos][y_pos + 2] = 1;
                    var selected_box = this.scene.getObjectByName(String(x_pos) + String(y_pos + 1));
                    selected_box.name = String(x_pos) + String(y_pos + 2)
                    new TWEEN.Tween(selected_box.position).to({y: selected_box.position.y + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.player_mesh.position).to({y: this.player_mesh.position.y + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({y: this.camera.position.y + this.grid_size},this.tween_duration).start()
                }
            }

            if (e.code == this.keys[1])  // down
            {
                if (!document.grid.grid[x_pos][y_pos - 1])
                {
                    new TWEEN.Tween(this.player_mesh.position).to({y: this.player_mesh.position.y - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({y: this.camera.position.y - this.grid_size},this.tween_duration).start()
                }
                else if (!document.grid.grid[x_pos][y_pos - 2])
                {
                    document.grid.grid[x_pos][y_pos - 1] = 0;
                    document.grid.grid[x_pos][y_pos - 2] = 1;
                    var selected_box = this.scene.getObjectByName(String(x_pos) + String(y_pos - 1));
                    selected_box.name = String(x_pos) + String(y_pos - 2)
                    new TWEEN.Tween(selected_box.position).to({y: selected_box.position.y - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.player_mesh.position).to({y: this.player_mesh.position.y - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({y: this.camera.position.y - this.grid_size},this.tween_duration).start()
                }
            }
            if (e.code == this.keys[2])
            {
                if (!document.grid.grid[x_pos - 1][y_pos])
                {
                    new TWEEN.Tween(this.player_mesh.position).to({x: this.player_mesh.position.x - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({x: this.camera.position.x - this.grid_size},this.tween_duration).start()
                }
                else if (!document.grid.grid[x_pos - 2][y_pos])
                {
                    document.grid.grid[x_pos - 1][y_pos] = 0;
                    document.grid.grid[x_pos - 2][y_pos] = 1;
                    var selected_box = this.scene.getObjectByName(String(x_pos - 1) + String(y_pos));
                    selected_box.name = String(x_pos - 2) + String(y_pos)
                    new TWEEN.Tween(selected_box.position).to({x: selected_box.position.x - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.player_mesh.position).to({x: this.player_mesh.position.x - this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({x: this.camera.position.x - this.grid_size},this.tween_duration).start()
                }
            }
            if (e.code == this.keys[3])
            {
                if (!document.grid.grid[x_pos + 1][y_pos])
                {
                    new TWEEN.Tween(this.player_mesh.position).to({x: this.player_mesh.position.x + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({x: this.camera.position.x + this.grid_size},this.tween_duration).start()
                }
                else if (!document.grid.grid[x_pos + 2][y_pos])
                {
                    document.grid.grid[x_pos + 1][y_pos] = 0;
                    document.grid.grid[x_pos + 2][y_pos] = 1;
                    var selected_box = this.scene.getObjectByName(String(x_pos + 1) + String(y_pos));
                    selected_box.name = String(x_pos + 2) + String(y_pos)
                    new TWEEN.Tween(selected_box.position).to({x: selected_box.position.x + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.player_mesh.position).to({x: this.player_mesh.position.x + this.grid_size},this.tween_duration).start()
                    new TWEEN.Tween(this.camera.position).to({x: this.camera.position.x + this.grid_size},this.tween_duration).start()
                }
            }
        }
    }
}
