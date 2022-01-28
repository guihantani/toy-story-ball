import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

/*
// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
 */

const loader = new GLTFLoader();
loader.load(
    // resource URL
    'models/scene.gltf',
    // called when the resource is loaded
    function ( gltf ) {
        const root = gltf.scene;
        root.position.set(0,0,0);
        scene.add( root );


    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);
// Lights

const lamp = new THREE.PointLight(0xfff8a8, 0.8)
lamp.position.x = -1.1
lamp.position.y = 3.65
lamp.position.z = -4.5
scene.add(lamp)

const lampFolder = gui.addFolder('Lamp')

lampFolder.add(lamp.position,'y').min(-5).max(5).step(0.01)
lampFolder.add(lamp.position,'x').min(-5).max(5).step(0.01)
lampFolder.add(lamp.position,'z').min(-5).max(5).step(0.01)

const pointLightHelper = new THREE.PointLightHelper(lamp, .1)
//scene.add(pointLightHelper)

const mainLight = new THREE.AmbientLight(0xffffff, 0.3)
mainLight.position.x = 0
mainLight.position.y = 7
mainLight.position.z = 0
scene.add(mainLight)

const lightFolder = gui.addFolder('Light')

lightFolder.add(mainLight.position,'y').min(-10).max(10).step(0.01)
lightFolder.add(mainLight.position,'x').min(-10).max(10).step(0.01)
lightFolder.add(mainLight.position,'z').min(-10).max(10).step(0.01)

const mainLightHelper = new THREE.PointLightHelper(mainLight, 1)
//scene.add(mainLightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1.2
camera.position.y = 2.3
camera.position.z = 4.7
camera.zoom = 10
scene.add(camera)

gui.add(camera.position, 'x').min(-10).max(10).step(0.01);
gui.add(camera.position, 'y').min(-10).max(10).step(0.01);
gui.add(camera.position, 'z').min(-10).max(10).step(0.01);

// Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()