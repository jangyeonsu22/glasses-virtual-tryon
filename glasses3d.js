// glasses3d.js - 정면/측면 안경 이미지로 3D 모델 생성 및 사용자 조작 포함

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

let textureLoader = new THREE.TextureLoader();
let plane;
textureLoader.load('glasses.png', function (texture) {
  const geometry = new THREE.PlaneGeometry(3, 1);
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  plane.position.z = -5;
  scene.add(plane);
  animate();
});

// 컨트롤러로 회전, 크기, 위치 조정
let mouseDown = false;
let lastX, lastY;
let rotateX = 0, rotateY = 0;
let scale = 1;

renderer.domElement.addEventListener('mousedown', (e) => {
  mouseDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

renderer.domElement.addEventListener('mouseup', () => mouseDown = false);

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!mouseDown || !plane) return;
  let dx = e.clientX - lastX;
  let dy = e.clientY - lastY;
  rotateY += dx * 0.01;
  rotateX += dy * 0.01;
  lastX = e.clientX;
  lastY = e.clientY;
});

document.addEventListener('wheel', (e) => {
  if (!plane) return;
  scale += e.deltaY * -0.001;
  scale = Math.max(0.1, Math.min(5, scale));
});

function animate() {
  requestAnimationFrame(animate);
  if (plane) {
    plane.rotation.x = rotateX;
    plane.rotation.y = rotateY;
    plane.scale.set(scale, scale, scale);
  }
  renderer.render(scene, camera);
}
