import { Mixin } from 'ts-mixer';
import {
	Character,
	IsSupernatural,
} from "./index";

import { EphemeralAttributes, IEphemeralAttributes } from "..";

export class BaseEphemeral extends Mixin(Character, IsSupernatural) { 
	
	protected _attributes = {} as EphemeralAttributes;

	get attributes(): EphemeralAttributes {
		const _defProp = (val: string) => ({
			get: () => {
				return this.attributes[val];
			}
		});

		return Object.defineProperties({
			power: 0,
			finesse: 0,
			resistance: 0,
		}, {
			intelligence: _defProp("power"),
			wits:         _defProp("finesse"),
			resolve:      _defProp("resistance"),

			strength:     _defProp("power"),
			dexterity:    _defProp("finesse"),
			stamina:      _defProp("resistance"),

			presence:     _defProp("power"),
			manipulation: _defProp("finesse"),
			composure:    _defProp("resistance"),
		}) as EphemeralAttributes;
	}
	set attributes(val: IEphemeralAttributes) {
		this._attributes.power = val.power;
		this._attributes.finesse = val.finesse;
		this._attributes.resistance = val.resistance;
	}

	get defense() {
		return (this.power === 1 ? Math.max : Math.min)(this.attributes.power, this.attributes.finesse);
	}

	constructor() {
		super();

		this.attributes = {
			power: 0,
			finesse: 0,
			resistance: 0,
		};
	}
}
