import './style.css'
import {createSheet} from './builder.ts';
import {TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_} from './drums-patterns/top-patterns.ts';
import {
    createSnarePattern,
    SNARE_PATTERN_24_BACKBEAT,
    SNARE_PATTERN_24_GHOST_CHAFFEE_1,
    SNARE_PATTERN_24_GHOST_CHAFFEE_2,
} from './drums-patterns/snare-patterns.ts';
import {
    KICK_PATTERN_24_I____I____,
    KICK_PATTERN_24_I____I_K__,
    KICK_PATTERN_24_IK___I____,
    KICK_PATTERN_24_IK_K_I____,
} from './drums-patterns/kick-patterns.ts';

const renderPlease = (elementId: string, xmlScore: string) => {
    // @ts-ignore
    var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(elementId, {
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
        });
};

const embedElementId = 'osmdCanvas';

(async () => {

    const xmlScore = await createSheet({
        topPattern: TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_,
        snarePattern: createSnarePattern({
            a24: {
                snare: SNARE_PATTERN_24_BACKBEAT,
                ghost: SNARE_PATTERN_24_GHOST_CHAFFEE_2,
            },
            b24: {
                snare: SNARE_PATTERN_24_BACKBEAT,
                ghost: SNARE_PATTERN_24_GHOST_CHAFFEE_1,
            },
        }),
        kickPattern: KICK_PATTERN_24_IK___I____ + KICK_PATTERN_24_I____I____
            + KICK_PATTERN_24_IK_K_I____ + KICK_PATTERN_24_I____I_K__,
    });

    // Render
    renderPlease(embedElementId, xmlScore);

})().then();
