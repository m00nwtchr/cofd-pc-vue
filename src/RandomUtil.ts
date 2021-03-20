const RANDOM_ORG_KEY = "";

let lastReq: number;
let delay = 0;

import axios from "axios";

function randomFloat() {
	const int = window.crypto.getRandomValues(new Uint32Array(1))[0];
	return int / 2 ** 32;
}
function randomInt(min: number, max: number) {
	const range = max - min;
	return Math.floor(randomFloat() * range + min);
}

function randomIntArray(length: number, min: number, max: number) {
	// return Array.from(window.crypto.getRandomValues(new Uint32Array(length))).map(el => Math.round((el / 2 ** 32) * (max-min) + min));
	return new Array(length).fill(0).map(() => randomInt(min, max));
}
function randomFloatArray(length: number) {
	// return Array.from(window.crypto.getRandomValues(new Uint32Array(length))).map(el => Math.round((el / 2 ** 32) * (max-min) + min));
	return new Array(length).fill(0).map(() => randomFloat());
}

function randomOrgReq(method: string, params: any) {
	return new Promise((resolve, reject) => {

		if (lastReq) {
			// eslint-disable-next-line no-empty
			// while(lastReq+delay < Date.now()) {}
		}


		const data = {
			jsonrpc: "2.0", method, params: {
				apiKey: RANDOM_ORG_KEY,
				...params
			}, id: randomInt(0, 100000)
		};

		lastReq = Date.now();
		axios.post("https://api.random.org/json-rpc/2/invoke", data)
			.then(resp => resp.data as { result: any; error: any; id: string | number })
			.then(resp => {

				if (resp.error) {
					return reject(resp.error);
				} else {
					delay = resp.result.advisoryDelay;
					return resolve(resp.result);
				}
			});
	});

}

async function generateIntegerSequence(length: number, min?: number, max?: number): Promise<number[]> {
	if (length === 0) return [];
	if (!RANDOM_ORG_KEY) {
		return randomIntArray(length, min || 1, max || 10);
	}
	
	try {
		const resp = (await randomOrgReq(
			"generateIntegerSequences", {
				n: 1,
				length,
				min,
				max
			})) as {
			random: { data: number[][] };
		};

		return resp.random.data[0];
	} catch (e) {
		return randomIntArray(length, min || 1, max || 10);
	}
}

async function generateDecimalFractions(length: number, decimalPlaces?: number): Promise<number[]> {
	if (length === 0) return [];
	if (!RANDOM_ORG_KEY) {
		return randomFloatArray(length);
	}
	
	try {
		const resp = (await randomOrgReq(
			"generateDecimalFractions", {
				n: length,
				decimalPlaces: decimalPlaces || 2
			})) as {
			random: { data: number[] };
		};

		return resp.random.data;
	} catch (e) {
		return randomFloatArray(length);
	}
}

export class Random {

	useTrueRandom: boolean;

	randomStoreSize: number

	randomStore: number[] = [];

	constructor(opts?: {
		useTrueRandom?: boolean;
		randomStoreSize?: number;
	}) {
		this.useTrueRandom = opts?.useTrueRandom || true;
		this.randomStoreSize = opts?.randomStoreSize || 512;
	}

	ensureRnd(): Promise<Random> {
		return new Promise((resolve, reject) => {
			if (!this.randomStore.length && this.useTrueRandom) {
				generateDecimalFractions(this.randomStoreSize, 2).then(arr => {
					this.randomStore.push(...arr);
					resolve(this);
				}).catch(err=>{
					console.error(err);
				});
			} else {
				return resolve(this);
			}
		});
	}

	randomFloat() {
		// await this.ensureRnd();

		return this.randomStore.length ? this.randomStore.pop() as number : Math.random();
	}

	randomInt(min: number, max: number) {
		// await this.ensureRnd();

		return Math.floor(this.randomFloat() * (max - min) + min);
	}

	randomFloatArray(length: number) {
		return new Array(length).fill(0).map(() => randomFloat());
	}

	randomIntArray(length: number, min: number, max: number) {
		return new Array(length).fill(0).map(() => randomInt(min, max));
	}
}