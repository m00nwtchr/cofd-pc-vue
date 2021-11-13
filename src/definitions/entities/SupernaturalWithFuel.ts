import { Mixin } from 'ts-mixer';
import {
	IsSupernatural,
	HasFuel,
	JSONMixin
} from ".";

export class SupernaturalWithFuel extends Mixin(IsSupernatural, HasFuel) {
	get maxFuel(): number {
		return this.power >= 5 ?
			this.power >= 9 ?
				this.power === 10 ?
					75 :
					50
				: 10 + (this.power - 4) * 5
			: 10 + this.power - 1;
	}
}