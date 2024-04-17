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
/*
let img = document.getElementById("myimage");

img.addEventListener("mousemove", (e) => {
    e.target.style.setProperty('--x',(100*e.offsetX/e.target.offsetWidth)+'%');
    e.target.style.setProperty('--y',(100*e.offsetY/e.target.offsetHeight)+'%'); 
});

document.addEventListener("keypress", (e) => {
    if (e.key == "w") {
        img.style.setProperty("--zoom", 5);
    } else if (e.key == "s") {
        img.style.setProperty("--zoom", 1);
    }
})
*/

var pos = {x: 250/2, y: 125/2};
var drag = false;
var ogPos = {x: 0, y: 0};
var lensOgPos = {x: 0, y: 0};

function imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /* Create lens: */
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /* Insert lens: */
    img.parentElement.insertBefore(lens, img);
    /* Calculate the ratio between result DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;

    /* Set background properties for the result DIV */
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
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
        console.log(distanceFromOg);

        pos = {x: lensOgPos.x + (1/cx * distanceFromOg.x), y: lensOgPos.y + (1/cy * distanceFromOg.y)};

        /* Calculate the position of the lens: */
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
            pos.x = x + lens.offsetWidth/2;
        }
        if (x < 0) {
            x = 0;
            pos.x = x + lens.offsetWidth/2;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
            pos.y = y + lens.offsetHeight/2;
        }
        if (y < 0) {
            y = 0;
            pos.y = y + lens.offsetHeight/2;
        }
        /* Set the position of the lens: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /* Display what the lens "sees": */
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    }
}

  imageZoom("myimage1", "myresult");