function mouseDownDragListener(e) {
    e.preventDefault();
    
    if (e.button == 0) {
        drag = true;
        ogPos.x = e.clientX;
        ogPos.y = e.clientY;
        lensOgPos = pos;
    }
}

function mouseUpDragListener(e) {
    e.preventDefault();
    
    if (e.button == 0) {
        drag = false;
    }
}

function mouseMoveDragListener(e) {
    e.preventDefault();
    
    if (drag) {
        moveLens({x: e.clientX, y: e.clientY});
    }
}

function touchStartDragListener(e) {
    e.preventDefault();

    drag = true;
    ogPos.x = e.touches[0].clientX;
    ogPos.y = e.touches[0].clientY;
    lensOgPos = pos;
}

function touchEndDragListener(e) {
    e.preventDefault();
    drag = false;
}

function touchMoveDragListener(e) {
    e.preventDefault();

    if (drag) {
        moveLens({x: e.touches[0].clientX, y: e.touches[0].clientY});
    }
}

function addDraggingListeners() {
    result.addEventListener("touchstart", touchStartDragListener);
    result.addEventListener("touchmove", touchMoveDragListener);
    result.addEventListener("touchend", touchEndDragListener);

    result.addEventListener("mousedown", mouseDownDragListener);
    result.addEventListener("mouseup", mouseUpDragListener);
    result.addEventListener("mousemove", mouseMoveDragListener);
}

function removeDraggingListeners() {
    result.removeEventListener("touchstart", touchStartDragListener);
    result.removeEventListener("touchmove", touchMoveDragListener);
    result.removeEventListener("touchend", touchEndDragListener);


    result.removeEventListener("mousedown", mouseDownDragListener);
    result.removeEventListener("mouseup", mouseUpDragListener);
    result.removeEventListener("mousemove", mouseMoveDragListener);
}

addDraggingListeners();