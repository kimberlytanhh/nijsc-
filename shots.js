const video = document.getElementById("video");
const searchBtn = document.getElementById("searchBtn");
const drinkBtn = document.getElementById("drinkBtn");
const overlayText = document.getElementById("overlayText");
const cameraWrap = document.querySelector(".camera-wrap");

// --- CAMERA SETUP ---
navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } }
}).then(stream => {
    video.srcObject = stream;

    // Detect if it's back or front cam
    try {
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.facingMode && settings.facingMode.includes("environment")) {
            video.style.transform = "none";   // no mirror
        } else {
            video.style.transform = "scaleX(-1)"; // mirror for selfie cam
        }
    } catch (err) {
        video.style.transform = "scaleX(-1)";
    }

}).catch(err => {
    console.log("Back camera not available, using default.", err);
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.style.transform = "scaleX(-1)";
        });
});

// --- TEXT CONTROLS ---
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

// --- PINCH TO ZOOM (Kiss Cam style) ---

let currentScale = 1;
let startDistance = 0;

function getDistance(touches) {
    const [t1, t2] = touches;
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

cameraWrap.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        startDistance = getDistance(e.touches);
    }
});

cameraWrap.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const newDistance = getDistance(e.touches);
        const scaleAmount = newDistance / startDistance;

        let newScale = currentScale * scaleAmount;

        // limits
        if (newScale < 1) newScale = 1;
        if (newScale > 3) newScale = 3;

        cameraWrap.style.transform = `scale(${newScale})`;
    }
});

cameraWrap.addEventListener("touchend", (e) => {
    // When user lifts a finger, store current scale
    if (e.touches.length < 2) {
        const style = cameraWrap.style.transform;
        const match = style.match(/scale\(([^)]+)\)/);
        if (match) currentScale = parseFloat(match[1]);
    }
});