import './style.css'

const renderPlease = (xmlScore: string) => {
    console.log("asdf");

    // @ts-ignore
    var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas", {
        // set options here
        backend: "svg",
        drawFromMeasureNumber: 1,
        drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER // draw all measures, up to the end of the sample
    });
    osmd
        .load(xmlScore)
        .then(
            function () {
                // @ts-ignore
                window.osmd = osmd; // give access to osmd object in Browser console, e.g. for osmd.setOptions()
                //console.log("e.target.result: " + e.target.result);
                osmd.render();
                // osmd.cursor.show(); // this would show the cursor on the first note
                // osmd.cursor.next(); // advance the cursor one note
            }
        );

};

document.querySelector<HTMLDivElement>('#files')!.addEventListener("change", (evt) => {
    // @ts-ignore
    const realFiles = evt.target?.files;
    const file = realFiles[0];

    const output = [];
    output.push("<li><strong>", escape(file.name), "</strong> </li>");
    output.push("<div id='osmdCanvas0'/>");
    document.querySelector<HTMLDivElement>('#list')!.innerHTML = "<ul>" + output.join("") + "</ul>";

    if (!file.name.match('.*\.xml') && !file.name.match('.*\.musicxml') && false) {
        alert('You selected a non-xml file. Please select only music xml files.');
        return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
        const xmlScore = e.target?.result as string;
        renderPlease(xmlScore);
    };
    if (file.name.match('.*\.mxl')) {
        // have to read as binary, otherwise JSZip will throw ("corrupted zip: missing 37 bytes" or similar)
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
}, false);
