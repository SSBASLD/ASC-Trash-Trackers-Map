let markers = [];

class Marker {
    constructor(pos, ogWidth, ogHeight) {
        this.x = pos.x;
        this.y = pos.y;

        this.ogWidth = ogWidth;
        this.ogHeight = ogHeight;

        this.active = false;
        this.collapsibleActive = false;

        this.markerParent = document.createElement("div");
        this.markerParent.className = "marker-parent";

        this.marker = new Image();
        this.marker.className = "marker";
        this.markerParent.appendChild(this.marker);

        this.collapsibleButton = new Image();
        this.collapsibleButton.className = "marker-collapsible";
        this.markerParent.appendChild(this.collapsibleButton);
        this.collapsibleButton.style.display = "none";

        this.contentParent = document.createElement("div");
        this.contentParent.className = "marker-content-parent";
        this.markerParent.appendChild(this.contentParent);
        this.contentParent.style.display = "none";

        this.content = document.createElement("textarea");
        this.content.className = "marker-content";
        this.contentParent.appendChild(this.content);

        document.getElementById("body").appendChild(this.markerParent);

        this.marker.addEventListener(onMobile ? "touchstart" : "click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.active = !this.active; 
            if (this.active) {
                this.activate();
            } else {
                this.deactivate();
            }
        });

        this.collapsibleButton.addEventListener(onMobile ? "touchstart" : "click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            globalThis.collapsibleActive = !this.collapsibleActive;
            this.collapsibleButton.classList.toggle("marker-collapsible-active");
        
            if (this.content.style.top == "-5%" || !this.content.style.top) {
                this.content.style.top = "0%";
                this.contentParent.style.maxHeight = "500%";
            } else if (this.content.style.top == "0%") {
                this.contentParent.style.maxHeight = 0;
                this.content.style.top = "-5%";
            }
        });

        this.content.addEventListener(onMobile ? "touchstart" : "click", (e) => {
            e.stopPropagation();
        })

        this.content.oninput = (e) => {
            this.text = this.content.value;
        };
    }

    activate() {
        console.log("activated");

        this.marker.classList.add("marker-active");        
        for (const marker of markers) {
            if (marker == this) {
                continue;
            }

            marker.deactivate();
        }

        this.collapsibleButton.style.display = "block";
        this.contentParent.style.display = "block";
        this.content.style.display = "block";

        trashcan.classList.add("trashcan-clickable");
        trashcanActive = true;
    }

    deactivate() {
        this.active = false;
        this.marker.classList.remove("marker-active");

        this.collapsibleButton.style.display = "none";
        this.contentParent.style.display = "none;"
        this.content.style.display = "none";

        this.collapsibleActive = false;
        this.collapsibleButton.classList.remove("marker-collapsible-active");

        this.contentParent.style.maxHeight = 0;
        this.content.style.top = "-5%";

        trashcan.classList.remove("trashcan-clickable");
        trashcanActive = false;
    }

    move(pos) {
        this.markerParent.style.top = pos.y + "px";
        this.markerParent.style.left = pos.x + "px";
    }
}

let currentMarkerData = JSON.parse(localStorage.getItem("currentMarkerData"));
for (const marker of currentMarkerData) {
    let markerObject = new Marker({x: marker.x, y: marker.y}, marker.ogWidth, marker.ogHeight);
    markers.push(markerObject);

    renderMarkers(pos);
}


var markerButton = document.getElementById("Marker Button");

let floatingMarker;
let active = false;
markerButton.addEventListener(onMobile ? "touchstart" : "mousedown", (e) => {
    markerButton.classList.toggle("marker-button-active");
    active = !active;

    if (active == true) {
        pickUpMarker(e);
    } else {
        discardMarker();
    }
});

function markerFollowMouse(e) {
    floatingMarker.style.left = e.clientX + "px";
    floatingMarker.style.top = e.clientY + "px";
}

document.addEventListener(onMobile ? "touchstart" : "click", (e) => {
    for (const marker of markers) {
        marker.deactivate();
    }
});

function pickUpMarker(e) {
    floatingMarker = new Image();
    floatingMarker.id = "Floating Marker";
    floatingMarker.className = "marker";
    floatingMarker.style.height = "5%";

    if (!onMobile) {
        floatingMarker.style.top = e.clientY + "px";
        floatingMarker.style.left = e.clientX + "px";
    } else {
        floatingMarker.style.top = "-1000%";
        floatingMarker.style.left = "-1000%";
    }

    document.getElementById("body").appendChild(floatingMarker);
    if (!onMobile) document.addEventListener("mousemove", markerFollowMouse);
    result.addEventListener(onMobile ? "touchstart" : "click", placeMarker);
    removeDraggingListeners();
}

function placeMarker(e) {
    let mousePos = {x: onMobile ? e.touches[0].clientX : e.clientX, y: onMobile ? e.touches[0].clientY : e.clientY};

    let distanceFromCenter = {x: window.innerWidth/2 - mousePos.x, y: window.innerHeight/2 - mousePos.y};
    let markerPos = {x: pos.x - (1/cx * distanceFromCenter.x), y: pos.y - (1/cy * distanceFromCenter.y)};

    let marker = new Marker(markerPos);

    markers.push(marker);

    renderMarkers(pos);

    active = false;
    markerButton.classList.toggle("marker-button-active");
    discardMarker();
}

function discardMarker() {
    addDraggingListeners();
    if (!onMobile) document.removeEventListener("mousemove", markerFollowMouse);
    result.removeEventListener(onMobile ? "touchstart" : "click", placeMarker);
    floatingMarker.remove();
}

function renderMarkers(lensPos) {
    let leftBoundary = lensPos.x - lens.offsetWidth/2;
    let rightBoundary = lensPos.x + lens.offsetWidth/2;
    let topBoundary = lensPos.y - lens.offsetHeight/2;
    let bottomBoundary = lensPos.y + lens.offsetHeight/2;

    for (const marker of markers) {
        if (leftBoundary < marker.x && marker.x < rightBoundary && topBoundary < marker.y && marker.y < bottomBoundary) {
            marker.markerParent.style.display = "block";
            let actualX = marker.x * img.offsetWidth / marker.ogWidth;
            let actualY = marker.x * img.offsetHeight / marker.ogHeight;

            let distanceFromCenter = {x: lensPos.x - actualX, y: lensPos.y - actualY};
            let realPos = {x: window.innerWidth/2 - (cx * distanceFromCenter.x), y: window.innerHeight/2 - (cy * distanceFromCenter.y)};

            marker.move(realPos);
        } else {
            marker.markerParent.style.display = "none";
        }
    }
}