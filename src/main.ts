import './style.css'
import {createSheet} from './builder.ts';
import {TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_, TOP_PATTERN_HH_IX_XXX_X_XXX_X_XX} from './drums-patterns/top-patterns.ts';
import {
    createSnarePattern44,
    doublePattern,
    makeGhostActualSnare,
    mergeSnareAndGhostsTogether,
    SNARE_PATTERN_24_GHOST_STD_2,
    SNARE_PATTERN_44_BACKBEAT,
    SNARE_PATTERN_44_GHOST_NONE,
    SNARE_PATTERN_44_GHOST_STD_1,
} from './drums-patterns/snare-patterns.ts';
import {
    KICK_PATTERN_24_I____I____,
    KICK_PATTERN_24_I____I__K_,
    KICK_PATTERN_24_I____I_K__,
    KICK_PATTERN_24_I____I_K_K,
    KICK_PATTERN_24_IK___I____,
    KICK_PATTERN_24_IK_K_I____,
    KICK_PATTERN_24_IK_KKI____,
} from './drums-patterns/kick-patterns.ts';
import {renderNewScoreInApp} from './render.ts';

(async () => {

    await renderNewScoreInApp(
        await createSheet({
            topPattern: TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_,
            snarePattern: createSnarePattern44({
                snare: SNARE_PATTERN_44_BACKBEAT,
                ghost: SNARE_PATTERN_44_GHOST_STD_1,
            }),
            kickPattern: KICK_PATTERN_24_IK___I____ + KICK_PATTERN_24_I____I____
                + KICK_PATTERN_24_IK_K_I____ + KICK_PATTERN_24_I____I__K_,
        }),
    );

    await renderNewScoreInApp(
        await createSheet({
            topPattern: TOP_PATTERN_HH_IX_XXX_X_XXX_X_XX,
            snarePattern: createSnarePattern44({
                snare: SNARE_PATTERN_44_BACKBEAT,
                ghost: SNARE_PATTERN_44_GHOST_NONE,
            }),
            kickPattern: KICK_PATTERN_24_IK_K_I____ + KICK_PATTERN_24_I____I____
                + KICK_PATTERN_24_IK_K_I____ + KICK_PATTERN_24_I____I_K_K,
        }),
    );

    await renderNewScoreInApp(
        await createSheet({
            topPattern: TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_, // TODO: Put ride here, alternate accents
            snarePattern: createSnarePattern44({
                snare: mergeSnareAndGhostsTogether(SNARE_PATTERN_44_BACKBEAT, makeGhostActualSnare(doublePattern(SNARE_PATTERN_24_GHOST_STD_2))),
                ghost: SNARE_PATTERN_44_GHOST_NONE,
            }),
            kickPattern: KICK_PATTERN_24_IK_K_I____ + KICK_PATTERN_24_I____I____
                + KICK_PATTERN_24_IK_KKI____ + KICK_PATTERN_24_I____I_K__,
        }),
    );

})().then();
