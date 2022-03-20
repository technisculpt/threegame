import * as THREE from 'three'
import WebGL from '../jsm/capabilities/WebGL.js'
import { OrbitControls } from '../jsm/controls/OrbitControls.js'
//import Stats from '../jsm/libs/stats.module.js'
import { GUI } from '../jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()

const grid_size = 3;

// THREE.PerspectiveCamera(fov, aspect, nearest plane of view, furthest)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.y = -77
camera.position.z = 65
camera.rotation.x = 0.747

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//const controls = new OrbitControls(camera, renderer.domElement)


const geometry = new THREE.BoxGeometry(100, 100, 1)
const material = new THREE.MeshBasicMaterial({color: 0x90AD96})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const geometry2 = new THREE.BoxGeometry(grid_size, grid_size, grid_size)
const material2 = new THREE.MeshPhongMaterial({color: 0xAD90A7})
const cube2 = new THREE.Mesh(geometry2, material2)
cube2.position.x = 1
scene.add(cube2)

var light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);



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