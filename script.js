const pieces = document.querySelectorAll(".vignette-piece");
const container = document.getElementById("vignette-container");

let currentPiece = null;
let offsetX = 0;
let offsetY = 0;
let isResizing = false;

pieces.forEach((piece) => {
  // Gestion du drag
  piece.addEventListener("mousedown", (e) => {
    // Vérifier si on clique sur la poignée de redimensionnement
    const rect = piece.getBoundingClientRect();
    const isResizeHandle = 
      e.clientX > rect.right - 20 && 
      e.clientY > rect.bottom - 20;
    
    if (!isResizeHandle) {
      startDrag(e);
    } else {
      isResizing = true;
    }
  });

  // Gestion du resize
  piece.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      updateBackgroundPosition(piece);
      checkOverlap();
    }
  });

  piece.addEventListener("mousemove", (e) => {
    if (isResizing) {
      updateBackgroundPosition(piece);
      checkOverlap();
    }
  });

  updateBackgroundPosition(piece);
});

function startDrag(e) {
  if (isResizing) return;
  currentPiece = e.target;
  offsetX = e.clientX - currentPiece.offsetLeft;
  offsetY = e.clientY - currentPiece.offsetTop;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!currentPiece || isResizing) return;

  currentPiece.style.left = e.clientX - offsetX + "px";
  currentPiece.style.top = e.clientY - offsetY + "px";

  updateBackgroundPosition(currentPiece);
  checkOverlap();
}

function stopDrag() {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  currentPiece = null;
}

function updateBackgroundPosition(piece) {
  const bodyRect = document.body.getBoundingClientRect();
  const pieceRect = piece.getBoundingClientRect();

  const offsetX = pieceRect.left - bodyRect.left;
  const offsetY = pieceRect.top - bodyRect.top;

  piece.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
}

function checkOverlap() {
  // Supprimer toutes les zones de chevauchement existantes
  document.querySelectorAll('.overlap-area').forEach(area => area.remove());

  pieces.forEach((piece1) => {
    let rect1 = piece1.getBoundingClientRect();

    pieces.forEach((piece2) => {
      if (piece1 === piece2) return;

      let rect2 = piece2.getBoundingClientRect();

      if (isOverlapping(rect1, rect2)) {
        const overlapRect = getOverlapRect(rect1, rect2);
        createOverlapArea(overlapRect);
      }
    });
  });
}

function getOverlapRect(r1, r2) {
  return {
    left: Math.max(r1.left, r2.left),
    right: Math.min(r1.right, r2.right),
    top: Math.max(r1.top, r2.top),
    bottom: Math.min(r1.bottom, r2.bottom)
  };
}

function createOverlapArea(overlapRect) {
  const overlapArea = document.createElement('div');
  overlapArea.className = 'overlap-area';
  
  // Positionner la zone de chevauchement
  overlapArea.style.left = overlapRect.left + 'px';
  overlapArea.style.top = overlapRect.top + 'px';
  overlapArea.style.width = (overlapRect.right - overlapRect.left) + 'px';
  overlapArea.style.height = (overlapRect.bottom - overlapRect.top) + 'px';
  
  // Ajuster la position du fond
  const bodyRect = document.body.getBoundingClientRect();
  const offsetX = overlapRect.left - bodyRect.left;
  const offsetY = overlapRect.top - bodyRect.top;
  overlapArea.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
  
  container.appendChild(overlapArea);
}

function isOverlapping(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}