document.addEventListener("DOMContentLoaded", function (e) {
    console.log("DOM content has loaded");

    
    let colours = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    let currentColour = "red";
    let previousColour;

    createEditor(16);
    createPicker(colours);

    let canDraw = false;

    document.addEventListener("mousedown", enableDrawing);
    document.addEventListener("mouseup", disableDrawing);

    function changeColour(e) {
        let colour = e.target.classList[1].slice(
            e.target.classList[1].lastIndexOf("-") + 1
        );
        
        currentColour = colour;
        
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
            console.log(colour + ": " + colours[colour]);
            let pickerColour = document.createElement("article");
            pickerColour.classList.add("picker-colour", "pixel-" + colours[colour]);
            pickerColour.addEventListener("click", changeColour);

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
