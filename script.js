const pieces = document.querySelectorAll(".vignette-piece");

let currentPiece = null;
let offsetX = 0;
let offsetY = 0;

pieces.forEach((piece) => {
  piece.addEventListener("mousedown", startDrag);
  updateBackgroundPosition(piece);
});

function startDrag(e) {
  currentPiece = e.target;
  offsetX = e.clientX - currentPiece.offsetLeft;
  offsetY = e.clientY - currentPiece.offsetTop;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!currentPiece) return;

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
  pieces.forEach((piece) => {
    piece.classList.remove("overlapping");
  });

  pieces.forEach((piece1) => {
    let rect1 = piece1.getBoundingClientRect();

    pieces.forEach((piece2) => {
      if (piece1 === piece2) return;

      let rect2 = piece2.getBoundingClientRect();

      if (isOverlapping(rect1, rect2)) {
        piece1.classList.add("overlapping");
        piece2.classList.add("overlapping");
      }
    });
  });
}

function isOverlapping(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}