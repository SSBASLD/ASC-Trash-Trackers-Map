document.addEventListener("click", (event) => {
    return;

    let img = new Image();
    img.src = "./images/marker.png";
    document.getElementById("body").appendChild(img);

    console.log("a");
    img.className = "marker";
    img.style.left = event.x + "px";
    img.style.top = event.y + "px";
});

let currentZoom = 5;

var result = document.getElementById("myresult");

var img = document.getElementById("myimage1");

var lens;
lens = document.createElement("DIV");
lens.setAttribute("class", "img-zoom-lens");
lens.style.height = `${img.offsetHeight / currentZoom}px`;
lens.style.width = `${img.offsetHeight / currentZoom * 2}px`;
lens.style.left = lens.offsetWidth/2 + "px";
lens.style.top = lens.offsetHeight/2 + "px";

var pos = {x: lens.offsetWidth/2, y: lens.offsetHeight/2};
var drag = false;
var ogPos = {x: 0, y: 0};
var lensOgPos = {x: 0, y: 0};

document.addEventListener("keypress", (e) => {
    if (e.key == "s") {
        console.log(pos);

        if (currentZoom == 1) return;

        currentZoom--;
        lens.style.height = `${img.offsetHeight / currentZoom}px`;
        lens.style.width = `${img.offsetHeight / currentZoom * (window.innerWidth/window.innerHeight)}px`;
        imageZoom(adjust = true);
    } else if (e.key == "w") {
        console.log(pos);

        if (currentZoom == 5) return;

        currentZoom++;
        lens.style.height = `${img.offsetHeight / currentZoom}px`;
        lens.style.width = `${img.offsetHeight / currentZoom * (window.innerWidth/window.innerHeight)}px`;
        imageZoom(adjust = true);
    }
});


var cx, cy;
function imageZoom(adjust) {
    if (pos.x > img.width - lens.offsetWidth/2) {
        pos.x = img.width - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > img.height - lens.offsetHeight/2) {
        pos.y = img.height - lens.offsetHeight/2;
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
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    result.style.backgroundPosition = "-" + ((pos.x - lens.offsetWidth/2) * cx) + "px -" + ((pos.y - lens.offsetHeight/2) * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
}

document.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        drag = true;
        ogPos.x = e.clientX;
        ogPos.y = e.clientY;
        lensOgPos = pos;
    }
});
document.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        drag = false;
    }
});
document.addEventListener("mousemove", (e) => {
    if (drag) {
        moveLens(e);
    }
});

function moveLens(e) {
    var x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */

    let distanceFromOg = {x: ogPos.x - e.clientX, y: ogPos.y - e.clientY};
    pos = {x: lensOgPos.x + (1/cx * distanceFromOg.x), y: lensOgPos.y + (1/cy * distanceFromOg.y)};

    /* Prevent the lens from being positioned outside the image: */
    if (pos.x > img.width - lens.offsetWidth/2) {
        pos.x = img.width - lens.offsetWidth/2;
    }
    if (pos.x < lens.offsetWidth/2) {
        pos.x = lens.offsetWidth/2;
    }
    if (pos.y > img.height - lens.offsetHeight/2) {
        pos.y = img.height - lens.offsetHeight/2;
    }
    if (pos.y < lens.offsetHeight/2) {
        pos.y = lens.offsetHeight/2;
    }
    /* Set the position of the lens: */
    lens.style.left = pos.x + "px";
    lens.style.top = pos.y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + ((pos.x - lens.offsetWidth/2) * cx) + "px -" + ((pos.y - lens.offsetHeight/2) * cy) + "px";
}

imageZoom();  

  var coll = document.getElementsByClassName("collapsible");
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let parent = this.parentElement;
      if (parent.style.top == "50%"){
        parent.style.top = `0%`;
      } else {
        parent.style.top = `50%`;
      }
    });
  }