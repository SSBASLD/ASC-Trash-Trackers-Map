let currentZoom = 8;

var result = document.getElementById("myresult");
var img = document.getElementById("myimage1");

var lens;
lens = document.createElement("DIV");
lens.setAttribute("class", "img-zoom-lens");
img.parentElement.insertBefore(lens, img);

let imgWidth;
let imgHeight;
while (imgWidth == 0 && imgHeight == 0) {
    imgHeight = img.offsetHeight;
    imgWidth = img.offsetWidth;

    console.log(imgWidth);
    console.log(imgHeight);
}

console.log("set");

console.log(imgWidth);
console.log(imgHeight);

let lensHeight = window.innerHeight;
let lensWidth = window.innerWidth;

lens.style.height = `${lensHeight / currentZoom}px`;
lens.style.width = `${lensWidth / currentZoom}px`;

var pos = {x: lensWidth / currentZoom / 2, y: lensHeight / currentZoom / 2};
var drag = false;
var ogPos = {x: 0, y: 0};
var lensOgPos = {x: 0, y: 0};

lens.style.left = pos.x + "px";
lens.style.top = pos.y + "px";

var cx, cy;
function imageZoom() {
    if (pos.x > imgWidth - lens.offsetWidth/2) {
        pos.x = imgWidth - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > imgHeight - lens.offsetHeight/2) {
        pos.y = imgHeight - lens.offsetHeight/2;
    }
    if (pos.y < lens.offsetHeight/2) {
        pos.y = lens.offsetHeight/2;
    }

    /* Set the position of the lens: */
    lens.style.left = pos.x + "px";
    lens.style.top = pos.y + "px";
    /* Calculate the ratio between result DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;

    /* Set background properties for the result DIV */
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (imgWidth * cx) + "px " + (imgHeight * cy) + "px";
    result.style.backgroundPosition = "-" + ((pos.x - lens.offsetWidth/2) * cx) + "px -" + ((pos.y - lens.offsetHeight/2) * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
}

function moveLens(mousePos) {
    /* Prevent any other actions that may occur when moving over the image */
    /* Get the cursor's x and y positions: */

    let distanceFromOg = {x: ogPos.x - mousePos.x, y: ogPos.y - mousePos.y};
    pos = {x: lensOgPos.x + (1/cx * distanceFromOg.x), y: lensOgPos.y + (1/cy * distanceFromOg.y)};

    /* Prevent the lens from being positioned outside the image: */
    if (pos.x > imgWidth - lens.offsetWidth/2) {
        pos.x = imgWidth - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > imgHeight - lens.offsetHeight/2) {
        pos.y = imgHeight - lens.offsetHeight/2;
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

var slider = document.getElementById("Zoom Slider");
slider.oninput = function() {
    let currentZoom = this.value;

    let zoomedWidth = lensWidth / currentZoom;
    let zoomedHeight = lensHeight / currentZoom;

    if (window.innerHeight > window.innerWidth) {
        if (zoomedHeight > imgHeight) {
            zoomedHeight = imgHeight;
            zoomedWidth = zoomedHeight * window.innerWidth/window.innerHeight;
        } 
    } else if (window.innerWidth > window.innerHeight) {
        if (zoomedWidth > img.offsetWidth) {
            zoomedWidth = img.offsetWidth;
            zoomedHeight = zoomedWidth * window.innerHeight/window.innerWidth;
        } 
    }   

    console.log(zoomedHeight);

    lens.style.height = `${zoomedHeight}px`;
    lens.style.width = `${zoomedWidth}px`;

    imageZoom(adjust = true);
    renderMarkers(pos);
}