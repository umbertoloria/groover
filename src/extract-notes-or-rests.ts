import {createStack} from './stack.ts';

type NoteOrRest = {
    type: 'note' | 'rest';
    num16: number;
    symbols: string[];
}
export const extractNotesOrRests = (layers: string[]) => {
    const layerLength = layers[0].length;

    const max16thsToGroup = 4;

    const stack = createStack<NoteOrRest>();
    for (let i = 0; i < layerLength; ++i) {
        const symbols: string[] = layers.map((layer) => layer[i]);
        if (
            symbols.some((symbol) => symbol !== ' ')
        ) {
            // Note on at least one
            stack.push({
                type: 'note',
                num16: 1,
                symbols,
            });
        } else {
            // Rest on all
            const lastNoteOrRest = stack.top();
            if (lastNoteOrRest && lastNoteOrRest.num16 < max16thsToGroup) {
                stack.pop();
                stack.push({
                    type: lastNoteOrRest.type === 'note'
                        ? 'note'
                        : 'rest',
                    num16: lastNoteOrRest.num16 + 1,
                    symbols: lastNoteOrRest.symbols,
                })
            } else {
                stack.push({
                    type: 'rest',
                    num16: 1,
                    symbols, // Here symbols will be all spaces.
                });
            }
        }
    }
    return stack;
};
