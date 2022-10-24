import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'
import {check_vacancy} from './common.js'
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

export default class Player
{
    constructor(scene, width, height, grid_size, keys, player_no, colour)
    {
        const loader = new GLTFLoader();
        loader.load( '../assets/goodguy' + player_no + '.glb', ( gltf ) =>
        {
            scene.add(gltf.scene);
            this.player_mesh = gltf.scene;
            this.mixer = new THREE.AnimationMixer(gltf.scene);
            this.clips = gltf.animations;
            this.action1 = this.mixer.clipAction(this.clips[0])
            this.action2 = this.mixer.clipAction(this.clips[1])
            this.player_no = player_no;
            this.debounce = false;
            this.tween_duration1 = 50;
            this.tween_duration2 = 100;
            this.tween_duration3 = 500;
            this.debounce_ms = 20;
            this.width = width;
            this.height = height;
            this.grid_size = grid_size;
            this.grid_spaces = Math.floor(width/grid_size);
            //const geometry = new THREE.CylinderGeometry(this.grid_size/2, this.grid_size/2, this.grid_size, 20);
            //const material = new THREE.MeshBasicMaterial({color: colour})
            let new_pos = null;
            if (player_no == 1) {new_pos = check_vacancy([0, width/2, 0, height/2], grid_size);}
            if (player_no == 2) {new_pos = check_vacancy([width/2, width, height/2, height], grid_size);}
            //this.player_mesh = new THREE.Mesh(geometry, material)
            this.player_mesh.position.x = (new_pos[0]  * grid_size) - width/2;
            this.player_mesh.position.y = (new_pos[1] * grid_size)  - height/2;
            this.player_mesh.position.z += grid_size;
            this.player_mesh.rotation.x += Math.PI/2;
            document.grid.grid[new_pos[0]][new_pos[1]] = player_no + 1;
            this.player_mesh.name = String(new_pos[0]) + ',' + String(new_pos[1]);
            this.player_mesh.object = this;
            this.scene = scene;
            this.scene.add(this.player_mesh);
            this.keys = keys;
            this.key_lookup = {};
            this.key_lookup[keys[0]] = [0,1];
            this.key_lookup[keys[1]] = [0,-1];
            this.key_lookup[keys[2]] = [-1,0];
            this.key_lookup[keys[3]] = [1,0];
            document.addEventListener('keydown', this.logKey);
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    bounce = (time) =>
    {
        this.action1.setDuration(time/1000);
        this.action2.setDuration(time/1000);
        this.action1.play();
        this.action2.play();
    }

    dont_bounce = () =>
    {
        this.action1.stop();
        this.action2.stop();
    }

    delete = (x, y) =>
    {
        document.grid.grid[x][y] = 0;
        this.scene.remove(this.player_mesh);
        this.keys = '';
        delete this;
    }

    set_debounce = () =>
    {
        this.debounce = false;
        this.dont_bounce();
    }

    logKey = (e) =>
    {
        if (!this.keys.includes(e.code)) return;

        if(!this.debounce)
        {
            let x_pos = Math.floor((this.player_mesh.position.x + this.width/2)/this.grid_size);
            let y_pos = Math.floor((this.player_mesh.position.y + this.height/2)/this.grid_size);

            let delta_x = this.key_lookup[e.code][0];
            let delta_y = this.key_lookup[e.code][1];
            
            if ((x_pos + delta_x >= this.grid_spaces) || (x_pos + delta_x < 0) || // player bounds check
            (y_pos + delta_y >= this.grid_spaces) || (y_pos + delta_y < 0)) return;

            if (document.grid.grid[x_pos + delta_x][y_pos + delta_y] > 1) return; // player infront

            if (document.grid.grid[x_pos + delta_x][y_pos + delta_y] == 'a') return; // ai infront

            if (document.grid.grid[x_pos + delta_x][y_pos + delta_y] == 'o') return; // movement taking place infront

            if (document.grid.grid[x_pos + delta_x][y_pos + delta_y] == 0) // no block in the way of player
            {
                this.bounce(this.tween_duration1);
                this.debounce = true;
                setTimeout(this.set_debounce, this.tween_duration1 + this.debounce_ms);
                document.grid.grid[x_pos][y_pos] = 0;
                document.grid.grid[x_pos + delta_x][y_pos + delta_y] = this.player_no + 1;
                this.player_mesh.name = String(x_pos + delta_x) + ',' + String(y_pos + delta_y);
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration1).start();
            }

            else if ((x_pos + 2 * delta_x >= this.grid_spaces) || (x_pos + 2 * delta_x < 0) || // box bounds check
            (y_pos + 2 * delta_y >= this.grid_spaces) || (y_pos + 2 * delta_y < 0)) return;
            
            else if(document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] == 0) // block in the way of player but no block behind it
            {
                if(document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] == 'a') return; // ai in the way

                document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] = 'o';
                document.grid.grid[x_pos][y_pos] = 0;
                document.grid.grid[x_pos + delta_x][y_pos + delta_y] = 'o';
                this.debounce = true;
                this.bounce(this.tween_duration2);
                setTimeout(this.set_debounce, this.tween_duration2 + this.debounce_ms);
                this.player_mesh.name = String(x_pos + delta_x) + ',' + String(y_pos + delta_y);
                let selected_box = this.scene.getObjectByName(String(x_pos + delta_x) + ',' + String(y_pos + delta_y));
                selected_box.name = String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y);
                new TWEEN.Tween(selected_box.position).to({
                    x: selected_box.position.x + delta_x * this.grid_size,
                    y: selected_box.position.y + delta_y * this.grid_size},this.tween_duration2).start();
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration2)
                    .onComplete(() => {
                        document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] = 1;
                        document.grid.grid[x_pos][y_pos] = 0;
                        document.grid.grid[x_pos + delta_x][y_pos + delta_y] = this.player_no + 1;
                    }).start();

            }

            else if ((x_pos + 3 * delta_x >= this.grid_spaces) || (x_pos + 3 * delta_x < 0) || // box2 bounds check
            (y_pos + 3 * delta_y >= this.grid_spaces) || (y_pos + 3 * delta_y < 0)) return;

            else if (document.grid.grid[x_pos + 3 * delta_x][y_pos + 3 * delta_y] == 0 && // 2 blocks in the way but no block behind them 
            document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] == 1 &&
            document.grid.grid[x_pos + 1 * delta_x][y_pos + 1 * delta_y] == 1)
            {
                this.player_mesh.name = String(x_pos + delta_x) + ',' + String(y_pos + delta_y);
                this.debounce = true;
                this.bounce(this.tween_duration3);
                setTimeout(this.set_debounce, this.tween_duration3 + this.debounce_ms);
                let selected_box1 = this.scene.getObjectByName(String(x_pos + delta_x) + ',' + String(y_pos + delta_y));
                let selected_box2 = this.scene.getObjectByName(String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y));
                
                
                document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] = 'o';
                document.grid.grid[x_pos + 3 * delta_x][y_pos + 3 * delta_y] = 'o';
                document.grid.grid[x_pos][y_pos] = 'o';
                document.grid.grid[x_pos + delta_x][y_pos + delta_y] = 'o';
                new TWEEN.Tween(selected_box2.position).to({
                    x: selected_box2.position.x + delta_x * this.grid_size,
                    y: selected_box2.position.y + delta_y * this.grid_size},this.tween_duration3)
                    .onComplete(() => {
                        selected_box2.name = String(x_pos + 3 * delta_x) + ',' + String(y_pos + 3 * delta_y);
                        document.grid.grid[x_pos + 3 * delta_x][y_pos + 3 * delta_y] = 1;
                    }).start();
                new TWEEN.Tween(selected_box1.position).to({
                    x: selected_box1.position.x + delta_x * this.grid_size,
                    y: selected_box1.position.y + delta_y * this.grid_size},this.tween_duration3)
                    .onComplete(() => {
                        document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] = 1;
                        selected_box1.name = String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y);
                    }).start();
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration3)
                    .onComplete(() => {
                        document.grid.grid[x_pos][y_pos] = 0;
                        document.grid.grid[x_pos + delta_x][y_pos + delta_y] = this.player_no + 1;
                    }).start();

                
            }
        }
    }
}
