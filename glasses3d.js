// glasses3d.js - 고도화된 3D 안경 모델 생성 및 자동 얼굴 맞춤 렌더링

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 2);
scene.add(ambient);

let textureLoader = new THREE.TextureLoader();
let plane;

// PNG 파일 불러오기 및 배경 제거 처리 (알파 채널 유지)
textureLoader.load('glasses.png', function (texture) {
  const geometry = new THREE.PlaneGeometry(3, 1);
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  plane.position.z = -5;
  scene.add(plane);
  animate();
});

// MediaPipe를 이용한 얼굴 랜드마크 기반 위치 조정 (예시용 위치값)
function autoAlignToFace(x, y, scaleFactor = 1) {
  if (plane) {
    plane.position.x = x;
    plane.position.y = y;
    plane.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }
}

// 사용자 마우스 조작 (XYZ 회전 + 이동)
let mouseDown = false;
let lastX, lastY;
let rotateX = 0, rotateY = 0;
let scale = 1;
let offsetX = 0, offsetY = 0;

renderer.domElement.addEventListener('mousedown', (e) => {
  mouseDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

renderer.domElement.addEventListener('mouseup', () => mouseDown = false);

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!mouseDown || !plane) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  if (e.shiftKey) {
    offsetX += dx * 0.01;
    offsetY -= dy * 0.01;
  } else {
    rotateY += dx * 0.01;
    rotateX += dy * 0.01;
  }
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
    plane.position.x = offsetX;
    plane.position.y = offsetY;
  }
  renderer.render(scene, camera);
}
