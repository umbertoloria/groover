import {extractNotesOrRests} from './extract-notes-or-rests.ts';

export async function createSheet(): Promise<string> {

    const hhLayer: string = '< - - > < - - > ';
    const snLayer: string = ' .  o.   .  o.  ';
    const kkLayer: string = 'o       o       ';

    // Generate XML Notes
    const xmlFirstVoiceNotes: string[] = [];
    const xmlSecondVoiceNotes: string[] = [];

    const hhNotesAndRests = extractNotesOrRests([hhLayer, snLayer]);
    const initialHhStackLength = hhNotesAndRests.length;
    for (const item of hhNotesAndRests) {
        const hhSymbol = item.symbols[0];
        const snSymbol = item.symbols[1];
        if (hhSymbol !== ' ') {
            xmlFirstVoiceNotes.push(
                createHHNote({
                    isHalfEighth: item.num16 === 1 ? true : undefined,
                    grouping: (() => {
                        if (item.type === 'note') {
                            if (hhSymbol === '<') {
                                return 'begin';
                            }
                            if (hhSymbol === '-') {
                                return 'continue';
                            }
                            if (hhSymbol === '>') {
                                return 'end';
                            }
                        }
                        return undefined;
                    })(),
                    rest: item.type === 'rest',
                })
            );
        }
        if (snSymbol !== ' ') {
            xmlFirstVoiceNotes.push(
                createSnareNoteMaybeBelowHH({
                    isBelowHH: hhSymbol !== ' ',
                    ghost: snSymbol === '.',
                    isHalfEighth: item.num16 === 1 ? true : undefined,
                    groupContinue: true, // Assuming we're always below a HH group.
                })
            );
        }
    }
    const kkNotesAndRests = extractNotesOrRests([kkLayer]);
    for (const item of kkNotesAndRests) {
        xmlSecondVoiceNotes.push(
            createKickNote({
                i8th: item.num16 / 2, // TODO: What if it was a 16th hit?
                rest: item.type === 'rest',
            })
        );
    }

    // Fetch XML Template
    const xmlTemplate = await fetchDrumsTemplate();

    // Generate XML Full Score
    const xmlOutput =
        xmlFirstVoiceNotes.join('\n')
        + `
        <backup>
            <duration>${initialHhStackLength}</duration>
        </backup>
        `
        + xmlSecondVoiceNotes.join('\n')
    ;

    return xmlTemplate.replace('<output/>', xmlOutput)
}


// Note Template builders
const createHHNote = (args: {
    isHalfEighth?: boolean;
    grouping?:
        'begin'
        | 'continue'
        | 'end';
    rest?: boolean;
}) => {
    return createNote({
        note: {
            step: 'G',
            octave: 5,
        },
        duration: args.isHalfEighth ? 0.5 : 1,
        instrument: 'hh',
        voice: 1,
        grouping: args.grouping,
        rest: args.rest,
    });
}

const createSnareNoteMaybeBelowHH = (args: {
    isBelowHH: boolean;
    ghost?: boolean;
    isHalfEighth?: boolean;
    groupContinue?: boolean;
}) => createNote({
    note: {
        step: 'C',
        octave: 5,
    },
    duration: args.isHalfEighth ? 0.5 : 1,
    instrument: args.ghost
        ? 'snare-ghost'
        : 'snare',
    voice: 1,
    grouping: args.groupContinue ? 'continue' : undefined,
    chord: args.isBelowHH,
});

const createKickNote = (args: {
    i8th: number;
    rest?: boolean;
}) => createNote({
    note: {
        step: 'F',
        octave: 4,
    },
    duration: args.i8th,
    instrument: 'kick',
    voice: 2,
    rest: args.rest,
})

// Note generic builder
const createNote = (args: {
    note: {
        step: string;
        octave: number;
    };
    duration: number;
    instrument:
        'hh'
        | 'snare'
        | 'snare-ghost'
        | 'kick';
    voice: number;
    grouping?:
        'begin'
        | 'continue'
        | 'end';
    chord?: boolean;
    rest?: boolean;
}): string => {
    return `
        <note>
            ${args.rest ? '<rest/>' : ''}
            ${args.chord ? '<chord/>' : ''}
            <unpitched>
                <display-step>${args.note.step}</display-step>
                <display-octave>${args.note.octave}</display-octave>
            </unpitched>
            <duration>${args.duration < 1 ? 1 : args.duration /* Using min duration=1 */}</duration>
            <instrument id="${args.instrument}"/>
            <voice>${args.voice}</voice>
            <type>${
        (() => {
            if (args.duration === 0.5) {
                return '16th';
            }
            if (args.duration === 1) {
                return 'eighth';
            }
            return 'quarter';
        })()}</type>
            <stem>${
        (() => {
            if (args.instrument === 'kick') {
                return 'down';
            }
            return 'up';
        })()}</stem>
           ${
        (() => {
            if (args.instrument === 'hh') {
                return '<notehead>x</notehead>';
            }
            if (args.instrument === 'snare-ghost') {
                return '<notehead>diamond</notehead>';
            }
            return '';
        })()}
           ${
        (() => {
            if (!!args.grouping) {
                return `<beam number="1">${args.grouping}</beam>`;
            }
            return '';
        })()}
        </note>
    `;
}


// FETCHING
const fetchDrumsTemplate = () => fetchDrumsFromPublic('drums-sheet-template.musicxml')

export const fetchDrumsFromPublic = (filename: string) => fetch(`/resources/${filename}`)
    .then((res) => res.text())
