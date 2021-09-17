import _ from "lodash";
import { reactive } from "vue";
import { Splat, SPLATS, EnumSplat, Organization, SubType } from ".";
export const ATTRIBUTES = [
	["intelligence", "wits", "resolve"],
	["strength", "dexterity", "stamina"],
	["presence", "manipulation", "composure"],
];

export const SKILLS = [
	[
		"academics",
		"computer",
		"crafts",
		"investigation",
		"medicine",
		"occult",
		"politics",
		"science",
	],
	[
		"athletics",
		"brawl",
		"drive",
		"firearms",
		"larceny",
		"stealth",
		"survival",
		"weaponry",
	],
	[
		"animal_ken",
		"empathy",
		"expression",
		"intimidation",
		"persuasion",
		"socialize",
		"streetwise",
		"subterfuge",
	],
];
export interface Ability {
	key?: string;
	name?: string;
	level: number;
}

export interface Attributes {
	[index: string]: number;
	intelligence: number;
	wits: number;
	resolve: number;

	strength: number;
	dexterity: number;
	stamina: number;

	presence: number;
	manipulation: number;
	composure: number;
}

interface Skills {
	[index: string]: number;
}

interface Armor {
	[key: string]: number;
	general: number;
	ballistic: number;
}

interface ICharacter {
	splat: Splat;
	name: string;

	concept: string;
	chronicle: string;
	
	organization: Organization;
	subType: SubType;

	// xsplat: string;
	// ysplat: string;
	// zsplat: string;

	virtueAnchor: string;
	viceAnchor: string;

	attributes: Attributes;
	skills: Skills;

	maxHealth: number;
	healthTrack: number[];
	woundPenalty: number;

	conditions: string[];
	aspirations: string[];

	size: number;
	speed: number;
	defense: number;
	armor: Armor;
	initative: number;

	willpower: number;
	maxWillpower: number;
	spentWillpowerDots: number;

	mod(string: string): number;

	data: Map<string, unknown>;
}

export class Character implements ICharacter {

	get splat(): Splat {
		return SPLATS[this.data.get("splat") as EnumSplat] || {};
	}

	name = "";

	concept: string;
	chronicle: string;

	virtueAnchor = "";
	viceAnchor = "";

	get organization(): Organization {
		return this.splat.organizations[this.data.get("organization") as string] || {};
	}

	get subType(): SubType {
		return this.splat.subTypes[this.data.get("subType") as string] || {};
	}

	attributes: Attributes;
	skills: Skills;

	get maxHealth(): number {
		return this.attributes.stamina + this.size;
	}

	get healthTrack(): number[] {
		const ogTrack = (this.data.get("healthTrack") as number[]) || [];
		const track = Object.assign(new Array(this.maxHealth).fill(0), ogTrack);

		if (this.maxHealth < track.length) {
			const deleted = track.splice(this.maxHealth-1, track.length-this.maxHealth);
		}

		if (JSON.stringify(track) !== JSON.stringify(ogTrack)) {
			this.data.set("healthTrack", track);
		}

		return track;
	}

	set healthTrack(track: number[]) {
		this.data.set("healthTrack", track);
	}

	get woundPenalty(): number {
		return Math.min((this.healthTrack[this.maxHealth - 1] !== 0 ?
			-3 : this.healthTrack[this.maxHealth - 2] !== 0 ?
				-2 : this.healthTrack[this.maxHealth - 3] !== 0 ?
					-1 : 0), 0);
	}

	conditions: string[] = [];
	aspirations: string[] = [];

	willpower = 0;

	get maxWillpower(): number {
		return this.attributes.resolve + this.attributes.composure - this.spentWillpowerDots;
	}

	get spentWillpowerDots(): number {
		return this.data.get("spentWillpowerDots") as number;
	}
	set spentWillpowerDots(val: number) {
		this.data.set("spentWillpowerDots", val);
	}

	get size(): number {
		return this.data.get("size") as number;
	}

	get speed(): number {
		return this.attributes.strength + this.attributes.dexterity + 5;
	}

	get defense(): number {
		return Math.min(this.attributes.dexterity, this.attributes.wits) + this.skills.athletics;
	}

	armor: Armor;

	// get armor(): Armor {
	// 	const data = this.data.get("armor") as Armor || {
	// 		general: 0,
	// 		ballistic: 0
	// 	};

	// 	const obj = {} as Armor;

	// 	Object.defineProperties(obj, {
	// 		general: {
	// 			get: () => data.general
	// 		},
	// 		ballistic: {
	// 			get: () => data.ballistic
	// 		}
	// 	});

	// 	return obj;
	// }

	get initative(): number {
		return this.attributes.dexterity + this.attributes.composure;
	}

	// templates: EnumTemplate[];
	data: Map<string, unknown> = reactive(new Map());

	constructor(opts: ICharacter) {
		this.data.set("splat", EnumSplat.MORTAL);

		if (opts.splat) {
			if (typeof opts.splat === "number") {
				this.data.set("splat", opts.splat);
			}
		}

		if (opts.subType) {
			this.data.set("subType", opts.subType);
		}

		if (opts.organization) {
			this.data.set("organization", opts.organization);
		}

		this.name = opts.name || "";

		this.concept = opts.concept || "";
		this.chronicle = opts.chronicle || "";

		this.virtueAnchor = opts.virtueAnchor || "";
		this.viceAnchor = opts.viceAnchor || "";

		this.willpower = opts.willpower || 0;
	
		this.data.set("attributes", opts.attributes || {} as Attributes);
		this.data.set("skills", opts.skills || {} as Skills);

		{
			const _getAttrs = () => this.data.get("attributes") as Attributes;
			const _setAttrs = (key: string, val: number) => this.data.set("attributes", Object.assign(_getAttrs(), {[key]: val}));
			const _defProp  = (key: string) => ({
				get: () => (_getAttrs()[key] || 1) + this.mod(key),
				set: (val: number) => _setAttrs(key, val - this.mod(key)),
				configurable: true
			});

			this.attributes = Object.defineProperties({} as Attributes, {
				intelligence: _defProp("intelligence"),
				wits:         _defProp("wits"),
				resolve:      _defProp("resolve"),

				strength:     _defProp("strength"),
				dexterity:    _defProp("dexterity"),
				stamina:      _defProp("stamina"),

				presence:     _defProp("presence"),
				manipulation: _defProp("manipulation"),
				composure:    _defProp("composure"),
			});
		}

		{
			const _getSkills = () => this.data.get("skills") as Skills;
			const _setSkill = (key: string, val: number) => this.data.set("skills", Object.assign(_getSkills(), {[key]: val}));

			const props = {} as any;

			SKILLS.flat().forEach(skill => {
				props[skill] = {
					get: () => _getSkills()[skill] || 0,
					set: (val: number) => _setSkill(skill, val)
				};
			});

			this.skills = Object.defineProperties({} as Skills, props);
		}
		
		this.data.set("armor", opts.armor || {});
		{
			const _getAttrs = () => this.data.get("armor") as Armor;
			const _setAttrs = (key: string, val: number) => this.data.set("armor", Object.assign(_getAttrs(), {[key]: val}));
			const _defProp  = (key: string, func: () => number) => ({
				get: () => (_getAttrs()[key] || 0) + func(),
				set: (val: number) => _setAttrs(key, val - func())
			});

			this.armor = Object.defineProperties({} as Armor, {
				general:   _defProp("general",   () => 0),
				ballistic: _defProp("ballistic", () => 0),
			});
		}

		this.data.set("size", opts.size || 5);

		this.data.set("healthTrack", opts.healthTrack || []);

		this.data.set("spentWillpowerDots", opts.spentWillpowerDots || 0);
	}

	mod(trait: string): number {
		return 0;
	}
}

interface IMortalCharacter extends ICharacter {
	
	specialties: { [index: string]: string[] };

	merits: { [key: string]: Ability };

	integrityTrait: number;

	beats: number;
	experience: number;
}

export class MortalCharacter extends Character implements IMortalCharacter {

	specialties: { [index: string]: string[] };
	
	beats: number;
	experience: number;

	// merits: { [key: string]: Ability };
	get merits(): { [key: string]: Ability } {
		const data = this.data.get("merits") as { [key: string]: Ability };

		return data;
	}

	set merits(val: { [key: string]: Ability }) {
		this.data.set("merits", val);
	}

	integrityTrait: number;

	constructor(opts: IMortalCharacter) {
		super(opts);
		this.data.set("merits", opts.merits || {});

		this.beats = opts.beats || 0;
		this.experience = opts.experience || 0;

		this.specialties = opts.specialties || {};
		// this.merits = opts.merits || {};
		this.integrityTrait = opts.integrityTrait || 7;
	}

}

interface ISupernatural {

	power: number;

	abilities: { [index: string]: Ability };

	maxFuel: number;
	fuel: number;

}

interface ISupernaturalCharacter extends IMortalCharacter, ISupernatural {
	power: number;
	abilities: { [index: string]: Ability };
	fuel: number;
	maxFuel: number;
}

export class SupernaturalCharacter extends MortalCharacter implements ISupernaturalCharacter {

	power: number;

	abilities: { [index: string]: Ability } = {};

	fuel: number;
	get maxFuel(): number {
		return this.power >= 5 ?
			this.power >= 9 ?
				this.power === 10 ?
					75 :
					50
				: 10 + (this.power - 4) * 5
			: 10 + this.power - 1;
	}

	constructor(opts: ISupernaturalCharacter) {
		super(opts);

		this.power = opts.power || 1;
		this.fuel = opts.fuel || 0;

		this.abilities = {};

		{
			const defaultAbl: { [index: string]: Ability } = {};
			const custom: { [index: string]: Ability } = {};

			Object.keys(this.splat.abilities || {}).forEach(key => {
				defaultAbl[key] = { level: 0 };
			});

			const ablTemp = Object.assign({}, defaultAbl, opts.abilities);

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

	protected _getAbility(key: string): Ability {
		return this.abilities[key] || {level:0,name:""};
	}
}

interface IMageCharacter extends IMortalCharacter, ISupernatural {

	roteSkills: string[];

}

export class MageCharacter extends SupernaturalCharacter implements IMageCharacter {

	// roteSkills: string[];

	get roteSkills(): string[] {
		return this.organization.skills || this.data.get("roteSkills") as string[] || [];
	}

	constructor(opts: IMageCharacter) {
		super(opts);


		if (opts.roteSkills) {
			this.data.set("roteSkills", opts.roteSkills);
		}
		// this.roteSkills = opts.roteSkills || [];
	}

}

interface IHasTouchstones {

	touchstones: string[];

}

interface IVampireCharacter extends IMortalCharacter, ISupernatural, IHasTouchstones {
}

function lookupAccess<T>(obj: any, prop: string) {
	const desc = (Object.getOwnPropertyDescriptor(obj, prop) || {});

	return {
		get: desc.get || (() => null),
		set: desc.set || ((val: T) => {})
	} as {
		get: () => T,
		set: (val: T) => void
	};
}

export class VampireCharacter extends SupernaturalCharacter implements IVampireCharacter {
	
	touchstones: string[];

	get defense(): number {
		return super.defense + this._getAbility("celerity").level;
	}

	get maxFuel(): number {
		return this.power == 0 ? this.attributes.stamina : super.maxFuel;
	}

	constructor(opts: IVampireCharacter) {
		super(opts);		
		this.touchstones = opts.touchstones || [];

		const stam = lookupAccess<number>(this.attributes, "stamina");
		Object.defineProperty(this.attributes, "stamina", {
			get: () => stam.get() + this._getAbility("resilience").level,
		});
		// set: (val: number) => stam.set(val - this._getAbility("resilience").level)

		const str = lookupAccess<number>(this.attributes, "strength");
		Object.defineProperty(this.attributes, "strength", {
			get: () => str.get() + this._getAbility("vigor").level,
		});
	}
}

// interface ISupernaturalCharacter {
// 	power: number;

// 	fuel: number;
// 	maxFuel: number;

// 	abilities: { [index: string]: Ability }
// }

// interface IHasIntegrity {
// 	integrityTrait: number;
// }

// interface IHasIntegrityTrack extends IHasIntegrity {
// 	integrityTrack?: number[];
// }

// interface IHasTouchstones {
// 	touchstones: { name: string; type?: string }[];
// }

// interface IEarnsBeats {
// 	beats: number;
// 	experience: number;
// }

// interface IPC extends IHasIntegrity, IEarnsBeats {
	
// }

export function createCharacter<T extends Character>(opts: T): T {
	const splat = SPLATS[opts.splat as unknown as EnumSplat] || SPLATS[EnumSplat.MORTAL];
	return new splat.characterFactory(opts) as T;
}