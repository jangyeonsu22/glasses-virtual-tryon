const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let faceImage = null;
let glassesImage = null;

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults((results) => {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const centerX = (leftEye.x + rightEye.x) / 2 * canvas.width;
    const centerY = (leftEye.y + rightEye.y) / 2 * canvas.height;
    const eyeDist = Math.hypot((leftEye.x - rightEye.x), (leftEye.y - rightEye.y));
    const scale = eyeDist * 5;
    if (window.autoAlignToFace) {
      window.autoAlignToFace((centerX - 400) / 100, -(centerY - 300) / 100, scale);
    }
  }
});

function removeWhiteBackground(image, callback) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = image.width;
  tempCanvas.height = image.height;
  tempCtx.drawImage(image, 0, 0);
  const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];
    if (r > 240 && g > 240 && b > 240) {
      imgData.data[i + 3] = 0;
    }
  }
  tempCtx.putImageData(imgData, 0, 0);
  const output = new Image();
  output.onload = () => callback(output);
  output.src = tempCanvas.toDataURL();
}

function loadImage(input, isFace) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      if (isFace) {
        faceImage = img;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = canvas.width;
        imageCanvas.height = canvas.height;
        const imageCtx = imageCanvas.getContext('2d');
        imageCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        faceMesh.send({ image: imageCanvas });
      } else {
        removeWhiteBackground(img, (outputImg) => {
          glassesImage = outputImg;
          draw();
        });
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('faceInputBox').addEventListener('change', e => loadImage(e.target, true));
document.getElementById('glassesInputBox').addEventListener('change', e => loadImage(e.target, false));

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
