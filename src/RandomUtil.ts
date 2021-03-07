const RANDOM_ORG_KEY = "6e673a81-3877-4c00-a5ef-cb8ac5b04dfd";

let lastReq: number;
let delay = 0;

import axios from "axios";

const x =  {
	randomOrgReq: function(method: string, params: any) {
		return new Promise((resolve, reject) => {

			if (lastReq) {
				// eslint-disable-next-line no-empty
				// while(lastReq+delay < Date.now()) {}
			}


			const data = {
				jsonrpc:"2.0", method, params, id: x.randomInt(0, 100000)
			};

			lastReq = Date.now();
			axios.post("https://api.random.org/json-rpc/2/invoke", data)
				.then(resp => resp.data as {result: any; error: any; id: string|number})
				.then(resp => {
		
					if (resp.error) {
						return reject(resp.error);
					} else {
						delay = resp.result.advisoryDelay;
						return resolve(resp.result);
					}
				});
		});

	},
	generateIntegerSequence: async function(length: number, min?: number, max?: number): Promise<number[]> {
		if (length === 0) return [0];
		// try {
		// 	const resp = (await this.randomOrgReq(
		// 		"generateIntegerSequences", {
		// 			apiKey: RANDOM_ORG_KEY,
		// 			n: 1,
		// 			length,
		// 			min,
		// 			max
		// 		})) as {
		// 			random: {data: number[][]};
		// 		};

		// 	return resp.random.data[0];
		// } catch(e) {
		return this.randomIntArray(length, min||1, max||10);
		// }
	},
	randomFloat: function () {
		const int = window.crypto.getRandomValues(new Uint32Array(1))[0];
		return int / 2 ** 32;
	},
	randomInt: function (min: number, max: number) {
		const range = max - min;
		return Math.floor(this.randomFloat() * range + min);
	},
	randomIntArray: function (length: number, min: number, max: number) {
		// return Array.from(window.crypto.getRandomValues(new Uint32Array(length))).map(el => Math.round((el / 2 ** 32) * (max-min) + min));
		return new Array(length).fill(0).map(() => this.randomInt(min, max));
	}
};

export default x;