import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'


const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
scene.background = new THREE.Color('black')


function addSphere(scene) {
  let geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
  const texture = new THREE.TextureLoader().load( 'nathanyaahla-yasharahla-luxo-jr-ball-uv4-5-300x.jpg' );
  const material = new THREE.MeshStandardMaterial({map:texture, roughness: 0});
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(-0.2, 3, -4.0);
  sphere.name = 'my-sphere';
  sphere.castShadow = true;

  scene.add( sphere );
}
addSphere(scene);


const loader = new GLTFLoader();
loader.load(
    'models/scene.gltf',
    function ( gltf ) {
        const root = gltf.scene;
        root.traverse(function(model) {
            console.log(model.name)
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
            if(model.name==='Luxo_BallpSphere1'){
                model.visible=false
            }

        })
        root.position.set(0,0,0);
        scene.add( root )
    },
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {

        console.log( 'An error happened' );

    }
);

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


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1.2
camera.position.y = 2.3
camera.position.z = 4.7
camera.zoom = 10
scene.add(camera)

gui.add(camera.position, 'x').min(-10).max(10).step(0.01);
gui.add(camera.position, 'y').min(-10).max(10).step(0.01);
gui.add(camera.position, 'z').min(-10).max(10).step(0.01);


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


let acceleration = 1;
let bounce_distance = 0.5;
let bottom_position_y = 3;
let time_step = 0.03;
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;
let sphere = scene.getObjectByName("my-sphere");

const animate = () => {
    requestAnimationFrame( animate );
    if (sphere.position.y < bottom_position_y) {
        time_counter = 0;
    }

    sphere.position.y = bottom_position_y + initial_speed * time_counter - 0.5 * acceleration * time_counter * time_counter;

    time_counter += time_step;
    renderer.render( scene, camera );
};

animate();


const clock = new THREE.Clock()

const tick = () =>
{


    const elapsedTime = clock.getElapsedTime()

    controls.update()


    window.requestAnimationFrame(tick)
}

tick()