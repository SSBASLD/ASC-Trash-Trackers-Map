if (onMobile) {
    let s = document.createElement("style");
    document.head.appendChild(s);

    s.textContent += `
    .collapsible-parent{
        width: 80%;
        height: 20%;
    }
    
    .collapsible {
        font-size: 6vw;
    }
    
    .slider::-webkit-slider-thumb {
        width: 1vw;
        height: 3vw;
    }

    .marker-parent {
        width: 7%;
        height: 7%;
    }
    `;
}