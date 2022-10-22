import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'
import {check_vacancy, load} from './common.js'
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

export default class Ai
{
    constructor(scene, width, height, grid_size, colour)
    {
        //let x = load(scene, '../assets/badguy.glb');
        const loader = new GLTFLoader();
        loader.load( '../assets/badguy.glb', async ( gltf ) => {
            scene.add(gltf.scene);
            this.ai_mesh = await gltf.scene;
            //this.ai_mesh.position.z += 10;
            //this.ai_mesh.rotation.x += Math.PI/2;

    

            this.debounce = false;
            this.tween_duration = 100;
            this.debounce_ms = 20;
            this.width = width;
            this.height = height;
            this.grid_size = grid_size;
            this.grid_spaces = Math.floor(width/grid_size);
            //const geometry = new THREE.CylinderGeometry(this.grid_size/2, this.grid_size/2, this.grid_size, 20);
            const material = new THREE.MeshBasicMaterial({color: colour})
            let new_pos = null;
            new_pos = check_vacancy([width/3, 2 * width/3, width/3, 2 * width/3], grid_size);
            //this.ai_mesh = new THREE.Mesh(geometry, material);
            //this.ai_mesh = new THREE.Mesh(this.obj, material);
            this.ai_mesh.position.x = (new_pos[0]  * grid_size) - width/2;
            this.ai_mesh.position.y = (new_pos[1] * grid_size)  - height/2;
            this.ai_mesh.position.z += grid_size
            this.ai_mesh.rotation.x += Math.PI/2
            document.grid.grid[new_pos[0]][new_pos[1]] = 'a';
            this.scene = scene
            //this.scene.add(this.ai_mesh)
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
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    pos = () =>
    {
        return [this.ai_mesh.position.x, this.ai_mesh.position.y];
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

    seek_player = (x, y) =>
    {
        let x_pos = this.grid_spaces - x;
        let x_neg = this.grid_spaces - x_pos + 1;
        let y_pos = this.grid_spaces - y;
        let y_neg = this.grid_spaces - y_pos + 1;

        if(!this.dirX) // going in y dir
        {
            if(this.dirY > 0)
            {
                for(let i=0; i<y_pos; i++)
                {
                    if(document.grid.grid[x][y + i] == 1) break;
                    if(document.grid.grid[x][y + i] > 1)
                    {
                        return [0, 1]
                    }
                }
                for(let i=0; i<y_neg; i++)
                {
                    if(document.grid.grid[x][y - i] == 1) break;
                    if(document.grid.grid[x][y - i] > 1)
                    {
                        return [0, -1]
                    }
                }
                for(let i=0; i<x_pos; i++)
                {
                    if(document.grid.grid[x + i][y] == 1) break;
                    if(document.grid.grid[x + i][y] > 1)
                    {
                        return [1, 0]
                    }
                }
                for(let i=0; i<x_neg; i++)
                {
                    if(document.grid.grid[x - i][y] == 1) break;
                    if(document.grid.grid[x - i][y] > 1)
                    {
                        return [-1, 0]
                    }
                }
            }
            else
            {
                for(let i=0; i<y_neg; i++)
                {
                    if(document.grid.grid[x][y - i] == 1) break;
                    if(document.grid.grid[x][y - i] > 1)
                    {
                        return [0, -1]
                    }
                }
                for(let i=0; i<y_pos; i++)
                {
                    if(document.grid.grid[x][y + i] == 1) break;
                    if(document.grid.grid[x][y + i] > 1)
                    {
                        return [0, 1]
                    }
                }
                for(let i=0; i<x_neg; i++)
                {
                    if(document.grid.grid[x - i][y] == 1) break;
                    if(document.grid.grid[x - i][y] > 1)
                    {
                        return [-1, 0]
                    }
                }
                for(let i=0; i<x_pos; i++)
                {
                    if(document.grid.grid[x + i][y] == 1) break;
                    if(document.grid.grid[x + i][y] > 1)
                    {
                        return [1, 0]
                    }
                }
            }
        }
        else // going in x dir
        if(this.dirX > 0)
        {
            for(let i=0; i<x_pos; i++)
            {
                if(document.grid.grid[x + i][y] == 1) break;
                if(document.grid.grid[x + i][y] > 1)
                {
                    return [1, 0]
                }
            }
            for(let i=0; i<x_neg; i++)
            {
                if(document.grid.grid[x - i][y] == 1) break;
                if(document.grid.grid[x - i][y] > 1)
                {
                    return [-1, 0]
                }
            }
            for(let i=0; i<y_pos; i++)
            {
                if(document.grid.grid[x][y + i] == 1) break;
                if(document.grid.grid[x][y + i] > 1)
                {
                    return [0, 1]
                }
            }
            for(let i=0; i<y_neg; i++)
            {
                if(document.grid.grid[x][y - i] == 1) break;
                if(document.grid.grid[x][y - i] > 1)
                {
                    return [0, -1]
                }
            }
        }
        else
        {
            for(let i=0; i<x_neg; i++)
            {
                if(document.grid.grid[x - i][y] == 1) break;
                if(document.grid.grid[x - i][y] > 1)
                {
                    return [-1, 0]
                }
            }
            for(let i=0; i<x_pos; i++)
            {
                if(document.grid.grid[x + i][y] == 1) break;
                if(document.grid.grid[x + i][y] > 1)
                {
                    return [1, 0]
                }
            }
            for(let i=0; i<y_neg; i++)
            {
                if(document.grid.grid[x][y - i] == 1) break;
                if(document.grid.grid[x][y - i] > 1)
                {
                    return [0, -1]
                }
            }
            for(let i=0; i<y_pos; i++)
            {
                if(document.grid.grid[x][y + i] == 1) break;
                if(document.grid.grid[x][y + i] > 1)
                {
                    return [0, 1]
                }
            }
        }
        return -1
    }

    move = () =>
    {
        if(!this.debounce)
        {
            let x_pos = Math.floor((this.ai_mesh.position.x + this.width/2)/this.grid_size);
            let y_pos = Math.floor((this.ai_mesh.position.y + this.height/2)/this.grid_size);

            let heading = this.seek_player(x_pos, y_pos)
            
            if(heading != -1)
            {
                this.dirX = heading[0];
                this.dirY = heading[1];
            }

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
            /*
            new TWEEN.Tween(this.light.position).to({
                x: this.ai_mesh.position.x,
                y: this.ai_mesh.position.y},this.tween_duration).start();
            */
        }
    }
}
