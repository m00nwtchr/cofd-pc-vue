import _ from 'lodash';
import { Mixin, settings, hasMixin } from 'ts-mixer';
import { reactive } from 'vue';
settings.initFunction = "init";

import { Ability, SKILLS, Skills } from "..";

import { Character } from ".";

type Function<T = void> = () => T;

export class JSONMixin {
	public toJSONFuncs: { [key: string]: Function<any> } = {};

	public toJSON() {
		let obj: any = { ...this };
		delete obj.toJSONFuncs;

		return Object.values<any>(this.toJSONFuncs).reduce(
			(prev, val) => val.call(prev),
			obj
		);
	}
}

export class EarnsBeats {
	beats: number;
	experience: number;

	constructor() {
		this.beats = 0;
		this.experience = 0;
	}
}

export class HasSkills {
	private _skills: Skills;
	specialties: { [index: string]: string[] };

	get skills() {
		const props = {} as any;

		SKILLS.flat().forEach(skill => {
			props[skill] = {
				get: () => this._skills[skill] || 0,
				set: (val: number) => this._skills[skill] = val
			};
		});

		return Object.defineProperties({} as Skills, props);
	}
	set skills(skills: Skills) {
		this._skills = skills;
	}

	constructor() {
		this._skills = {};
		this.specialties = {};
	}

	protected init() {
		if (hasMixin(this, JSONMixin)) {
			const funcs = (this as JSONMixin).toJSONFuncs;
			function f(this: any) {
				if (this._skills) {
					this.skills = this._skills;
					delete this._skills;
				}
				return this;
			}

			funcs["HasSkills"] = f;
		}
	}
}

export class HasIntegrity {
	integrityTrait: number;

	constructor() {
		this.integrityTrait = 7;
	}
}

export class HasMerits {
	merits: { [key: string]: Ability };

	constructor() {
		this.merits = {};
	}
}

export class IsSupernatural {
	power: number;
	abilities: { [index: string]: Ability };

	constructor() {
		this.power = 1;
		this.abilities = {};
	}

	protected init() {
		if (hasMixin(this, Character)) {
			const defaultAbl: { [index: string]: Ability } = {};
			const custom: { [index: string]: Ability } = {};

			Object.keys(this.splat.abilities || {}).forEach(key => {
				defaultAbl[key] = { level: 0 };
			});

			const ablTemp = Object.assign({}, defaultAbl);

			Object.keys(ablTemp).forEach(key => {
				const value = ablTemp[key];
				const def = defaultAbl[key];

				if (!def) {
					custom[key] = value;
					delete ablTemp[key];
				} else {
					// value.name = def.name;
				}
			});

			Object.keys(custom)
				.forEach(key => ablTemp[key] = custom[key]);
			this.abilities = reactive(ablTemp);
		}
	}
}

export interface HasFuel {
	get maxFuel(): number;
}

export class HasFuel {
	fuel: number;

	constructor() {
		this.fuel = 0;
	}
}

type Constructor<T> = new (...args: any[]) => T;

export function fromJSON<T extends Character>(data: any, type: Constructor<T>): T {
	return Object.assign(new type(), data);
}

// fromJSON<MortalCharacter>({});
// const character = new MageCharacter();
// // console.log("original", character);

// character.skills.athletics = 3;
// character.attributes.resolve = 3;
// character.attributes.composure = 3;
// console.log("original", character);
// console.log("{...character}", {...character});

// const jsonObj = JSON.parse(JSON.stringify(character));
// console.log("json", jsonObj);

// const restored = fromJSON(jsonObj, MageCharacter);
// console.log("fromJson", restored);

// console.log(JSON.stringify(character) === JSON.stringify(restored));