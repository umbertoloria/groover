type MyStack<T> = {
    items: T[];
    top: () => T | undefined;
    pop: () => T | undefined;
    push: (item: T) => void;
    toList: () => T[];
}
export const createStack = <T>(): MyStack<T> => ({
    items: [] as T[],
    top() {
        if (this.items.length) {
            return this.items[this.items.length - 1]
        }
        return undefined;
    },
    pop() {
        if (this.items.length) {
            const result = this.items[this.items.length - 1]
            this.items = this.items.slice(0, this.items.length - 1);
            return result;
        }
        return undefined;
    },
    push(item: T) {
        this.items.push(item);
    },
    toList() {
        return this.items.map((item) => item);
    },
});
