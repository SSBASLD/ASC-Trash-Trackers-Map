let currentZoom = 8;

var result = document.getElementById("myresult");
var img = document.getElementById("myimage1");

var lens;
lens = document.createElement("DIV");
lens.setAttribute("class", "img-zoom-lens");

console.log(window.innerHeight);
console.log(window.innerWidth);

lens.style.height = `${window.innerHeight / currentZoom}px`;
lens.style.width = `${window.innerWidth / currentZoom}px`;

let lensHeight = window.innerHeight;
let lensWidth = window.innerWidth;

var pos = {x: lensWidth / currentZoom / 2, y: lensHeight / currentZoom / 2};
var drag = false;
var ogPos = {x: 0, y: 0};
var lensOgPos = {x: 0, y: 0};

lens.style.left = pos.x + "px";
lens.style.top = pos.y + "px";

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

var slider = document.getElementById("Zoom Slider");
slider.oninput = function() {
    let currentZoom = this.value;

    let zoomedWidth = lensWidth / currentZoom;
    let zoomedHeight = lensHeight / currentZoom;

    if (window.innerHeight > window.innerWidth) {
        if (zoomedHeight > img.offsetHeight) {
            zoomedHeight = img.offsetHeight;
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