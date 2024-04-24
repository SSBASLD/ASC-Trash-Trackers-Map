function setUpPreviews(data) {
    let firstMap = data[7];


    let mapPreview = document.getElementById("Map Preview");
    let cx = window.innerWidth/2 / mapPreview.offsetWidth;
    let cy = window.innerWidth/4 / mapPreview.offsetHeight;

    let markers = firstMap.markerData;
    for (const marker of markers) {
        let markerImage = new Image();
        markerImage.className = "marker-preview";

        markerImage.style.top = `${marker.y * 1/cy}px`;
        markerImage.style.left = `${marker.x * 1/cx}px`;

        document.getElementById("Container").appendChild(markerImage);
    }
}