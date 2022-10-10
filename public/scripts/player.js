import * as THREE from 'three'
import { TWEEN } from '../jsm/libs/tween.module.min.js'

export default class Player
{
    constructor(scene, width, height, grid_size, keys, player_no, colour)
    {
        this.player_no = player_no
        this.debounce = false;
        this.tween_duration1 = 10;
        this.tween_duration2 = 100;
        this.tween_duration3 = 500;
        this.debounce_ms = 20;
        this.keys = keys;
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        this.grid_spaces = Math.floor(width/grid_size);
        const geometry = new THREE.CylinderGeometry(this.grid_size/2, this.grid_size/2, this.grid_size, 20);
        const material = new THREE.MeshBasicMaterial({color: colour})
        this.player_mesh = new THREE.Mesh(geometry, material)
        this.player_mesh.position.x = grid_size - width/2
        this.player_mesh.position.y = grid_size - height/2
        this.player_mesh.position.z += grid_size
        this.player_mesh.rotation.x += Math.PI/2
        this.scene = scene
        this.scene.add(this.player_mesh)
        this.keys = keys;
        this.key_lookup = {};
        this.key_lookup[keys[0]] = [0,1];
        this.key_lookup[keys[1]] = [0,-1];
        this.key_lookup[keys[2]] = [-1,0];
        this.key_lookup[keys[3]] = [1,0];
        document.addEventListener('keydown', this.logKey);
    }

    set_debounce = () =>
    {
        this.debounce = false;
    }

    logKey = (e) =>
    {
        if(!this.debounce)
        {
            let x_pos = Math.floor((this.player_mesh.position.x + this.width/2)/this.grid_size);
            let y_pos = Math.floor((this.player_mesh.position.y + this.height/2)/this.grid_size);

            if (!this.keys.includes(e.code)) return;

            let delta_x = this.key_lookup[e.code][0];
            let delta_y = this.key_lookup[e.code][1];
            
            if ((x_pos + delta_x >= this.grid_spaces) || (x_pos + delta_x < 0) || // player bounds check
            (y_pos + delta_y >= this.grid_spaces) || (y_pos + delta_y < 0)) return;
            

            if (!document.grid.grid[x_pos + delta_x][y_pos + delta_y]) // no block in the way of player
            {
                this.debounce = true;
                setTimeout(this.set_debounce, this.tween_duration1 + this.debounce_ms);
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration1).start();
            }
            
            else if ((x_pos + 2 * delta_x >= this.grid_spaces) || (x_pos + 2 * delta_x < 0) || // box bounds check
            (y_pos + 2 * delta_y >= this.grid_spaces) || (y_pos + 2 * delta_y < 0)) return;
            
            else if(!document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y]) // block in the way of player but no block behind it
            {
                this.debounce = true;
                setTimeout(this.set_debounce, this.tween_duration2 + this.debounce_ms);
                document.grid.grid[x_pos + delta_x][y_pos + delta_y] = 0;
                document.grid.grid[x_pos + 2 * delta_x][y_pos + 2 * delta_y] = 1;
                let selected_box = this.scene.getObjectByName(String(x_pos + delta_x) + ',' + String(y_pos + delta_y));
                selected_box.name = String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y);
                new TWEEN.Tween(selected_box.position).to({
                    x: selected_box.position.x + delta_x * this.grid_size,
                    y: selected_box.position.y + delta_y * this.grid_size},this.tween_duration2).start();
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration2).start();
            }

            else if ((x_pos + 3 * delta_x >= this.grid_spaces) || (x_pos + 3 * delta_x < 0) || // box2 bounds check
            (y_pos + 3 * delta_y >= this.grid_spaces) || (y_pos + 3 * delta_y < 0)) return;

            else if (!document.grid.grid[x_pos + 3 * delta_x][y_pos + 3 * delta_y]) // 2 blocks in the way but no block behind it 
            {
                this.debounce = true;
                setTimeout(this.set_debounce, this.tween_duration3 + this.debounce_ms);
                document.grid.grid[x_pos + delta_x][y_pos + delta_y] = 0;
                document.grid.grid[x_pos + 3 * delta_x][y_pos + 3 * delta_y] = 1;
                let selected_box1 = this.scene.getObjectByName(String(x_pos + delta_x) + ',' + String(y_pos + delta_y));
                let selected_box2 = this.scene.getObjectByName(String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y));
                selected_box1.name = String(x_pos + 2 * delta_x) + ',' + String(y_pos + 2 * delta_y);
                selected_box2.name = String(x_pos + 3 * delta_x) + ',' + String(y_pos + 3 * delta_y);
                new TWEEN.Tween(selected_box2.position).to({
                    x: selected_box2.position.x + delta_x * this.grid_size,
                    y: selected_box2.position.y + delta_y * this.grid_size},this.tween_duration3).start();
                new TWEEN.Tween(selected_box1.position).to({
                    x: selected_box1.position.x + delta_x * this.grid_size,
                    y: selected_box1.position.y + delta_y * this.grid_size},this.tween_duration3).start();
                new TWEEN.Tween(this.player_mesh.position).to({
                    x: this.player_mesh.position.x + delta_x * this.grid_size,
                    y: this.player_mesh.position.y + delta_y * this.grid_size},this.tween_duration3).start();
            }
        }
    }
}
