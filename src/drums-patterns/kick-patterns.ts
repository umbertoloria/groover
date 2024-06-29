export const KICK_PATTERN_24_IK___I____: string = 'o   ' as const;
export const KICK_PATTERN_24_I____I____: string = '    ' as const;
export const KICK_PATTERN_24_IK_K_I____: string = 'o o ' as const;
export const KICK_PATTERN_24_I____I_K__: string = ' o  ' as const;
export const KICK_PATTERN_24_I____I___K: string = '   o' as const;

export const createKickPatternFrom14BeatChaffeeBank = (chaffeeCount: number) => {
    if (chaffeeCount === 0) {
        return KICK_PATTERN_24_I____I____;
    } else if (chaffeeCount === 1) {
        return KICK_PATTERN_24_IK___I____;
    } else if (chaffeeCount === 2) {
        return ' o  ';
    } else if (chaffeeCount === 3) {
        return '  o ';
    } else if (chaffeeCount === 4) {
        return '   o';
    } else if (chaffeeCount === 5) {
        return 'oo  ';
    } else if (chaffeeCount === 6) {
        return KICK_PATTERN_24_IK_K_I____;
    } else if (chaffeeCount === 7) {
        return 'o  o';
    } else if (chaffeeCount === 8) {
        return ' oo ';
    } else if (chaffeeCount === 9) {
        return ' o o';
    } else if (chaffeeCount === 10) {
        return '  oo';
    } else if (chaffeeCount === 11) {
        return 'ooo ';
    } else if (chaffeeCount === 12) {
        return 'oo o';
    } else if (chaffeeCount === 13) {
        return 'o oo';
    } else if (chaffeeCount === 14) {
        return ' ooo';
    }
    // 15
    return 'oooo';
}

export const createKickPatternFrom14BackBeatChaffeeBank = (chaffeeCount: number) => {
    if (chaffeeCount === 0) {
        return KICK_PATTERN_24_I____I____;
    } else if (chaffeeCount === 1) {
        return ' o  ';
    } else if (chaffeeCount === 2) {
        return '  o ';
    } else if (chaffeeCount === 3) {
        return '   o';
    } else if (chaffeeCount === 4) {
        return ' oo ';
    } else if (chaffeeCount === 5) {
        return ' o o';
    } else if (chaffeeCount === 6) {
        return '  oo';
    }
    // 7
    return ' ooo';
}
