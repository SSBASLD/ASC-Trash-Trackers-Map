let trashcan = document.getElementById("Trashcan");
let trashcanActive = false;

trashcan.addEventListener("mouseover", (e) => {
    if (trashcanActive) {
        trashcan.classList.add("trashcan-hover");
    }
});

trashcan.addEventListener(onMobile ? "touchstart" : "mousedown", (e) => {
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

trashcan.addEventListener(onMobile ? "touchend" : "mouseup", (e) => {
    trashcan.classList.remove("trashcan-hover");
    trashcan.classList.remove("trashcan-click");
});
