/**
 * @private
 */
export function mapValues<T, R>(
	o: { [key: string]: T },
	mapper: (v: T) => R,
): { [key: string]: R } {
	const result: { [key: string]: R } = {};

	for (const key in o) {
		if (o.hasOwnProperty(key)) {
			const v = o[key];
			if (!v) continue;
			result[key] = mapper(v);
		}
	}

	return result;
}

/**
 * @private
 * Overwrite values or properties on objects and lists recursively.
 * A shallow copy will be created for each array value.
 */
export function assignDeep<T>(
	target: Partial<T>,
	...sources: (Partial<T> | undefined)[]
): T {
	sources.forEach((s) => {
		if (!s) return;
		for (const key in s) {
			if (s.hasOwnProperty(key)) {
				const v = s[key] as any;
				if (Array.isArray(v)) {
					// Shallow copy
					target[key] = v.slice(0) as any;
				} else if (typeof v === "object") {
					if (!target[key]) target[key] = {} as any;
					assignDeep<any>(target[key] as any, v);
				} else {
					target[key] = v;
				}
			}
		}
	});
	return target as T;
}
