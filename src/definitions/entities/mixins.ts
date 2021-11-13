import _ from 'lodash';
import { Mixin, settings, hasMixin } from 'ts-mixer';
import { reactive } from 'vue';
settings.initFunction = "init";

import { Ability, Merit, Organization, SKILLS, Skills, SubType } from "..";

import { Character, ICharacter } from ".";

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
export class EarnsAlternativeBeats {
	alternateBeats: number = 0;
	alternateExperience: number = 0;
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

export class HasTouchstones {
	touchstones: string[] = [];
}

export class HasIntegrityHealth {
	integrityTrack: number[] = [];
}

export interface HasMerits extends Character {}
export class HasMerits {
	merits: { [key: string]: Ability } = {};

	get meritTraitMods(): { [key: string]: number } {
		const obj = Object.values(this.merits)
			.filter(m => m instanceof Merit)
			.flatMap((el) => (el as Merit).getTraitMods(this))
			.map(el => {
				return {
					mod: typeof el.mod === "function" ? el.mod() : el.mod,
					trait: el.trait
				};
			}).reduce((acc, val) => {
				acc[val.trait] = val.mod + (acc[val.trait] || 0);

				return acc;
			}, {} as { [key: string]: number });

		return proxy(obj);
	}

	get size(): number {
		return this._size + (this.meritTraitMods.size || 0);
	}

	set size(val: number) {
		this._size = val - (this.meritTraitMods.size || 0);
	}
}

export interface IsSupernatural extends Character {}
export class IsSupernatural {

	_subType: string = "";
	get subType(): SubType {
		return this.splat.subTypes[this._subType] || {};
	}
	set subType(val: string | SubType) {
		this._subType = typeof val === "string" ? val : val.name;
	}

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

		if (hasMixin(this, JSONMixin)) {
			function f(this: any) {
				if (this._subType) {
					this.subType = this._subType;
					delete this._subType;
				}

				return this;
			}
			this.toJSONFuncs["IsSupernatural"] = f;
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

export class HasVirtueViceAnchors {
	virtueAnchor: string = "";
	viceAnchor: string = "";
}

interface IHasHealth {
	healthTrack: number[];
	maxHealth: number;
}

export interface HasWoundPenalties extends IHasHealth {}
export class HasWoundPenalties {
	get woundPenalty(): number {
		return Math.min((this.healthTrack[this.maxHealth - 1] !== 0 ?
			-3 : this.healthTrack[this.maxHealth - 2] !== 0 ?
				-2 : this.healthTrack[this.maxHealth - 3] !== 0 ?
					-1 : 0), 0);
	}
}

export interface HasOrganization extends ICharacter {}
export class HasOrganization {
	_organization: string = "";

	get organization(): Organization {
		return this.splat.organizations[this._organization] || Object.defineProperties({}, {
			name: {
				get: () => this._organization,
				set: (val: string) => this._organization = val
			}
		});
	}
	set organization(val: Organization | string) {
		this._organization = typeof val === "object" ? val.name : val;
	}

	protected init() {
		if (hasMixin(this, JSONMixin)) {
			function f(this: any) {
				if (this._organization) {
					this.organization = this._organization;
					delete this._organization;
				}
				return this;
			}
			this.toJSONFuncs["HasOrganization"] = f;
		}
	}
}

export class HasLegacy {
	legacy: string = "";
}

export function proxy<T extends object>(obj: T, bonusHandler?: ProxyHandler<T>, def?: any) {
	return new Proxy(obj, Object.assign({
		get(target: any, property: any) {
			if (typeof property === "string") {
				return target[property] || def || 0;
			}
		},
	}, bonusHandler || {}));
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