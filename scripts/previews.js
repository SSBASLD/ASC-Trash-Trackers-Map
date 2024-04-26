let trashcanButton = document.getElementById("Delete Map Button");
let plusButton = document.getElementById("Add Map Button");

var numberInRow = 4;
if (onMobile) numberInRow = 2;

let currentPos = {x: 1, y: 0}
class Preview {
    constructor(id, pos, markerData, dateCreated, dateLastModified) {
        this.id = id;
        this.active = 0;
        this.markerData = markerData;

        this.x = pos.x;
        this.y = pos.y

        this.containerParent = document.createElement("div");
        this.containerParent.className = "container-parent";
        document.getElementById("body").appendChild(this.containerParent);

        this.containerParent.style.setProperty("--numberInRow", numberInRow);

        this.containerParent.style.left = pos.x + "vw";
        this.containerParent.style.setProperty("--layer", currentPos.y);

        this.containerButton = document.createElement("button");
        this.containerButton.className = "container-button";
        this.containerParent.appendChild(this.containerButton);

        this.containerButton.innerHTML = dateCreated;

        this.containerButtonText = document.createElement("div");
        this.containerButtonText.className = "container-button-text";
        this.containerButton.appendChild(this.containerButtonText);

        this.containerButtonText.innerHTML = `Last Accessed: ${dateLastModified}`

        this.container = document.createElement("div");
        this.container.className = "container";
        this.containerParent.appendChild(this.container);

        this.preview = new Image();
        this.preview.className = "map-preview";
        this.container.appendChild(this.preview);

        this.renderMarkers(markerData);
        this.containerButton.addEventListener(onMobile ? "touchstart" : "click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.active++;

            console.log(this.active);

            if (this.active == 1) {
                this.activate();
            } else if (this.active == 2) {
                goToMapPage(this.id, this.markerData);
            }
        });
    }

    renderMarkers(markerData) {
        let markers = markerData;
        for (const marker of markers) {
            let cx = marker.ogWidth / this.preview.offsetWidth;
            let cy = marker.ogHeight / this.preview.offsetHeight;

            let markerImage = new Image();
            markerImage.className = "marker-preview";

            markerImage.style.top = `${marker.y * 1/cy}px`;
            markerImage.style.left = `${marker.x * 1/cx}px`;

            this.container.appendChild(markerImage);
        }
    }

    activate() {
        for (const preview of previews) {
            if (preview == this) continue;

            preview.deactivate();
        }

        trashcanButton.classList.remove("circle-deactivated");
        trashcanButton.classList.add("circle");

        trashcanButton.addEventListener(onMobile ? "touchstart" : "click", deletePreview);

        this.containerParent.classList.add("container-parent-active");
    }

    deactivate() {
        trashcanButton.classList.remove("circle");
        trashcanButton.classList.add("circle-deactivated");

        trashcanButton.removeEventListener(onMobile ? "touchstart" : "click", deletePreview);

        this.active = 0;
        this.containerParent.classList.remove("container-parent-active");
    }

    static setNextPos() {
        if (currentPos.x == ((100 - 2 - (numberInRow - 1))/numberInRow + 1) * (numberInRow - 1) + 1) {
            currentPos.x = 1;
            currentPos.y++;
        } else currentPos.x += (100 - 2 - (numberInRow - 1))/numberInRow + 1;
    }
}

let previews = [];
function setUpPreviews(data) {
    for (const map of data) {
        previews.push(new Preview(map._id, currentPos, map.markerData, map.dateCreated, map.dateLastModified));
        Preview.setNextPos();
    }
}

document.addEventListener(onMobile ? "touchstart" : "click", (e) => {
    for (const preview of previews) {
        preview.deactivate();
    }
});

function deletePreview(e) {
    let activePreview = previews.find(preview => preview.active);

    activePreview.containerParent.remove();
    previews.splice(previews.indexOf(activePreview), 1);

    deleteMap(activePreview.id);
}

plusButton.addEventListener(onMobile ? "touchstart" : "click", (e) => {
    let date = new Date();
    addMap(`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`);
});

async function goToMapPage(id, markerData) {
    await localStorage.setItem("currentId", id);
    await localStorage.setItem("currentMarkerData", JSON.stringify(markerData));
    window.location.href += "/map-page/index.html";
}

function clearPreviews() {
    for (const preview of previews) {
        preview.containerParent.remove();
    }

    previews = [];
    currentPos = {x: 1, y: 0};
}