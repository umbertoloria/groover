export const renderNewScoreInApp = async (xmlScore: string) => {
    const appBox = document.querySelector('#app')!;

    // Next Index
    const prefix = 'renderBox' as const;
    let nextIndex = 1;
    for (const childNode of appBox.childNodes) {
        // @ts-ignore
        const id: string = childNode.id;
        if (id.startsWith(prefix)) {
            const curIndex = parseInt(id.substring(prefix.length))
            if (nextIndex <= curIndex) {
                nextIndex = curIndex + 1;
            }
        }
    }

    // New HTMLElement
    const newRenderBox = document.createElement("div");
    newRenderBox.id = `${prefix}${nextIndex}`;
    appBox.appendChild(newRenderBox);

    // Render there
    await renderInBox(newRenderBox.id, xmlScore);

};

const renderInBox = (elementId: string, xmlScore: string) => {
    return new Promise((resolve, reject) => {

        // @ts-ignore
        var osmd = new opensheetmusicdisplay
            .OpenSheetMusicDisplay(elementId, {
                // set options here
                backend: 'svg',
                drawFromMeasureNumber: 1,
                drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER // draw all measures, up to the end of the sample
            });
        osmd
            .load(xmlScore)
            .then(function () {
                // @ts-ignore
                window.osmd = osmd; // give access to osmd object in Browser console, e.g. for osmd.setOptions()
                //console.log("e.target.result: " + e.target.result);
                osmd.render();
                // osmd.cursor.show(); // this would show the cursor on the first note
                // osmd.cursor.next(); // advance the cursor one note

                resolve('ok');
            })
            .catch(reject);

    });

}
