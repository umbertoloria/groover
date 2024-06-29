import {createStack} from './stack.ts';

export type NotesStack = {
    type: 'note' | 'rest';
    startedOnNum16: number;
    num16: number;
    symbols: string[];
}
export const getNotesStacksList = (layers: string[]) => {
    const layerLength = layers[0].length;
    const stackOfStacks = createStack<NotesStack>();
    for (let i = 0; i < layerLength; ++i) {
        const symbols: string[] = layers.map((layer) => layer[i]);
        if (
            symbols.some((symbol) => symbol !== ' ')
        ) {
            // Note on at least one
            stackOfStacks.push({
                type: 'note',
                startedOnNum16: i % 4,
                num16: 1,
                symbols,
            });
        } else {
            // Rest on all
            const notesStack = stackOfStacks.top();
            if (
                notesStack
                && (
                    (
                        // If it starts on the first 1/16 of a 1/4, expand (potentially) to fit the whole 1/4.
                        notesStack.startedOnNum16 === 0 && notesStack.num16 < 4
                    )
                    || (
                        // If it starts on the third 1/16 of a 1/4, expand (potentially) to fit the whole second 1/8.
                        notesStack.startedOnNum16 === 2 && notesStack.num16 < 2
                    )
                )
            ) {
                stackOfStacks.pop();
                stackOfStacks.push({
                    type: notesStack.type === 'note'
                        ? 'note'
                        : 'rest',
                    startedOnNum16: notesStack.startedOnNum16,
                    num16: notesStack.num16 + 1,
                    symbols: notesStack.symbols,
                })
            } else {
                stackOfStacks.push({
                    type: 'rest',
                    startedOnNum16: i % 4,
                    num16: 1,
                    symbols, // Here symbols will be all spaces.
                });
            }
        }
    }
    return stackOfStacks.toList();
};
