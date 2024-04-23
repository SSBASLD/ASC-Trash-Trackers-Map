function markerDataToJSON() {
    let markersData = [];

    for (const marker of markers) {
        let markerData = {};

        markerData.x = marker.x;
        markerData.y = marker.y;

        markerData.text = marker.text ? marker.text : "";

        markersData.push(markerData);
    }
    
    return JSON.stringify(markersData);
}