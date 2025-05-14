document.addEventListener("DOMContentLoaded", function (e) {
    let currentYear = document.getElementById("current-year");
    currentYear.textContent = new Date().getFullYear();
    
    let colours = ["black", "white", "grey", "red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    // let colours = {
    //     "black": "#000000",
    //     "white": "#FFFFFF",
    //     "grey": "",
    //     "red": "#FF0000",
    //     "orange": "",
    //     "yellow": "",
    //     "green": "#008000",
    //     "blue": "#00FFFF",
    //     "indigo": "",
    //     "violet": ""
    // };
    let currentColour;
    let previousColour;

    let dataColour;

    if (localStorage.getItem("dataColour")) {
        currentColour = localStorage.getItem("dataColour");
    }

    // 4x4 - 48x48
    let currentSideLength = 16;
    // A multidimensional array of colours
    let dataCanvas = [];

    if (localStorage.getItem("dataCanvas")) {
        dataCanvas = JSON.parse(localStorage.getItem("dataCanvas"));
        createCanvasFromData(dataCanvas);
        console.log(dataCanvas);
    } else {
        createCanvas(currentSideLength);
    }

    createPicker(colours);

    let canDraw = false;

    document.addEventListener("mousedown", enableDrawing);
    document.addEventListener("mouseup", disableDrawing);

    let popup = document.getElementById("popup");
    let sizeButton = document.getElementById("editor-button-size");
    let downloadButton = document.getElementById("editor-button-download");
    let clearButton = document.getElementById("editor-button-clear");

    sizeButton.addEventListener("click", showEditorPopup);
    downloadButton.addEventListener("click", downloadCanvas);
    clearButton.addEventListener("click", clearCanvas);

    let form = document.getElementById("popup-form");
    form.addEventListener("submit", changeEditorSize);

    function changeColour(e) {
        let colour = e.target.classList[1].slice(
            e.target.classList[1].lastIndexOf("-") + 1
        );
        
        currentColour = colour;
        localStorage.setItem("dataColour", currentColour);
        
        if (previousColour != null) previousColour.classList.remove("picker-colour-selected");

        e.target.classList.add("picker-colour-selected");

        previousColour = e.target;
    }

    function changeEditorSize(e) {
        // Cancel if editor is already the same size...

        e.preventDefault();

        const formData = new FormData(form);

        destroyCanvas();

        for (const [key, sideLength] of formData) {
            currentSideLength = sideLength;
        }
        
        createCanvas(currentSideLength);
        hideEditorPopup();
    }

    function clearCanvas(e) {
        destroyCanvas();
        createCanvas(currentSideLength);
    }
    
    function createCanvas(sideLength) {
        let canvas = document.getElementById("canvas");

        for (let i = 0; i < sideLength; i++) {
            let canvasRow = document.createElement("section");
            canvasRow.classList.add("canvas-row");

            dataCanvas.push([]);

            for (let j = 0; j < sideLength; j++) {
                let pixel = document.createElement("article");
                pixel.classList.add("pixel");
                pixel.addEventListener("mouseover", fillPixel);
                pixel.addEventListener("mouseenter", highlightPixel);
                pixel.addEventListener("mouseleave", highlightPixel);

                canvasRow.appendChild(pixel);

                dataCanvas.at(i).push("white")
            }

            canvas.appendChild(canvasRow);
        }

        localStorage.setItem("dataCanvas", JSON.stringify(dataCanvas));
    }

    function createCanvasFromData(data) {
        let canvas = document.getElementById("canvas");

        for (let i = 0; i < data.length; i++) {
            let canvasRow = document.createElement("section");
            canvasRow.classList.add("canvas-row");
            
            for (let j = 0; j < data.length; j++) {
                let pixel = document.createElement("article");
                pixel.classList.add("pixel", "pixel-" + dataCanvas.at(i).at(j));
                pixel.addEventListener("mouseover", fillPixel);
                pixel.addEventListener("mouseenter", highlightPixel);
                pixel.addEventListener("mouseleave", highlightPixel);

                canvasRow.appendChild(pixel);
            }

            canvas.appendChild(canvasRow);
        }
    }

    function createPicker(colours) {
        let picker = document.getElementById("picker");

        for (let i = 0; i < colours.length; i++) {
            let pickerColour = document.createElement("article");
            pickerColour.classList.add("picker-colour", "pixel-" + colours[i]);
            pickerColour.addEventListener("click", changeColour);

            if (colours[i] == currentColour) {
                
                const event = new Event("click");
                pickerColour.dispatchEvent(event);
            }

            picker.appendChild(pickerColour);
        }
    }
    
    function destroyCanvas() {
        let canvas = document.getElementById("canvas");
        
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
            dataCanvas.pop();
        }

        localStorage.setItem("dataCanvas", JSON.stringify(dataCanvas));
    }

    function disableDrawing(e) {
        e.preventDefault();
        
        canDraw = false;
    }

    function downloadCanvas(e) {

    }

    function enableDrawing(e) {
        // Do not remove ability to press mouse on other input elements
        if (e.target.classList.contains("editor-button") || e.target.parentElement == form) return;

        e.preventDefault();
        
        canDraw = true;

        // Make sure to fill pixel event was triggered on
        if (e.target.classList.contains("pixel")) {
            fillPixel(e);
        }
    }

    function fillPixel(e) {
        e.preventDefault();

        if (canDraw) {
            let classList = e.target.classList;

            while (classList.length > 0) classList.remove(classList.item(0));

            classList.add("pixel", "pixel-" + currentColour, "pixel-highlighted");

            let canvas = document.getElementById("canvas");

            for (let i = 0; i < canvas.children.length; i++) {
                for (let j = 0; j < canvas.children[i].children.length; j++) {
                    if (e.target.isEqualNode(canvas.children[i].children[j])) {
                        dataCanvas[i][j] = currentColour;
                    }
                }
            }

            localStorage.setItem("dataCanvas", JSON.stringify(dataCanvas));
        }
    }

    function highlightPixel(e) {
        if (e.type == "mouseenter") {
            e.target.classList.add("pixel-highlighted");
        } else {
            e.target.classList.remove("pixel-highlighted");
        }
    }

    function hideEditorPopup() {
        popup.classList.add("popup-hidden");
    }

    function showEditorPopup() {
        popup.classList.remove("popup-hidden");
    }
});
