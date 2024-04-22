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

    lens.style.height = `${img.offsetHeight / currentZoom}px`;
    lens.style.width = `${img.offsetHeight / currentZoom * (window.innerWidth/window.innerHeight)}px`;
    imageZoom(adjust = true);
    renderMarkers(pos);
}