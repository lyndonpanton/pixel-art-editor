document.addEventListener("DOMContentLoaded", function (e) {
    console.log("DOM content has loaded");

    createEditor(16);
    
    function createEditor(sideLength) {
        let editor = document.getElementById("editor");

        for (let i = 0; i < sideLength; i++) {
            let editorRow = document.createElement("section");
            editorRow.classList.add("editor-row");

            for (let j = 0; j < sideLength; j++) {
                let pixel = document.createElement("article");
                pixel.classList.add("pixel");

                editorRow.appendChild(pixel);
            }

            editor.append(editorRow);
        }
    }
});
