document.addEventListener("DOMContentLoaded", function (e) {
    let currentYear = document.getElementById("current-year");
    currentYear.textContent = new Date().getFullYear();
    
    let colours = ["black", "white", "grey", "red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    let currentColour;
    let previousColour;

    // 4x4 - 64x64
    createCanvas(16);
    createPicker(colours);

    let canDraw = false;

    document.addEventListener("mousedown", enableDrawing);
    document.addEventListener("mouseup", disableDrawing);

    let popup = document.getElementById("popup");
    let sizeButton = document.getElementById("editor-button-size");
    let saveButton = document.getElementById("editor-button-save");
    let clearButton = document.getElementById("editor-button-clear");

    sizeButton.addEventListener("click", showEditorPopup);

    let form = document.getElementById("popup-form");
    form.addEventListener("submit", changeEditorSize);

    function changeColour(e) {
        let colour = e.target.classList[1].slice(
            e.target.classList[1].lastIndexOf("-") + 1
        );
        
        currentColour = colour;
        
        if (previousColour != null) previousColour.classList.remove("picker-colour-selected");

        e.target.classList.add("picker-colour-selected");

        previousColour = e.target;
    }

    function changeEditorSize(e) {
        // Cancel if editor is already the same size...

        e.preventDefault();

        const formData = new FormData(form);

        let canvas = document.getElementById("canvas");
        
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }

        for (const [key, sideLength] of formData) {
            createCanvas(sideLength);
        }

        hideEditorPopup();
    }
    
    function createCanvas(sideLength) {
        let canvas = document.getElementById("canvas");

        for (let i = 0; i < sideLength; i++) {
            let canvasRow = document.createElement("section");
            canvasRow.classList.add("canvas-row");

            for (let j = 0; j < sideLength; j++) {
                let pixel = document.createElement("article");
                pixel.classList.add("pixel");
                pixel.addEventListener("mouseover", fillPixel);
                pixel.addEventListener("mouseenter", highlightPixel);
                pixel.addEventListener("mouseleave", highlightPixel);

                canvasRow.appendChild(pixel);
            }

            canvas.append(canvasRow);
        }
    }

    function createPicker(colours) {
        let picker = document.getElementById("picker");

        for (let colour in colours) {
            let pickerColour = document.createElement("article");
            pickerColour.classList.add("picker-colour", "pixel-" + colours[colour]);
            pickerColour.addEventListener("click", changeColour);

            // Highlight default colour
            if (colours[0] == colours[colour]) {
                const event = new Event("click");
                pickerColour.dispatchEvent(event);
            }

            picker.appendChild(pickerColour);
        }
    }

    function disableDrawing(e) {
        e.preventDefault();
        
        canDraw = false;
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
