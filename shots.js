const video = document.getElementById("video");
const searchBtn = document.getElementById("searchBtn");
const drinkBtn = document.getElementById("drinkBtn");
const overlayText = document.getElementById("overlayText");

/* ---- START CAMERA ---- */
navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } }
}).then(stream => {
    video.srcObject = stream;

    // Mirror only if front camera
    try {
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.facingMode && settings.facingMode.includes("environment")) {
            video.style.transform = "none";
        } else {
            video.style.transform = "scaleX(-1)";
        }
    } catch {
        video.style.transform = "scaleX(-1)";
    }

}).catch(err => {
    console.log("Back camera unavailable, using default.", err);
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream);
});

/* ---- TEXT BUTTONS ---- */
searchBtn.addEventListener("click", () => {
    overlayText.innerText = "Who’s going to get drunk tonight?";
    overlayText.classList.remove("found");
    overlayText.classList.add("searching");
});

drinkBtn.addEventListener("click", () => {
    overlayText.innerText = "YOU!";
    overlayText.classList.remove("searching");
    overlayText.classList.add("found");
});

/* ---- PINCH TO ZOOM (Kiss Cam style) ---- */

let currentScale = 1;
let startDistance = 0;

function getDistance(touches) {
  const [t1, t2] = touches;
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

video.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    startDistance = getDistance(e.touches);
  }
});

video.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getDistance(e.touches);
    const scaleChange = newDistance / startDistance;

    let newScale = currentScale * scaleChange;

    if (newScale < 1) newScale = 1;
    if (newScale > 3) newScale = 3;

    video.style.transform = `scale(${newScale})`;
  }
});

video.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    const match = video.style.transform.match(/scale\(([^)]+)\)/);
    if (match) currentScale = parseFloat(match[1]);
  }
});