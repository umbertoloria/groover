import {NoteOrRest} from './extract-notes-or-rests.ts';

// Groups of notes
type GroupOfNotes = undefined | {
    num16ths: number;
    countItems: number;
}
const createEmptyGroupOfNotes = (): GroupOfNotes => ({
    num16ths: 0,
    countItems: 0,
});
export const buildGroupsOfNotes = (notesOrRests: NoteOrRest[]) => {
    const groupsOfNotes: GroupOfNotes[] = [];
    for (const item of notesOrRests) {
        if (item.num16 === 4) {
            // Is a quarter, so don't group.
            groupsOfNotes.push(undefined);
            continue;
        }

        // There are some 1/8s or 1/16s to group.
        if (groupsOfNotes.length === 0) {
            groupsOfNotes.push(createEmptyGroupOfNotes());
        } else {
            // Ok there is at least one element, but maybe this element is "undefined"...
        }
        let lastGr = groupsOfNotes[groupsOfNotes.length - 1];
        if (!lastGr) {
            // The last element was "undefined"...
            groupsOfNotes.push(createEmptyGroupOfNotes());
        }
        lastGr = groupsOfNotes[groupsOfNotes.length - 1] as (GroupOfNotes & object); // Sure is not "undefined" now.
        if (lastGr.num16ths >= 2 * 4) {
            groupsOfNotes.push(createEmptyGroupOfNotes());
        }
        lastGr = groupsOfNotes[groupsOfNotes.length - 1] as (GroupOfNotes & object); // Sure is not "undefined" now.
        lastGr.num16ths += item.num16;
        lastGr.countItems++;
    }
    return groupsOfNotes;
}

// Iterator upon groups of notes
export const createIteratorUponGroupsOfNotes = (groupsOfNotes: GroupOfNotes[]) => ({
    index: 0,
    currentGroup: undefined as (GroupOfNotes | undefined),
    remainingCountItemsFromCurrentGroup: 0,
    pickFirstGroupIfExists() {
        this.index = 0;
        this.currentGroup = groupsOfNotes[this.index++];
        if (this.currentGroup) {
            this.remainingCountItemsFromCurrentGroup = this.currentGroup.countItems;
        } else {
            this.remainingCountItemsFromCurrentGroup = 0;
        }
    },
    hasCurrentGroupJustStarted() {
        if (!this.currentGroup) {
            // Seems like all the groups have already been processed.
            console.error('There is no "current Group" now');
            return false;
        }
        return this.remainingCountItemsFromCurrentGroup === this.currentGroup.countItems;
    },
    isCurrentGroupContainingTheLastItem() {
        return this.remainingCountItemsFromCurrentGroup === 1;
    },
    pickNextGroup() {
        this.remainingCountItemsFromCurrentGroup--;
        if (this.remainingCountItemsFromCurrentGroup <= 0) {
            this.currentGroup = groupsOfNotes[this.index++];
            if (this.currentGroup) {
                this.remainingCountItemsFromCurrentGroup = this.currentGroup.countItems;
            } else {
                // All groups of items have been processed.
                this.remainingCountItemsFromCurrentGroup = 0;
            }
        }
    },
})
