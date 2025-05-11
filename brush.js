// brush.js - 브러시 도구로 안경 이미지 부분 지우기 기능
let isDrawing = false;
let brushCanvas = document.createElement('canvas');
let brushCtx = brushCanvas.getContext('2d');

brushCanvas.width = canvas.width;
brushCanvas.height = canvas.height;
canvas.parentNode.insertBefore(brushCanvas, canvas.nextSibling);
brushCanvas.style.position = 'absolute';
brushCanvas.style.left = canvas.offsetLeft + 'px';
brushCanvas.style.top = canvas.offsetTop + 'px';
brushCanvas.style.zIndex = 10;

brushCanvas.addEventListener('mousedown', () => isDrawing = true);
brushCanvas.addEventListener('mouseup', () => isDrawing = false);
brushCanvas.addEventListener('mouseleave', () => isDrawing = false);
brushCanvas.addEventListener('mousemove', drawBrush);

function drawBrush(e) {
  if (!isDrawing) return;
  const rect = brushCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  brushCtx.beginPath();
  brushCtx.arc(x, y, 20, 0, Math.PI * 2);
  brushCtx.fillStyle = 'black';
  brushCtx.fill();

  // glasses 영역에 반영
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(brushCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}
