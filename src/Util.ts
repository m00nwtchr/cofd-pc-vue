export function uniqByKeepFirst<I, K>(a: I[], key: (item: I) => K) {
	const seen = new Set<K>();
	return a.filter(item => {
		const k = key(item);
		return seen.has(k) ? false : seen.add(k);
	});
}

export function uniqByKeepLast<I, K>(a: I[], key: (item: I) => K) {
	return [
		...new Map(
			a.map(x => [key(x), x])
		).values()
	];
}

export function isUniqBy<I, K>(a: I[], key: (item: I) => K) {
	return new Set(a.map(key)).size === a.length;
}

export function toObject<T>(a: [string, T][]): {[key: string]: T } {
	const obj: {[key: string]: T } = {};
	a.forEach(el => {
		obj[el[0]] = el[1];
	})
	return obj;
}