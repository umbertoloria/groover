import {getNotesStacksList} from './notes-stack.ts';
import {buildWindowsOf16ths, createIteratorUponWindowsOf16ths} from './window-of-16ths.ts';

type ICreateSheet = {
    topPattern: string;
    snarePattern: string;
    kickPattern: string;
}
export const createSheet = async ({topPattern, snarePattern, kickPattern}: ICreateSheet): Promise<string> => {

    // Generate XML Notes
    const xmlFirstVoiceNotes: string[] = [];
    const xmlSecondVoiceNotes: string[] = [];

    const hhStacks = getNotesStacksList([topPattern, snarePattern]);

    const hhAndSnWindowsOf16ths = buildWindowsOf16ths(hhStacks);
    const hhAndSnIteratorUponWindowsOf16ths = createIteratorUponWindowsOf16ths(hhAndSnWindowsOf16ths);
    hhAndSnIteratorUponWindowsOf16ths.pickFirstWindowIfExists();
    for (const item of hhStacks) {
        const hhSymbol = item.symbols[0];
        const snSymbol = item.symbols[1];

        const grouping: undefined | 'begin' | 'continue' | 'end' = (() => {
            if (item.num16 === 4) {
                return undefined;
            }
            if (item.type === 'note') {
                if (hhAndSnIteratorUponWindowsOf16ths.hasCurrentWindowJustStarted()) {
                    return 'begin';
                }
                if (hhAndSnIteratorUponWindowsOf16ths.isCurrentWindowContainingTheLastItem()) {
                    return 'end';
                }
                return 'continue';
            }
            return undefined;
        })();

        if (hhSymbol !== ' ') {
            xmlFirstVoiceNotes.push(
                createHHNote({
                    durationNotEighth: (() => {
                        if (item.num16 === 1) {
                            return '16th';
                        }
                        if (item.num16 === 2) {
                            return undefined;
                        }
                        if (item.num16 === 4) {
                            return 'quarter';
                        }
                        // TODO: Other durations in 16ths not supported.
                        console.error('Other durations in 16ths not supported');
                        return undefined;
                    })(),
                    grouping,
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
                    grouping,
                })
            );
        }

        hhAndSnIteratorUponWindowsOf16ths.pickNextWindow();
    }

    const kkStacks = getNotesStacksList([kickPattern]);
    const kkWindowsOf16ths = buildWindowsOf16ths(kkStacks, true);
    const kkIteratorUponWindowsOf16ths = createIteratorUponWindowsOf16ths(kkWindowsOf16ths);
    kkIteratorUponWindowsOf16ths.pickFirstWindowIfExists();
    for (const notesStack of kkStacks) {

        const grouping: undefined | 'begin' | 'continue' | 'end' = (() => {
            if (notesStack.num16 === 4) {
                return undefined;
            }
            if (notesStack.type === 'note') {
                if (kkIteratorUponWindowsOf16ths.hasCurrentWindowJustStarted()) {
                    return 'begin';
                }
                if (kkIteratorUponWindowsOf16ths.isCurrentWindowContainingTheLastItem()) {
                    return 'end';
                }
                if (kkIteratorUponWindowsOf16ths.isCurrentWindowUndefined()) {
                    return undefined;
                }
                return 'continue';
            }
            return undefined;
        })();

        xmlSecondVoiceNotes.push(
            createKickNote({
                i8th: notesStack.num16 / 2,
                grouping,
                rest: notesStack.type === 'rest',
            })
        );

        kkIteratorUponWindowsOf16ths.pickNextWindow();
    }

    // Fetch XML Template
    const xmlTemplate = await fetchDrumsTemplate();

    // Generate XML Full Score
    const xmlOutput =
        xmlFirstVoiceNotes.join('\n')
        + `
        <backup>
            <duration>${4 * 4 /* High enough number of 1/8s */}</duration>
        </backup>
        `
        + xmlSecondVoiceNotes.join('\n')
    ;

    console.log(xmlSecondVoiceNotes.join('\n'));

    return xmlTemplate.replace('<output/>', xmlOutput)
}


// Note Template builders
const createHHNote = (args: {
    durationNotEighth?: '16th' | 'quarter';
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
        duration: (() => {
            if (args.durationNotEighth === '16th') {
                return 0.5;
            }
            if (args.durationNotEighth === 'quarter') {
                return 2;
            }
            return 1;
        })(),
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
    grouping?:
        'begin'
        | 'continue'
        | 'end';
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
    grouping: args.grouping,
    chord: args.isBelowHH,
});

const createKickNote = (args: {
    i8th: number;
    grouping?:
        'begin'
        | 'continue'
        | 'end';
    rest?: boolean;
}) => createNote({
    note: {
        step: 'F',
        octave: 4,
    },
    duration: args.i8th,
    instrument: 'kick',
    voice: 2,
    grouping: args.grouping,
    rest: args.rest,
})


// Note generic builder
const createNote = (args: {
    note: {
        step: string;
        octave: number;
    };
    duration: number; // In 1/8s.
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
            ${args.duration === 1.5 ? '<dot/>' : ''}
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
            if (args.duration === 1.5) {
                // It's a dotted-eighth.
                return 'eighth';
            }
            // Other dimensions of 1/8s not supported.
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
