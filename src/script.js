import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

/* DebugUI: lil-gui */
const gui = new GUI({
  width: 300,
  title: "Debug UI",
  closeFolders: false,
});
// gui.close(); // Close the entire GUI by default
// gui.hide();

// EventListener to toggle DebugUI with the 'h' key
window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});

/* Object that can be used to hold the properties of the cube for DebugUI */
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = "#9f2ab7";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Different Types of Tweaks
/* 
Range —for numbers with minimum and maximum value
Color —for colors with various formats
Text —for simple texts
Checkbox —for booleans (true or false)
Select —for a choice from a list of values
Button —to trigger functions 
*/

const cubeTweaks = gui.addFolder("Cube Tweaks"); // Folder to group cube related tweaks
cubeTweaks.close(); // Close the folder by default

cubeTweaks
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("Cube Y Position"); // Range Tweak
cubeTweaks.add(mesh, "visible").name("Cube Visible"); // Checkbox Tweak
cubeTweaks.add(material, "wireframe").name("Cube Wireframe"); // Checkbox Tweak
cubeTweaks
  .addColor(debugObject, "color")
  .name("Cube Color")
  .onChange((value) => {
    material.color.set(debugObject.color);
  }); // Color Tweak

debugObject.spin = () => {
  gsap.to(mesh.rotation, {
    duration: 1,
    y: mesh.rotation.y + Math.PI * 2,
  });
}; // Rotation Function for Button Tweak
cubeTweaks.add(debugObject, "spin").name("Spin the Cube"); // Button Tweak

debugObject.subDivision = 2;
cubeTweaks
  .add(debugObject, "subDivision")
  .min(1)
  .max(20)
  .step(1)
  .name("Wireframe Divisions")
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subDivision,
      debugObject.subDivision,
      debugObject.subDivision
    ); // Geometry Function to delete old geometry and set new geometry with updated subdivisions
  }); // Range Tweak

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
