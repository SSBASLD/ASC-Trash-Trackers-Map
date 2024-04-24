const numberInRow = 4;

let currentPos = {x: 1, y: 0};
class Preview {
    constructor(pos, markerData) {
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

        this.container = document.createElement("div");
        this.container.className = "container";
        this.containerParent.appendChild(this.container);

        this.preview = new Image();
        this.preview.className = "map-preview";
        this.container.appendChild(this.preview);

        this.renderMarkers(markerData);
        this.containerButton.addEventListener();
    }

    renderMarkers(markerData) {
        let cx = window.innerWidth/2 / this.preview.offsetWidth;
        let cy = window.innerWidth/4 / this.preview.offsetHeight;
    
        let markers = markerData;
        for (const marker of markers) {
            let markerImage = new Image();
            markerImage.className = "marker-preview";
    
            markerImage.style.top = `${marker.y * 1/cy}px`;
            markerImage.style.left = `${marker.x * 1/cx}px`;

            this.container.appendChild(markerImage);
        }
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
        previews.push(new Preview(currentPos, map.markerData));
        Preview.setNextPos();
    }
}