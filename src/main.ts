import './style.css'

const renderPlease = (elementId: string, xmlScore: string) => {
    // @ts-ignore
    var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(elementId, {
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

const embedElementId = 'osmdCanvas';

document.querySelector<HTMLDivElement>('#files')!.addEventListener("change", (evt) => {
    // @ts-ignore
    const file = evt.target?.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
        const xmlScore = e.target?.result as string;
        renderPlease(embedElementId, xmlScore);
    };
    reader.readAsText(file);
}, false);
