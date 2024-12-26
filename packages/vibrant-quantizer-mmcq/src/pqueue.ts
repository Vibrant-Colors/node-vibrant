interface PQueueComparator<T> {
	(a: T, b: T): number;
}

/**
 * @private
 */
export class PQueue<T> {
	contents: T[];
	private _sorted: boolean;
	private _comparator: PQueueComparator<T>;
	private _sort(): void {
		if (!this._sorted) {
			this.contents.sort(this._comparator);
			this._sorted = true;
		}
	}

	constructor(comparator: PQueueComparator<T>) {
		this._comparator = comparator;
		this.contents = [];
		this._sorted = false;
	}

	push(item: T): void {
		this.contents.push(item);
		this._sorted = false;
	}

	peek(index?: number): T {
		this._sort();
		index = typeof index === "number" ? index : this.contents.length - 1;
		return this.contents[index]!;
	}

	pop() {
		this._sort();
		return this.contents.pop();
	}

	size(): number {
		return this.contents.length;
	}

	map<U>(mapper: (item: T, index: number) => any): U[] {
		this._sort();
		return this.contents.map(mapper);
	}
}
