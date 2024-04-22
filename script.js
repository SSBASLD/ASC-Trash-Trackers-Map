let currentZoom = 3;

var result = document.getElementById("myresult");
var img = document.getElementById("myimage1");

var lens;
lens = document.createElement("DIV");
lens.setAttribute("class", "img-zoom-lens");
lens.style.height = `${img.offsetHeight / currentZoom}px`;
lens.style.width = `${img.offsetHeight / currentZoom * 2}px`;

var pos = {x: lens.offsetWidth/2, y: lens.offsetHeight/2};
var drag = false;
var ogPos = {x: 0, y: 0};
var lensOgPos = {x: 0, y: 0};

lens.style.left = img.offsetHeight / currentZoom + "px";
lens.style.top = img.offsetHeight / currentZoom * 2 + "px";

var cx, cy;
function imageZoom(adjust) {
    if (pos.x > img.offsetWidth - lens.offsetWidth/2) {
        pos.x = img.offsetWidth - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > img.offsetHeight - lens.offsetHeight/2) {
        pos.y = img.offsetHeight - lens.offsetHeight/2;
    }
    if (pos.y < lens.offsetHeight/2) {
        pos.y = lens.offsetHeight/2;
    }
    /* Set the position of the lens: */
    lens.style.left = pos.x + "px";
    lens.style.top = pos.y + "px";
    img.parentElement.insertBefore(lens, img);
    /* Calculate the ratio between result DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;

    /* Set background properties for the result DIV */
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.offsetWidth * cx) + "px " + (img.offsetHeight * cy) + "px";
    result.style.backgroundPosition = "-" + ((pos.x - lens.offsetWidth/2) * cx) + "px -" + ((pos.y - lens.offsetHeight/2) * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
}

function mouseDownDragListener(e) {
    e.preventDefault();
    
    if (e.button == 0) {
        drag = true;
        ogPos.x = e.clientX;
        ogPos.y = e.clientY;
        lensOgPos = pos;
    }
}

function mouseUpDragListener(e) {
    e.preventDefault();
    
    if (e.button == 0) {
        drag = false;
    }
}

function mouseMoveDragListener(e) {
    e.preventDefault();
    
    if (drag) {
        moveLens({x: e.clientX, y: e.clientY});
    }
}

function touchStartDragListener(e) {
    e.preventDefault();

    drag = true;
    ogPos.x = e.touches[0].clientX;
    ogPos.y = e.touches[0].clientY;
    lensOgPos = pos;
}

function touchEndDragListener(e) {
    e.preventDefault();
    drag = false;
}

function touchMoveDragListener(e) {
    e.preventDefault();

    if (drag) {
        moveLens({x: e.touches[0].clientX, y: e.touches[0].clientY});
    }
}

function addDraggingListeners() {
    result.addEventListener("touchstart", touchStartDragListener);
    result.addEventListener("touchmove", touchMoveDragListener);
    result.addEventListener("touchend", touchEndDragListener);

    result.addEventListener("mousedown", mouseDownDragListener);
    result.addEventListener("mouseup", mouseUpDragListener);
    result.addEventListener("mousemove", mouseMoveDragListener);
}

function removeDraggingListeners() {
    result.removeEventListener("touchstart", touchStartDragListener);
    result.removeEventListener("touchmove", touchMoveDragListener);
    result.removeEventListener("touchend", touchEndDragListener);


    result.removeEventListener("mousedown", mouseDownDragListener);
    result.removeEventListener("mouseup", mouseUpDragListener);
    result.removeEventListener("mousemove", mouseMoveDragListener);
}

function moveLens(mousePos) {
    /* Prevent any other actions that may occur when moving over the image */
    /* Get the cursor's x and y positions: */

    let distanceFromOg = {x: ogPos.x - mousePos.x, y: ogPos.y - mousePos.y};
    pos = {x: lensOgPos.x + (1/cx * distanceFromOg.x), y: lensOgPos.y + (1/cy * distanceFromOg.y)};

    /* Prevent the lens from being positioned outside the image: */
    if (pos.x > img.offsetWidth - lens.offsetWidth/2) {
        pos.x = img.offsetWidth - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > img.offsetHeight - lens.offsetHeight/2) {
        pos.y = img.offsetHeight - lens.offsetHeight/2;
    }
    if (pos.y < lens.offsetHeight/2) {
        pos.y = lens.offsetHeight/2;
    }
    /* Set the position of the lens: */
    lens.style.left = pos.x + "px";
    lens.style.top = pos.y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + ((pos.x - lens.offsetWidth/2) * cx) + "px -" + ((pos.y - lens.offsetHeight/2) * cy) + "px";
    renderMarkers(pos);
}

imageZoom();  
addDraggingListeners();

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function(e) {
        e.preventDefault();

      this.classList.toggle("active");
      let parent = this.parentElement;
      if (parent.style.top == "50%"){
        parent.style.top = `${50-0.8*0.5*100}%`;
      } else {
        parent.style.top = `50%`;
      }
    });
}

var slider = document.getElementById("Zoom Slider");
slider.oninput = function() {
    let currentZoom = this.value;

    lens.style.height = `${img.offsetHeight / currentZoom}px`;
    lens.style.width = `${img.offsetHeight / currentZoom * (window.innerWidth/window.innerHeight)}px`;
    imageZoom(adjust = true);
    renderMarkers(pos);
}

var markerButton = document.getElementById("Marker Button");

let floatingMarker;
let active = false;
markerButton.addEventListener("mousedown", (e) => {
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

function placeMarker(e) {
    console.log("placed");

    let distanceFromCenter = {x: window.innerWidth/2 - e.clientX, y: window.innerHeight/2 - e.clientY};
    let markerPos = {x: pos.x - (1/cx * distanceFromCenter.x), y: pos.y - (1/cy * distanceFromCenter.y)};

    let marker = new Marker(markerPos);

    markers.push(marker);

    renderMarkers(pos);

    active = false;
    markerButton.classList.toggle("marker-button-active");
    discardMarker();
}

let markers = [];

let trashcan = document.getElementById("Trashcan");
let trashcanActive = false;

trashcan.addEventListener("mouseover", (e) => {
    if (trashcanActive) {
        trashcan.classList.add("trashcan-hover");
    }
});

trashcan.addEventListener("mousedown", (e) => {
    e.stopPropagation();

    if (trashcanActive) {
        trashcan.classList.add("trashcan-click");

        let currentMarker = markers.find((marker) => marker.active);
        currentMarker.deactivate();

        currentMarker.markerParent.remove();
        markers.splice(markers.indexOf(currentMarker), 1);
    }
});

trashcan.addEventListener("mouseleave", (e) => {
    trashcan.classList.remove("trashcan-hover");
    trashcan.classList.remove("trashcan-click");
});

trashcan.addEventListener("mouseup", (e) => {
    trashcan.classList.remove("trashcan-hover");
    trashcan.classList.remove("trashcan-click");
});


class Marker {
    constructor(pos) {
        this.x = pos.x;
        this.y = pos.y;
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

        this.marker.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.active = !this.active; 
            if (this.active) {
                this.activate();
            } else {
                this.deactivate();
            }
        });

        this.collapsibleButton.addEventListener("click", (e) => {
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

        this.content.addEventListener("click", (e) => {
            e.stopPropagation();
        })
    }

    activate() {
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

document.addEventListener("click", (e) => {
    for (const marker of markers) {
        marker.deactivate();
    }
});

function pickUpMarker(e) {
    console.log("picked up");

    floatingMarker = new Image();
    floatingMarker.id = "Floating Marker";
    floatingMarker.className = "marker";
    floatingMarker.style.height = "5%";

    floatingMarker.style.top = e.clientY + "px";
    floatingMarker.style.left = e.clientX + "px";

    document.getElementById("body").appendChild(floatingMarker);
    document.addEventListener("mousemove", markerFollowMouse);
    result.addEventListener("click", placeMarker);
    removeDraggingListeners();
}

function discardMarker() {
    addDraggingListeners();
    document.removeEventListener("mousemove", markerFollowMouse);
    result.removeEventListener("click", placeMarker);
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
            let distanceFromCenter = {x: lensPos.x - marker.x, y: lensPos.y - marker.y};
            let realPos = {x: window.innerWidth/2 - (cx * distanceFromCenter.x), y: window.innerHeight/2 - (cy * distanceFromCenter.y)};

            marker.move(realPos);
        } else {
            marker.markerParent.style.display = "none";
        }
    }
}