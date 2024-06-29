import {NotesStack} from './notes-stack.ts';

// Windows of 16ths
type WindowOf16ths = undefined | {
    num16ths: number;
    countItems: number;
}
const createEmptyWindowOf16ths = (): WindowOf16ths => ({
    num16ths: 0,
    countItems: 0,
});
export const buildWindowsOf16ths = (notesStacksList: NotesStack[]) => {
    const windows: WindowOf16ths[] = [];
    for (const notesStack of notesStacksList) {
        if (notesStack.num16 > 2) {
            // It's a quarter or a dotted eighth, so don't group.
            windows.push(undefined);
            continue;
        }

        // There are some 1/8s or 1/16s to group.
        if (windows.length === 0) {
            windows.push(createEmptyWindowOf16ths());
        } else {
            // Ok there is at least one element, but maybe this element is "undefined"...
        }
        let lastGr = windows[windows.length - 1];
        if (!lastGr) {
            // The last element was "undefined"...
            windows.push(createEmptyWindowOf16ths());
        }
        lastGr = windows[windows.length - 1] as (WindowOf16ths & object); // Sure is not "undefined" now.
        if (lastGr.num16ths >= 2 * 4) {
            windows.push(createEmptyWindowOf16ths());
        }
        lastGr = windows[windows.length - 1] as (WindowOf16ths & object); // Sure is not "undefined" now.
        lastGr.num16ths += notesStack.num16;
        lastGr.countItems++;
    }
    if (windows.length) {
        const lastWindow = windows[windows.length - 1];
        if (lastWindow) {
            if (lastWindow.countItems === 1) {
                windows.splice(windows.length - 1);
                windows.push(undefined)
            }
        }
    }
    return windows;
}

// Iterator upon Windows of 16ths
export const createIteratorUponWindowsOf16ths = (windowsOf16ths: WindowOf16ths[]) => ({
    index: 0,
    currentWindow: undefined as (WindowOf16ths | undefined),
    remainingCountItemsFromCurrentWindow: 0,
    pickFirstWindowIfExists() {
        this.index = 0;
        this.currentWindow = windowsOf16ths[this.index++];
        if (this.currentWindow) {
            this.remainingCountItemsFromCurrentWindow = this.currentWindow.countItems;
        } else {
            this.remainingCountItemsFromCurrentWindow = 0;
        }
    },
    hasCurrentWindowJustStarted() {
        if (!this.currentWindow) {
            // Seems like all the windows have already been processed.
            console.error('There is no "current Window" now');
            return false;
        }
        return this.remainingCountItemsFromCurrentWindow === this.currentWindow.countItems;
    },
    isCurrentWindowContainingTheLastItem() {
        return this.remainingCountItemsFromCurrentWindow === 1;
    },
    isCurrentWindowUndefined() {
        return this.currentWindow === undefined;
    },
    pickNextWindow() {
        this.remainingCountItemsFromCurrentWindow--;
        if (this.remainingCountItemsFromCurrentWindow <= 0) {
            this.currentWindow = windowsOf16ths[this.index++];
            if (this.currentWindow) {
                this.remainingCountItemsFromCurrentWindow = this.currentWindow.countItems;
            } else {
                // All windows of items have been processed.
                this.remainingCountItemsFromCurrentWindow = 0;
            }
        }
    },
})
