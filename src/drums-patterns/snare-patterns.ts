export const SNARE_PATTERN_24_BACKBEAT: string = '    o   ' as const;

export const SNARE_PATTERN_24_GHOST_CHAFFEE_1: string = ' .   .  ' as const;
export const SNARE_PATTERN_24_GHOST_CHAFFEE_2: string = ' .   . .' as const;
export const SNARE_PATTERN_24_GHOST_CHAFFEE_3: string = ' ..  . .' as const;

export const createSnarePattern = (args: {
    a24: {
        snare: string;
        ghost: string;
    };
    b24: {
        snare: string;
        ghost: string;
    };
}) => {
    return mergeSnareAndGhostsTogether(args.a24.snare, args.a24.ghost)
        + mergeSnareAndGhostsTogether(args.b24.snare, args.b24.ghost);
}

export const mergeSnareAndGhostsTogether = (snare: string, ghosts: string) => {
    let result = '';
    let i = 0;
    let j = 0;
    while (i < snare.length) {
        const sn = snare[i];
        const gh = ghosts[i];
        let finalCh = sn;
        if (finalCh === ' ') {
            finalCh = gh;
        }
        result += finalCh;
        ++i;
        ++j;
    }
    return result;
}
