import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'
import {check_vacancy} from './common.js'

export default class Ai
{
    constructor(scene, width, height, grid_size, colour)
    {
        this.debounce = false;
        this.tween_duration = 100;
        this.debounce_ms = 20;
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        this.grid_spaces = Math.floor(width/grid_size);
        const geometry = new THREE.CylinderGeometry(this.grid_size/2, this.grid_size/2, this.grid_size, 20);
        const material = new THREE.MeshBasicMaterial({color: colour})
        let new_pos = null;
        new_pos = check_vacancy([width/3, 2 * width/3, width/3, 2 * width/3], grid_size);
        this.ai_mesh = new THREE.Mesh(geometry, material);
        this.ai_mesh.position.x = (new_pos[0]  * grid_size) - width/2;
        this.ai_mesh.position.y = (new_pos[1] * grid_size)  - height/2;
        this.ai_mesh.position.z += grid_size
        this.ai_mesh.rotation.x += Math.PI/2
        document.grid.grid[new_pos[0]][new_pos[1]] = 'a';
        this.scene = scene
        this.scene.add(this.ai_mesh)
        this.dirX = Math.round(Math.random());
        if(this.dirX)
        {
            this.dirY = 0;
        }
        else
        {
            this.dirY = 1;
        }

        setInterval(this.move, this.tween_duration);
    }

    rotate = () =>
    {
        if(!this.dirX)
        {
            this.dirX = this.dirY;
            this.dirY = 0
        }
        if(!this.dirY)
        {
            this.dirY = this.dirX;
            this.dirX = 0
        }
    }

    change_dir = () =>
    {
        if(!this.dirX)
        {
            this.dirY *= -1;
        }
        if(!this.dirY)
        {
            this.dirX *= -1;
        }
    }

    set_debounce = () =>
    {
        this.debounce = false;
    }

    move = () =>
    {
        if(!this.debounce)
        {
            let x_pos = Math.floor((this.ai_mesh.position.x + this.width/2)/this.grid_size);
            let y_pos = Math.floor((this.ai_mesh.position.y + this.height/2)/this.grid_size);

            if ((x_pos + this.dirX >= this.grid_spaces) || (x_pos + this.dirX < 0) || // ai bounds check
            (y_pos + this.dirY >= this.grid_spaces) || (y_pos + this.dirY < 0))
            {
                this.change_dir();
                return;
            }

            if ((document.grid.grid[x_pos + this.dirX][y_pos + this.dirY] == 0) 
                || (document.grid.grid[x_pos + this.dirX][y_pos + this.dirY] > 1)) // no block in the way of ai
            {
                if (document.grid.grid[x_pos + this.dirX][y_pos + this.dirY] > 1)
                {
                    let player = this.scene.getObjectByName(String(x_pos + this.dirX) + ',' + String(y_pos + this.dirY));
                    player.object.delete(x_pos + this.dirX, y_pos + this.dirY);
                }
                this.debounce = true;
                setTimeout(this.set_debounce, this.tween_duration + this.debounce_ms);
                document.grid.grid[x_pos][y_pos] = 0;
                document.grid.grid[x_pos + this.dirX][y_pos + this.dirY] = 'a';
                new TWEEN.Tween(this.ai_mesh.position).to({
                    x: this.ai_mesh.position.x + this.dirX * this.grid_size,
                    y: this.ai_mesh.position.y + this.dirY * this.grid_size},this.tween_duration).start();

            }
            else
            {
                this.change_dir();
            }

        }
    }
}
