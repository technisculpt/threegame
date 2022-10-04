import * as THREE from 'three'
import WebGL from '../jsm/capabilities/WebGL.js'
import { OrbitControls } from '../jsm/controls/OrbitControls.js'
//import Stats from '../jsm/libs/stats.module.js'
import { GUI } from '../jsm/libs/lil-gui.module.min.js'
import { TWEEN } from '../jsm/libs/tween.module.min.js'
import Layout from './layout.js'
import Player from './player.js'
const scene = new THREE.Scene()

const grid_size = 3
const width = 80
const height = 80
let x_vel = grid_size
let y_vel = grid_size

document.grid = new Layout(scene, 0.3, width, height, grid_size);

// THREE.PerspectiveCamera(fov, aspect, nearest plane of view, furthest)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.z = 6
camera.position.y = -45
camera.position.x = -37.6
camera.rotation.x = 1.52
camera.rotation.y = 0
camera.rotation.z = 0

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(width, height, 1)
const material = new THREE.MeshBasicMaterial({color: 0x90AD96})
const background = new THREE.Mesh(geometry, material)
background.position.x -= grid_size
scene.add(background)


var light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);

new Player(scene, camera, width, height, grid_size, x_vel, y_vel, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], "player_1", 0xAD001A);

//const stats = Stats()
//document.body.appendChild(stats.dom)

/*
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
*/

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