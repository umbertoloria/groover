import {createStack} from './stack.ts';

export type NoteOrRest = {
    type: 'note' | 'rest';
    startedOnNum16: number;
    num16: number;
    symbols: string[];
}
export const extractNotesOrRests = (layers: string[]) => {
    const layerLength = layers[0].length;
    const stack = createStack<NoteOrRest>();
    for (let i = 0; i < layerLength; ++i) {
        const symbols: string[] = layers.map((layer) => layer[i]);
        if (
            symbols.some((symbol) => symbol !== ' ')
        ) {
            // Note on at least one
            stack.push({
                type: 'note',
                startedOnNum16: i % 4,
                num16: 1,
                symbols,
            });
        } else {
            // Rest on all
            const lastNoteOrRest = stack.top();
            if (
                lastNoteOrRest
                && (
                    (
                        // If it starts on the first 1/16 of a 1/4, expand (potentially) to fit the whole 1/4.
                        lastNoteOrRest.startedOnNum16 === 0 && lastNoteOrRest.num16 < 4
                    )
                    || (
                        // If it starts on the third 1/16 of a 1/4, expand (potentially) to fit the whole second 1/8.
                        lastNoteOrRest.startedOnNum16 === 2 && lastNoteOrRest.num16 < 2
                    )
                )
            ) {
                stack.pop();
                stack.push({
                    type: lastNoteOrRest.type === 'note'
                        ? 'note'
                        : 'rest',
                    startedOnNum16: lastNoteOrRest.startedOnNum16,
                    num16: lastNoteOrRest.num16 + 1,
                    symbols: lastNoteOrRest.symbols,
                })
            } else {
                stack.push({
                    type: 'rest',
                    startedOnNum16: i % 4,
                    num16: 1,
                    symbols, // Here symbols will be all spaces.
                });
            }
        }
    }
    return stack.toList();
};
