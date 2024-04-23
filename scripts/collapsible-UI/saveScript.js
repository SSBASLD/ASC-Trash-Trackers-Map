let saveIcon = document.getElementById("Save Icon");

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

        markersData.push(markerData);
    }

    return markersData;
}
