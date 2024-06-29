export const SNARE_PATTERN_24_BACKBEAT: string = '    o   ' as const;
export const SNARE_PATTERN_44_BACKBEAT: string = `${SNARE_PATTERN_24_BACKBEAT}${SNARE_PATTERN_24_BACKBEAT}` as const;

export const SNARE_PATTERN_24_GHOST_CHAFFEE_1: string = ' .   .  ' as const;
export const SNARE_PATTERN_24_GHOST_CHAFFEE_2: string = ' .   . .' as const;
export const SNARE_PATTERN_24_GHOST_CHAFFEE_3: string = ' ..  . .' as const;

export const SNARE_PATTERN_44_GHOST_NONE: string = '                ' as const;
export const SNARE_PATTERN_44_GHOST_STD_1: string = ' .     . .      ' as const;
export const SNARE_PATTERN_24_GHOST_STD_2: string = '       .' as const;

export const createSnarePatternFrom2_24s = (args: {
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

export const createSnarePattern44 = (args: {
    snare: string;
    ghost: string;
}) => {
    return mergeSnareAndGhostsTogether(args.snare, args.ghost);
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

export const doublePattern = (pattern: string) => `${pattern}${pattern}`;

export const makeGhostActualSnare = (ghosts: string) => {
    let result = '';
    for (let symbol of ghosts) {
        result += symbol === '.' ? 'o' : symbol;
    }
    return result;
};
