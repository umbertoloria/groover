export async function createSheet(): Promise<string> {

    // Generate XML Notes
    const xmlFirstVoiceNotes: string[] = [

        // First 2/4
        createHHNote({
            grouping: 'begin',
        }),
        createHHNote({
            grouping: 'continue',
        }),
        createHHNote({
            grouping: 'continue',
        }),
        createSnareNoteBelowHH(),
        createHHNote({
            grouping: 'end',
        }),

        // Second 2/4
        createHHNote({
            grouping: 'begin',
        }),
        createHHNote({
            grouping: 'continue',
        }),
        createHHNote({
            grouping: 'continue',
        }),
        createSnareNoteBelowHH(),
        createHHNote({
            grouping: 'end',
        }),

    ];

    const xmlSecondVoiceNotes: string[] = [

        // First 2/4
        createKickNote({
            i8th: 2,
        }),
        createKickNote({
            i8th: 2,
            rest: true,
        }),

        // Second 2/4
        createKickNote({
            i8th: 2,
        }),
        createKickNote({
            i8th: 2,
            rest: true,
        }),

    ];

    // Fetch XML Template
    const xmlTemplate = await fetchDrumsTemplate();

    // Generate XML Full Score
    const xmlOutput =
        xmlFirstVoiceNotes.join('\n')
        + `
        <backup>
            <duration>8</duration>
        </backup>
        `
        + xmlSecondVoiceNotes.join('\n')
    ;

    return xmlTemplate.replace('<output/>', xmlOutput)
}


// Note Template builders
const createHHNote = (args: {
    grouping?:
        'begin'
        | 'continue'
        | 'end';
}) => {
    return createNote({
        note: {
            step: 'G',
            octave: 5,
        },
        duration: 1,
        instrument: 'hh',
        voice: 1,
        grouping: args.grouping,
    });
}

const createSnareNoteBelowHH = () => createNote({
    note: {
        step: 'C',
        octave: 5,
    },
    duration: 1,
    instrument: 'snare',
    voice: 1,
    chord: true,
});

const createKickNote = (args: {
    i8th: number;
    rest?: boolean;
}) => {
    return createNote({
        note: {
            step: 'F',
            octave: 4,
        },
        duration: args.i8th,
        instrument: 'kick',
        voice: 2,
        rest: args.rest,
    });
}

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
            <duration>${args.duration}</duration>
            <instrument id="${args.instrument}"/>
            <voice>${args.voice}</voice>
            <type>${
        (() => {
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
