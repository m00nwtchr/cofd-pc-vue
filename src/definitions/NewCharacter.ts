import { Splat, SPLATS, EnumSplat } from ".";

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
	name: string;
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

interface ICharacter {
	name: string;

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
	initative: number;

	willpower: number;
	maxWillpower: number;
	spentWillpowerDots: number;

	// templates: EnumTemplate[];
	data: Map<string, unknown>;
}

// enum EnumTemplate {
// 	MAGE, WEREWOLF
// }

export class Character implements ICharacter {

	get splat(): Splat {
		return SPLATS[this.data.get("splat") as EnumSplat];
	}

	name = "";

	virtueAnchor = "";
	viceAnchor = "";

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
		return Math.min(this.attributes.dexterity, this.attributes.wits);
	}

	get initative(): number {
		return this.attributes.dexterity + this.attributes.composure;
	}

	// templates: EnumTemplate[];
	data: Map<string, unknown> = new Map();

	constructor(opts?: ICharacter) {
		opts = opts || {} as ICharacter;

		this.name = opts.name || "";

		this.virtueAnchor = opts.virtueAnchor || "";
		this.viceAnchor = opts.viceAnchor || "";

		this.willpower = opts.willpower || 0;
	
		this.data.set("attributes", opts.attributes || {} as Attributes);
		this.data.set("skills", opts.skills || {} as Skills);

		{
			const _getAttrs = () => this.data.get("attributes") as Attributes;
			const _setAttrs = (key: string, val: number) => this.data.set("attributes", Object.assign(_getAttrs(), {[key]: val}));
			const _defProp  = (key: string, func: () => number) => ({
				get: () => (_getAttrs()[key] || 1) + func(),
				set: (val: number) => _setAttrs(key, val - func())
			});

			this.attributes = Object.defineProperties({} as Attributes, {
				intelligence: _defProp("intelligence", () => 0),
				wits:         _defProp("wits",         () => 0),
				resolve:      _defProp("resolve",      () => 0),

				strength:     _defProp("strength",     () => 0),
				dexterity:    _defProp("dexterity",    () => 0),
				stamina:      _defProp("stamina",      () => 0),

				presence:     _defProp("presence",     () => 0),
				manipulation: _defProp("manipulation", () => 0),
				composure:    _defProp("composure",    () => 0),
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

		this.data.set("size", opts.size || 5);

		this.data.set("healthTrack", opts.healthTrack || []);

		this.data.set("spentWillpowerDots", opts.spentWillpowerDots || 0);
	}
}

interface IMortalCharacter extends ICharacter {
	
	specialties: { [index: string]: string[] };

	merits: { [key: string]: Ability };

	integrityTrait: number;

}

export class MortalCharacter extends Character implements IMortalCharacter {

	specialties: { [index: string]: string[] };
	
	merits: { [key: string]: Ability };

	integrityTrait: number;

	constructor(opts: IMortalCharacter) {
		super(opts);
		this.data.set("splat", EnumSplat.MORTAL);

		this.specialties = opts.specialties || {};
		this.merits = opts.merits || {};
		this.integrityTrait = opts.integrityTrait || 7;
	}

}

interface ISupernatural {

	power: number;

	maxFuel: number;
	fuel: number;

}

interface ISupernaturalCharacter extends IMortalCharacter, ISupernatural {}

class SupernaturalCharacter extends MortalCharacter implements ISupernaturalCharacter {

	power: number;
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
	}

}

interface IMageCharacter extends IMortalCharacter, ISupernatural {}

export class MageCharacter extends SupernaturalCharacter implements IMageCharacter {

	constructor(opts: IMageCharacter) {
		super(opts);
	}

}

// interface TemplateData {

// }

// const EnumTemplateData: {[key in EnumTemplate]: TemplateData} = {
// 	[EnumTemplate.MAGE]: {
// 	}
// };


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