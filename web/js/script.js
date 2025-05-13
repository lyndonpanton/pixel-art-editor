document.addEventListener("DOMContentLoaded", function (e) {
    console.log("DOM content has loaded");
    
    let colours = ["black", "white", "grey", "red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    let currentColour;
    let previousColour;

    // 4x4 - 64x64
    createEditor(4);
    createPicker(colours);

    let canDraw = false;

    document.addEventListener("mousedown", enableDrawing);
    document.addEventListener("mouseup", disableDrawing);

    let form = document.getElementById("")

    function changeColour(e) {
        let colour = e.target.classList[1].slice(
            e.target.classList[1].lastIndexOf("-") + 1
        );
        
        currentColour = colour;
        console.log(currentColour);
        
        if (previousColour != null) previousColour.classList.remove("picker-colour-selected");

        e.target.classList.add("picker-colour-selected");

        previousColour = e.target;
    }
    
    function createEditor(sideLength) {
        let editor = document.getElementById("editor");

        for (let i = 0; i < sideLength; i++) {
            let editorRow = document.createElement("section");
            editorRow.classList.add("editor-row");

            for (let j = 0; j < sideLength; j++) {
                let pixel = document.createElement("article");
                pixel.classList.add("pixel");
                pixel.addEventListener("mouseover", fillPixel);

                editorRow.appendChild(pixel);
            }

            editor.append(editorRow);
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

            classList.add("pixel", "pixel-" + currentColour);
        }
    }
});
