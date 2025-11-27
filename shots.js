const video = document.getElementById("video");
const searchBtn = document.getElementById("searchBtn");
const drinkBtn = document.getElementById("drinkBtn");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
});

// Create overlay text
const text = document.createElement("div");
text.className = "shots-text";
document.body.appendChild(text);

// SEARCH BUTTON
searchBtn.addEventListener("click", () => {
    text.innerText = "Who’s going to get drunk tonight?";
    text.classList.remove("found");
    text.classList.add("searching");
});

// DRINK BUTTON
drinkBtn.addEventListener("click", () => {
    text.innerText = "YOU!";
    text.classList.remove("searching");
    text.classList.add("found");
});
