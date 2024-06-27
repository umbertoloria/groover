function handleFileSelect(evt) {
    var maxOSMDDisplays = 10; // how many scores can be displayed at once (in a vertical layout)
    var realFiles = evt.target.files; // FileList object
    var file = realFiles[0];
    var osmdDisplays = 1;

    var output = [];
    output.push("<li><strong>", escape(file.name), "</strong> </li>");
    output.push("<div id='osmdCanvas0'/>");
    document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";

    if (!file.name.match('.*\.xml') && !file.name.match('.*\.musicxml') && false) {
        alert('You selected a non-xml file. Please select only music xml files.');
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas", {
            // set options here
            backend: "svg",
            drawFromMeasureNumber: 1,
            drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER // draw all measures, up to the end of the sample
        });
        osmd
            .load(e.target.result)
            .then(
                function() {
                    window.osmd = osmd; // give access to osmd object in Browser console, e.g. for osmd.setOptions()
                    //console.log("e.target.result: " + e.target.result);
                    osmd.render();
                    // osmd.cursor.show(); // this would show the cursor on the first note
                    // osmd.cursor.next(); // advance the cursor one note
                }
            );
    };
    if (file.name.match('.*\.mxl')) {
        // have to read as binary, otherwise JSZip will throw ("corrupted zip: missing 37 bytes" or similar)
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
  }

document.getElementById("files").addEventListener("change", handleFileSelect, false);
