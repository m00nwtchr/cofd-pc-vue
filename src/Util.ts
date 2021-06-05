import { Ref, computed } from "vue";
import g from "./i18n";

const i18n = g.global;
export const t = i18n.t.bind(i18n);
const te = i18n.te.bind(i18n);


export type RefType<T> = T | Ref<T>;



export const td = (key: string, def?: string) => {
	return computed(() => te(key) ? t(key) : def ? t(def) : ""); 
};

export function uniqByKeepFirst<I, K>(a: I[], key: (item: I) => K) {
	const seen = new Set<K>();
	return a.filter(item => {
		const k = key(item);
		return seen.has(k) ? false : seen.add(k);
	});
}

export function uniqByKeepLast<I, K>(a: I[], key: (item: I, index?: number) => K) {
	return [
		...new Map(
			a.map((x, i) => [key(x, i), x])
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