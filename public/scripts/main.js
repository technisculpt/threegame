import * as THREE from 'three'
import WebGL from '../jsm/capabilities/WebGL.js'
import { OrbitControls } from '../jsm/controls/OrbitControls.js'
//import Stats from '../jsm/libs/stats.module.js'
import { GUI } from '../jsm/libs/lil-gui.module.min.js'
import { TWEEN } from '../jsm/libs/tween.module.min.js'
import Layout from './layout.js'
import Player from './player.js'
import Ai from './ai.js'
const scene = new THREE.Scene()

const grid_size = 3
const width = 80
const height = 80

let background_colour = 0xF7F9F9;
let light_colour1 = 0xffffbb;
let light_colour2 = 0x080820;
let box_colour = 0xD4AC0D;
let player_1_colour = 0x2874A6;
let player_2_colour = 0xA93226;
let ai_colour = 0x212F3D ;

document.grid = new Layout(scene, 0.3, width, height, grid_size, box_colour);

// THREE.PerspectiveCamera(fov, aspect, nearest plane of view, furthest)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.z = 57.6;
camera.position.y = -grid_size;
camera.position.x = -grid_size;


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

//const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(width, height, 1)
const material = new THREE.MeshBasicMaterial({color: background_colour})
const background = new THREE.Mesh(geometry, material)
background.position.x -= grid_size
background.position.y -= grid_size
background.position.z += grid_size/4
scene.add(background)


let light = new THREE.HemisphereLight( light_colour1, light_colour2, 1 );
light.position.set(-grid_size, -grid_size, 20);
scene.add(light);

new Player(scene, width, height, grid_size, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], 1, player_1_colour);
new Player(scene, width, height, grid_size, ['KeyW', 'KeyS', 'KeyA', 'KeyD'], 2, player_2_colour);
let a = new Ai(scene, width, height, grid_size, ai_colour);

//const stats = Stats()
//document.body.appendChild(stats.dom)


const gui = new GUI()
const cam_pos = gui.addFolder('Camera pos')
const cam_rot = gui.addFolder('Camera rot')
cam_pos.add(camera.position, 'x', -100, 100)
cam_pos.add(camera.position, 'y', -100, 100)
cam_pos.add(camera.position, 'z', -100, 500)
cam_pos.open()
cam_rot.add(camera.rotation, 'x', -Math.PI, Math.PI)
cam_rot.add(camera.rotation, 'y', -Math.PI, Math.PI)
cam_rot.add(camera.rotation, 'z', -Math.PI, Math.PI)
cam_rot.open()


function animate() {
    requestAnimationFrame(animate)
    //controls.update()
    TWEEN.update()
    render()
    //stats.update()
}

function render() {
    renderer.render(scene, camera)
}

window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}