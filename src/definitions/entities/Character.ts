import _ from "lodash";
import { hasMixin } from "ts-mixer";
import { JSONMixin } from ".";
import { Armor, Attributes, EnumSplat, Splat, SPLATS } from "..";

export interface ICharacter {
	name: string;

	splat: Splat;

	// concept: string;

	attributes: Attributes;

	maxHealth: number;
	healthTrack: number[];

	willpower: number;
	maxWillpower: number;
	spentWillpowerDots: number;

	conditions: string[];
	aspirations: string[];

	size: number;
	speed: number;
	defense: number;
	armor: Armor;
	initative: number;
	perception: number;
}

export class Character implements ICharacter {
	protected _splat!: EnumSplat;
	get splat(): Splat {
		return SPLATS[this._splat] || {
			name: "",
			organizations: {},
			subTypes: {}
		};
	}
	set splat(val: EnumSplat | Splat) {
		this._splat = typeof val === "number" ? val : val.enum;
	}

	name: string;

	_attributes!: Attributes;
	set attributes(val: Attributes) {
		this._attributes = val;
	}
	get attributes(): Attributes {
		const _defProp = (key: string) => ({
			get: () => (this._attributes[key] || 1), //+ this.mod(key),
			set: (val: number) => this._attributes[key] = val, // - this.mod(key),
			configurable: true
		});

		return Object.defineProperties({} as Attributes, {
			intelligence: _defProp("intelligence"),
			wits: _defProp("wits"),
			resolve: _defProp("resolve"),

			strength: _defProp("strength"),
			dexterity: _defProp("dexterity"),
			stamina: _defProp("stamina"),

			presence: _defProp("presence"),
			manipulation: _defProp("manipulation"),
			composure: _defProp("composure"),
		});
	}

	private _healthTrack: number[] = [];

	get maxHealth() { return this.size + this.attributes.stamina; }
	get healthTrack(): number[] {
		const ogTrack = this._healthTrack || [];
		const track = Object.assign(new Array(this.maxHealth || 0).fill(0), ogTrack);

		if (this.maxHealth < track.length) {
			const deleted = track.splice(this.maxHealth - 1, track.length - this.maxHealth);
		}

		if (JSON.stringify(track) !== JSON.stringify(ogTrack)) {
			this._healthTrack = track;
		}

		return track;
	}
	set healthTrack(track: number[]) {
		this._healthTrack = track;
	}

	get maxWillpower() { return this.attributes.resolve + this.attributes.composure; }
	willpower: number;
	spentWillpowerDots: number;

	conditions: string[];
	aspirations: string[];

	_size!: number;
	get size(): number {
		return this._size;
	}
	set size(val: number) {
		this._size = val;
	}

	get speed() { return this.attributes.strength + this.attributes.dexterity + 5 }
	get defense() { return Math.min(this.attributes.dexterity, this.attributes.wits) }
	armor: Armor = {
		ballistic: 0,
		general: 0
	};
	get initative() { return this.attributes.dexterity + this.attributes.composure }
	get perception() { return this.attributes.wits + this.attributes.composure }

	constructor(splat?: EnumSplat | Splat) {
		this.splat = splat || EnumSplat.MORTAL;
		this.name = "";
		this.attributes = {
			intelligence: 1,
			wits: 1,
			resolve: 1,
			strength: 1,
			dexterity: 1,
			stamina: 1,
			presence: 1,
			manipulation: 1,
			composure: 1,
		};

		this.healthTrack = [];
		this.willpower = 0;
		this.spentWillpowerDots = 0;

		this.conditions = [];
		this.aspirations = [];

		this.size = 5;
	}

	protected init(splat?: EnumSplat | Splat) {
		this.splat = splat || EnumSplat.MORTAL;

		if (hasMixin(this, JSONMixin)) {
			const funcs = this.toJSONFuncs;

			function f(this: any) {
				if (typeof this._splat === "number") {
					this.splat = this._splat;
					delete this._splat;
				}
				if (typeof this._size === "number") {
					this.size = this._size;
					delete this._size;
				}
				if (this._attributes) {
					this.attributes = this._attributes;
					delete this._attributes;
				}
				if (this._healthTrack) {
					this.healthTrack = this._healthTrack;
					delete this._healthTrack;
				}

				return this;
			}
			funcs["Character"] = f;
		}
	}
}

type Constructor<T> = new (...args: any[]) => T;

export function fromJSON<T extends Character>(data: any, type?: Constructor<T>): T {
	data = {...data};
	if (data) {
		const splat: EnumSplat = data.splat || data._splat || EnumSplat.MORTAL;

		if (!type) {
			type = SPLATS[splat].characterFactory as Constructor<T>;
		}

		if (data.attributes) {
			data._attributes = data.attributes;
			delete data.attributes;
		}

		if (data.skills) {
			data._skills = data.skills;
			delete data.skills;
		}

		// let obj = Object.assign(new (type || Character))
		// let obj = _.merge(new (type || Character)(data.splat), data);

	// /	return obj;
		return _.merge(new (type || Character)(data.splat), data);
	}
}

// export function createCharacter() {
// 	return 
// }