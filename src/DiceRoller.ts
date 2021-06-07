import { Random } from "./RandomUtil";

interface RollOptions {
	again?: number;
	bonus?: number;
	treshold?: number;
	values?: boolean;
}

export class DiceRoller {

	random: Random;

	rollDefaults: RollOptions = {
		again: 10,
		bonus: 0,
		treshold: 8,
		values: false
	};

	constructor(random?: Random) {
		this.random = random || new Random({
			randomOrg: {}
		});
	}

	async roll(dice: number, _opts?: RollOptions): Promise<number[] | number> {
		const opts = Object.assign({}, this.rollDefaults, _opts) as {
			again: number;
			bonus: number;
			treshold: number;
			values: boolean;
		};

		if (dice <= 0) {
			dice = 1;
			opts.again = 11;
		}

		let result = (await this.random.ensureRnd(dice))
			.randomIntArray(dice, 1, 10);

		const again = result.filter(num => num >= opts.again).length;

		if (again > 0) {
			result = result.concat(await this.roll(again, Object.assign({}, opts, { values: true })));
		}

		const succs = result.filter(el => el >= opts.treshold).length;

		return opts.values ? result : succs + opts.bonus;
	}
}