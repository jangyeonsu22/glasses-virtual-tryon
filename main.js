// main.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let faceImage = null;
let glassesImage = null;

// 이미지 업로드 처리
function loadImage(input, isFace) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      if (isFace) faceImage = img;
      else glassesImage = img;
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('faceInput').addEventListener('change', e => loadImage(e.target, true));
document.getElementById('glassesInput').addEventListener('change', e => loadImage(e.target, false));

// 슬라이더 연동
document.getElementById('scale').addEventListener('input', draw);
document.getElementById('rotate').addEventListener('input', draw);
document.getElementById('xOffset').addEventListener('input', draw);
document.getElementById('yOffset').addEventListener('input', draw);

function draw() {
  if (!faceImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);

  if (!glassesImage) return;
  const scale = parseFloat(document.getElementById('scale').value);
  const rotate = parseFloat(document.getElementById('rotate').value) * Math.PI / 180;
  const xOffset = parseFloat(document.getElementById('xOffset').value);
  const yOffset = parseFloat(document.getElementById('yOffset').value);

  const w = glassesImage.width * scale;
  const h = glassesImage.height * scale;
  const x = canvas.width / 2 + xOffset;
  const y = canvas.height / 2 + yOffset;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.drawImage(glassesImage, -w / 2, -h / 2, w, h);
  ctx.restore();
}
