const RANDOM_ORG_KEY = "";

import axios from "axios";

interface Error {
	code: number;
	message: string;
	data: null | (number | string)[];
}

interface JSONRPCResponse<T> {
	jsonrpc: string;
	result: T;
	error?: Error;
	id: number;
}

interface Result {
	bitsLeft: number;
	requestsLeft: number;
}

interface RandomResult<T> extends Result {
	random: {
		data: T;
		completionTime: string;
	};
	bitsUsed: number;
	advisoryDelay: number;
}

interface UsageResult<T> extends Result {
	status: string;
	creationTime: string;
	totalBits: number;
	totalRequests: number;
}


function validURL(str: string) {
	const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
		"(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
	return !!pattern.test(str);
}

const RANDOM_ORG_URL = (ver: number) =>
	`https://api.random.org/json-rpc/${ver}/invoke`;

class RandomOrgClient {

	private apiKey?: string;
	endpoint!: string;

	constructor(endpointUrl: string)
	constructor(apiKey: string)
	constructor(apiKeyOrEndpoint: string) {
		if (validURL(apiKeyOrEndpoint)) {
			this.endpoint = apiKeyOrEndpoint;
		} else {
			this.apiKey = apiKeyOrEndpoint;
		}
		this.endpoint = this.endpoint || RANDOM_ORG_URL(4);
	}

	protected async _request<T extends Result>(method: string, params: { [key: string]: any }): Promise<T> {
		const data = {
			jsonrpc: "2.0", method, params: {
				apiKey: this.apiKey,
				...params
			}, id: Math.floor(Math.random() * 1000)
		};

		const resp = (await axios.post(this.endpoint, data));

		const respData = resp.data as JSONRPCResponse<T>;

		if (respData.error) {
			throw respData.error;
		}
		return respData.result;
	}

	/**
	 * This method generates true random integers within a user-defined range.
	 * @param length How many random integers you need. Must be within the [1,1e4] range.
	 * @param max The upper boundary for the range from which the random numbers will be picked. Must be within the [-1e9,1e9] range.
	 * @param min The lower boundary for the range from which the random numbers will be picked. Must be within the [-1e9,1e9] range.
	 * @param replacement Specifies whether the random numbers should be picked with replacement. The default (true) will cause the numbers to be picked with replacement, i.e., the resulting numbers may contain duplicate values (like a series of dice rolls). If you want the numbers picked to be unique (like raffle tickets drawn from a container), set this value to false.
	 * @param base Specifies the base that will be used to display the numbers. Values allowed are 2, 8, 10 and 16. 
	 */
	public async generateIntegers(
		length: number,
		max: number,
		min?: number,
		replacement?: boolean,
		base?: 10
	): Promise<number[]>
	public async generateIntegers(
		length: number,
		max: number,
		min?: number,
		replacement?: boolean,
		base?: 2 | 8 | 16
	): Promise<string[]>
	public async generateIntegers(
		length: number,
		max: number,
		min = 0,
		replacement = true,
		base: 2 | 8 | 10 | 16 = 10
	): Promise<(string | number)[]> {
		const res = await this._request<RandomResult<(string | number)[]>>("generateIntegers", {
			n: length, max, min,
			replacement, base
		});
		return res.random.data;
	}

	/**
 * This method generates true random decimal fractions from a uniform distribution across the [0,1) interval with a user-defined number of decimal places. 
 * @param length How many random decimal fractions you need. Must be within the [1, 10000] range.
 * @param decimalPlaces The number of decimal places to use. Must be within the [1, 14] range.
 * @param replacement Specifies whether the random numbers should be picked with replacement. The default (true) will cause the numbers to be picked with replacement, i.e., the resulting numbers may contain duplicate values (like a series of dice rolls). If you want the numbers picked to be unique (like raffle tickets drawn from a container), set this value to false.
 */
	public async generateDecimalFractions(
		length: number,
		decimalPlaces: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 = 2,
		replacement = true,
	): Promise<number[]> {
		const res = await this._request<RandomResult<number[]>>("generateDecimalFractions", {
			n: length, decimalPlaces,
			replacement
		});
		return res.random.data;
	}
}

class WebCryptoRandom {
	public static randomFloat(): number {
		const int = window.crypto.getRandomValues(new Uint32Array(1))[0];
		return int / 2 ** 32;
	}

	public static randomInt(min: number, max: number): number {
		const range = max - min;
		return Math.floor(this.randomFloat() * range + min);
	}
	
	public static randomFloatArray(length: number): number[] {
		return Array.from(window.crypto.getRandomValues(new Uint32Array(length)).map(int => int / 2 ** 32));
	}

	public static randomIntArray(length: number, min: number, max: number): number[] {
		const range = max - min;
		return this.randomFloatArray(length).map(float => float * range + min);
	}
}

export class Random {

	useTrueRandom: boolean;
	randomStoreSize: number;

	randomStore: number[] = [];
	randomOrgClient?: RandomOrgClient;

	constructor(opts: {
		useTrueRandom?: boolean;
		randomStoreSize?: number;

		randomOrg?: {
			apiKey?: string;
			endpoint?: string;
		};
	} = {}) {
		this.useTrueRandom = opts.useTrueRandom || true;
		this.randomStoreSize = opts.randomStoreSize || 512;

		if (this.useTrueRandom && opts.randomOrg && (opts.randomOrg.apiKey || opts.randomOrg.endpoint)) {
			this.randomOrgClient = new RandomOrgClient((opts.randomOrg.apiKey || opts.randomOrg.endpoint) as string);
		}
	}

	ensureRnd(): Promise<Random> {
		return new Promise((resolve, reject) => {
			if (!this.randomStore.length && this.useTrueRandom) {
				if (this.randomOrgClient) {
					this.randomOrgClient.generateDecimalFractions(this.randomStoreSize, 2).then(arr => {
						this.randomStore = arr;
						resolve(this);
					}).catch(err => {
						this.randomStore = WebCryptoRandom.randomFloatArray(this.randomStoreSize);
						resolve(this);
					});
				} else {
					this.randomStore = WebCryptoRandom.randomFloatArray(this.randomStoreSize);
					resolve(this);
				}
			} else {
				return resolve(this);
			}
		});
	}

	flush() {
		this.randomStore = [];
	}

	randomFloat(): number {
		const res = this.randomStore.length ? this.randomStore.pop() : Math.random();
		if (!res && this.useTrueRandom) {
			throw "Error: Ran out of random data, make sure you call ensureRnd or allocate a bigger randomStoreSize!";
		}
		return res || (this.useTrueRandom ? NaN : Math.random());
	}

	randomInt(min: number, max: number) {
		return Math.floor(this.randomFloat() * (max - min) + min);
	}

	randomFloatArray(length: number) {
		return new Array(length).fill(0).map(() => this.randomFloat());
	}

	randomIntArray(length: number, min: number, max: number) {
		return new Array(length).fill(0).map(() => this.randomInt(min, max));
	}
}