import { hasMixin } from "ts-mixer";
import { JSONMixin } from ".";
import { Attributes, EnumSplat, Splat, SPLATS } from "..";

interface ICharacter {
	name: string;

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
	// armor: Armor;
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

	protected _attributes!: Attributes;
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

	get maxHealth() { return this.size + this.attributes.stamina; }
	healthTrack: number[];

	get maxWillpower() { return this.attributes.resolve + this.attributes.composure; }
	willpower: number;
	spentWillpowerDots: number;

	conditions: string[];
	aspirations: string[];

	size: number;
	get speed() { return this.attributes.strength + this.attributes.dexterity + 5 }
	get defense() { return Math.min(this.attributes.dexterity, this.attributes.wits) }
	// armor: Armor;
	get initative() { return this.attributes.dexterity + this.attributes.composure }
	get perception() { return this.attributes.wits + this.attributes.composure }

	constructor() {
		this.splat = EnumSplat.MORTAL;
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

	protected init() {
		if (hasMixin(this, JSONMixin)) {
			const funcs = (this as JSONMixin).toJSONFuncs;
			function f(this: any) {
				if (this._splat) {
					this.splat = this._splat;
					delete this._splat;
				}
				if (this._attributes) {
					this.attributes = this._attributes;
					delete this._attributes;
				}

				return this;
			}
			funcs["Character"] = f;
		}
	}
}
