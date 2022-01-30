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


// Objects



function addSphere(scene) {
  let geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
  let material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0});
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0.8, 3, -4.0);
  sphere.name = 'my-sphere';
  sphere.castShadow = true;
  //sphere.receiveShadow = true;

  scene.add( sphere );
}
addSphere(scene);
/*
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
        root.traverse(function(root) {
            if(root.isMesh){
                root.castShadow = true;
                root.receiveShadow = true;
            }
        })

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

lamp.castShadow = true
lamp.shadow.bias = -0.0004

scene.add(lamp)

const lampFolder = gui.addFolder('Lamp')

lampFolder.add(lamp.position,'y').min(-5).max(5).step(0.01)
lampFolder.add(lamp.position,'x').min(-5).max(5).step(0.01)
lampFolder.add(lamp.position,'z').min(-5).max(5).step(0.01)

const pointLightHelper = new THREE.PointLightHelper(lamp, .1)
//scene.add(pointLightHelper)

const mainLight = new THREE.PointLight(0xffffff, 0.3)
mainLight.position.x = 0
mainLight.position.y = 7
mainLight.position.z = 0

mainLight.castShadow = true
mainLight.shadow.bias = -0.0004

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */

// setting initial values for required parameters
let acceleration = 1;
let bounce_distance = 0.5;
let bottom_position_y = 3;
let time_step = 0.03;
// time_counter is calculated to be the time the ball just reached the top position
// this is simply calculated with the s = (1/2)gt*t formula, which is the case when ball is dropped from the top position
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;
let sphere = scene.getObjectByName("my-sphere");
// Animate the scene
const animate = () => {
    requestAnimationFrame( animate );
    // reset time_counter back to the start of the bouncing sequence when sphere hits through the bottom position
    if (sphere.position.y < bottom_position_y) {
        time_counter = 0;
    }
    // calculate sphere position with the s2 = s1 + ut + (1/2)gt*t formula
    // this formula assumes the ball to be bouncing off from the bottom position when time_counter is zero
    sphere.position.y = bottom_position_y + initial_speed * time_counter - 0.5 * acceleration * time_counter * time_counter;
    // advance time
    time_counter += time_step;
    renderer.render( scene, camera );
};

animate();



var audio = new Audio('You\'ve Got a Friend in Me.mp3');


window.addEventListener('load', () =>
{
    if (typeof audio.loop == 'boolean')
    {
        audio.loop = true;
    }
    else
    {
        audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }

    audio.play();
})
const clock = new THREE.Clock()


const tick = () =>
{


    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    //renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()