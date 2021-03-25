import { Random } from "./RandomUtil";

export class DiceRoller {
	
	random: Random;

	constructor(random?: Random) {
		this.random = random || new Random();
	}

	async roll(dice: number, opts: {
		again: number;
		bonus: number;
		treshold: number;
		values: boolean;
	}): Promise<number[] | number> {
		opts = opts || {} as any;
		opts.again    = opts.again || 10;
		opts.bonus    = opts.bonus || 0;
		opts.treshold = opts.treshold || 8;
		opts.values   = opts.values || false;

		// const self = this;

		if (dice <= 0) {
			dice = 1;
			opts.again = 11;
		}

		console.log("ensureRnd");
		await this.random.ensureRnd();
		console.log("postEnsureRnd");

		let result = this.random.randomIntArray(dice, 1, 10);
		// let result = await RandomUtil.generateIntegerSequence(dice, 1, 10);
		console.log("result");

		const again = result.filter(num => num >= opts.again).length;

		if (again > 0 && again !== 1) {
			result = result.concat(await this.roll(again, Object.assign({}, opts, {values: true})));
		}

		// .flatMap(num => num >= opts.again ? [num, ...this.roll(1, Object.assign({}, opts, {values: true})) as number[]] : [num]) as number[];


		const succs = result.filter(el => el >= opts.treshold).length;

		return opts.values ? result : succs+opts.bonus;
	}
}