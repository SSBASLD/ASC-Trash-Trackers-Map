let saveIcon = document.getElementById("Save Icon");
function saveIconEnable() {
    saveIcon.style.pointerEvents = "auto";
    saveIcon.style.opacity = "1";
}

function saveIconDisable() {
    saveIcon.style.pointerEvents = "none";
    saveIcon.style.opacity = "0.2";
}

saveIcon.addEventListener("mouseover", (e) => {
    saveIcon.classList.add("save-icon-hover");
});

saveIcon.addEventListener(onMobile ? "touchstart" : "mousedown", (e) => {
    e.stopPropagation();
    saveIcon.classList.add("save-icon-click");

    updateMarkers();
});

saveIcon.addEventListener("mouseleave", (e) => {
    saveIcon.classList.remove("save-icon-hover");
    saveIcon.classList.remove("save-icon-click");
}); 

saveIcon.addEventListener(onMobile ? "touchend" : "mouseup", (e) => {
    saveIcon.classList.remove("save-icon-click");
});

function markerDataToJSON() {
    let markersData = [];

    for (const marker of markers) {
        let markerData = {};

        markerData.x = marker.x;
        markerData.y = marker.y;

        markerData.text = marker.text ? marker.text : "";

        console.log(marker.text);

        markerData.ogWidth = marker.ogWidth;
        markerData.ogHeight = marker.ogHeight;

        markersData.push(markerData);
    }

    return markersData;
}
