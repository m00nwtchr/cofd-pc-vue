import _ from "lodash";
import { reactive } from "vue";
import { Splat, SPLATS, EnumSplat, Organization, SubType, MERITS, Merit, Modifier } from ".";

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
	perception: number;

	willpower: number;
	maxWillpower: number;
	spentWillpowerDots: number;

	mod(string: string): number;

	data: Map<string, unknown>;
}

export class Character implements ICharacter {

	get splat(): Splat {
		return SPLATS[this.data.get("splat") as EnumSplat] || {
			name: "",
			organizations: {},
			subTypes: {}
		};
	}

	set splat(val: Splat) {
		this.data.set("splat", val.enum);
	}

	name: string;

	concept: string;
	chronicle: string;

	virtueAnchor: string;
	viceAnchor: string;

	get organization(): Organization {
		return this.splat.organizations[this.data.get("organization") as string] || Object.defineProperties({}, {
			name: {
				get: () => this.data.get("organization"),
				set: (val: string) => this.data.set("organization", val)
			}
		});
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
		const track = Object.assign(new Array(this.maxHealth || 0).fill(0), ogTrack);

		if (this.maxHealth < track.length) {
			const deleted = track.splice(this.maxHealth - 1, track.length - this.maxHealth);
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

	// size: number;

	get size(): number {
		return this.data.get("size") as number;
	}

	set size(val: number) {
		this.data.set("size", val);
	}

	get speed(): number {
		return this.attributes.strength + this.attributes.dexterity + 5;
	}

	get defense(): number {
		return Math.min(this.attributes.dexterity, this.attributes.wits) + this.skills.athletics;
	}

	get perception(): number {
		return this.attributes.wits + this.attributes.composure;
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
		if (typeof opts.splat === "number") {
			this.data.set("splat", opts.splat);
		} else if (typeof opts.splat === "object" && typeof opts.splat.enum === "number") {
			this.data.set("splat", opts.splat.enum);
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

		this.data.set("attributes", Object.assign({
			intelligence: 1,
			wits: 1,
			resolve: 1,
			strength: 1,
			dexterity: 1,
			stamina: 1,
			presence: 1,
			manipulation: 1,
			composure: 1
		} as Attributes, opts.attributes));
		this.data.set("skills", opts.skills || {} as Skills);

		{
			const _getAttrs = () => this.data.get("attributes") as Attributes;
			const _setAttrs = (key: string, val: number) => this.data.set("attributes", Object.assign(_getAttrs(), { [key]: val }));
			const _defProp = (key: string) => ({
				get: () => (_getAttrs()[key] || 1) + this.mod(key),
				set: (val: number) => _setAttrs(key, val - this.mod(key)),
				configurable: true
			});

			this.attributes = Object.defineProperties({} as Attributes, {
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

		{
			const _getSkills = () => this.data.get("skills") as Skills;
			const _setSkill = (key: string, val: number) => this.data.set("skills", Object.assign(_getSkills(), { [key]: val }));

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
			const _setAttrs = (key: string, val: number) => this.data.set("armor", Object.assign(_getAttrs(), { [key]: val }));
			const _defProp = (key: string, func: () => number) => ({
				get: () => (_getAttrs()[key] || 0) + func(),
				set: (val: number) => _setAttrs(key, val - func())
			});

			this.armor = Object.defineProperties({} as Armor, {
				general: _defProp("general", () => 0),
				ballistic: _defProp("ballistic", () => 0),
			});
		}

		// this.size = opts.size || 5;
		this.data.set("size", opts.size || 5);

		this.data.set("healthTrack", opts.healthTrack || []);

		this.data.set("spentWillpowerDots", opts.spentWillpowerDots || 0);
	}

	getData(): any {
		const clone = Object.assign({}, this);
		this.data.forEach((val, key) => {
			(clone as any)[key] = val;
		});
		return clone;
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


const MERIT_CACHE: {
	[key: string]: {
		[index: string]: Merit
	}
} = {};

export class MortalCharacter extends Character implements IMortalCharacter {

	specialties: { [index: string]: string[] };

	beats: number;
	experience: number;

	// merits: { [key: string]: Ability };
	get merits(): { [key: string]: Ability } {
		const data = this.data.get("merits") as { [key: string]: Ability };

		const obj = _.clone(data);

		if (!MERIT_CACHE[this.id]) MERIT_CACHE[this.id] = {};

		Object.entries(data).forEach(([key, value]) => {
			const meritKey = key.includes("(") ? key.substr(0, key.indexOf("(") - 1) : key;

			const m = MERITS[meritKey];
			const cache = MERIT_CACHE[this.id][key];

			if (cache) {
				obj[key] = cache;
			} else if (m) {
				const merit = new m(this, value);
				MERIT_CACHE[this.id][key] = merit;

				obj[key] = merit;
			}
		});

		return reactive(obj);
	}

	set merits(val: { [key: string]: Ability }) {
		this.data.set("merits", val);
	}

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

		return obj;
	}

	get size(): number {
		return super.size + (this.meritTraitMods.size || 0);
	}

	set size(val: number) {
		super.size = val - (this.meritTraitMods.size || 0);
	}

	integrityTrait: number;

	private id: string;
	constructor(opts: IMortalCharacter) {
		super(opts);
		this.id = (opts as any).id || "";
		this.data.set("merits", opts.merits || {});

		this.beats = opts.beats || 0;
		this.experience = opts.experience || 0;

		this.specialties = opts.specialties || {};
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
		return this.abilities[key] || { level: 0, name: "" };
	}
}

interface IMageCharacter extends IMortalCharacter, ISupernatural {

	roteSkills: string[];

	activeSpells: string[];
	yantras: string[];
	magicalTools: string[];
	praxes: string[];
	inuredSpells: string[];
	nimbus: string[];

	attainments: string[];
	legacyAttainments: string[];

	rotes: Rote[];
}


export class Rote {
	arcanum: string;
	level: number;
	spell: string;
	creator?: string;
	roteSkill: string;

	constructor(opts: Rote) {
		opts = opts || {};
		this.arcanum = opts.arcanum || "";
		this.level = opts.level || 0;

		this.spell = opts.spell || "";
		this.creator = opts.creator || "";

		this.roteSkill = opts.roteSkill || "";
	}
}

export class MageCharacter extends SupernaturalCharacter implements IMageCharacter {

	// roteSkills: string[];

	activeSpells: string[];
	yantras: string[];
	magicalTools: string[];
	praxes: string[];
	inuredSpells: string[];
	nimbus: string[];

	attainments: string[];
	legacyAttainments: string[];

	rotes: Rote[];

	get roteSkills(): string[] {
		return this.organization.skills || this.data.get("roteSkills") as string[] || [];
	}

	constructor(opts: IMageCharacter) {
		super(opts);

		this.activeSpells = opts.activeSpells || [];
		this.yantras = opts.yantras || [];
		this.magicalTools = opts.magicalTools || [];
		this.praxes = opts.praxes || [];
		this.inuredSpells = opts.inuredSpells || [];
		this.nimbus = opts.nimbus || [];

		this.attainments = opts.attainments || [];
		this.legacyAttainments = opts.legacyAttainments || [];


		this.rotes = opts.rotes || [];

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
		set: desc.set || ((val: T) => { })
	} as {
		get: () => T,
		set: (val: T) => void
	};
}

// function lookupAccessObj<T>(obj: any) {
// 	Object.getOwnPropertyDescriptors(obj);
// }

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

interface IWerewolfCharacter extends IMortalCharacter, ISupernatural, IHasTouchstones {
	currentForm: Form;
	// baseFormMods!: { [key: string]: FormMods };

	kuruthTriggers: { passive: string; common: string; specific: string };

	huntersAspect: string;

	moonGift1: Ability;
	moonGift2: Ability;

	moonGifts: { [key: string]: Ability };

	shadowGifts: string[];
	wolfGifts: string[];

	rites: string[];
}

export interface FormMods {
	intelligenceMod: number;
	witsMod: number;
	resolveMod: number;

	strengthMod: number;
	dexterityMod: number;
	staminaMod: number;

	presenceMod: number;
	manipulationMod: number;
	composureMod: number;

	sizeMod: number;
	speedMod: number;

	perceptionMod: number;

	defenseCalcMax?: boolean;
	defenseMod?: number;

	armorMod: Armor;
}

export interface Form extends FormMods {
	name: string;
	desc: string;
	traits: string[];

	[index: string]: any;
}


export class WerewolfCharacter extends SupernaturalCharacter implements IWerewolfCharacter {

	// currentForm: Form;
	get currentForm(): Form {
		return this.forms[this.data.get("currentForm") as string] || {};
	}

	get forms(): { [key: string]: Form } {
		return (SPLATS[EnumSplat.WEREWOLF] as any).forms as { [key: string]: Form };
	}

	get size(): number {
		return super.size + this.currentForm.sizeMod;
	}

	set size(val: number) {
		super.size = val - this.currentForm.sizeMod;
	}

	get speed(): number {
		return super.speed + this.currentForm.speedMod;
	}

	get maxHealth(): number {
		return super.maxHealth + (this.moonGifts.full.level >= 2 ?
			this.abilities.purity.level : 0)
	}

	kuruthTriggers: { passive: string; common: string; specific: string; };
	huntersAspect: string;

	// moonGift1: Ability;

	get moonGift1(): Ability {
		if (this.subType.name) {
			const key = (this.subType.moonGifts as string[])[0];
			const renown = this.subType.abilities[0];

			return {
				// name: "splat.werewolf.gift.moon." + key,
				key,
				level: this.abilities[renown].level
			} as Ability;
		}
		return this.data.get("moonGift1") as Ability || { name: "", key: "", level: 0 } as Ability;
	}
	set moonGift1(val: Ability) {
		if (!this.subType.name) {
			this.data.set("moonGift1", val);
		}
	}

	moonGift2: Ability;

	get moonGifts(): { [key: string]: Ability } {
		if (!this.moonGift2.key) this.moonGift2.key = "NEW";
		return {
			[this.moonGift1.key || ""]: this.moonGift1,
			[this.moonGift2.key || ""]: this.moonGift2,
		};
	}

	shadowGifts: string[];
	wolfGifts: string[];
	rites: string[];

	touchstones: string[];

	get perception(): number {
		return super.perception + this.currentForm.perceptionMod;
	}

	constructor(opts: IWerewolfCharacter) {
		super(opts);
		this.touchstones = opts.touchstones || [];

		this.data.set("currentForm", opts.currentForm || "hishu");

		this.kuruthTriggers = opts.kuruthTriggers || {
			passive: "",
			common: "",
			specific: ""
		};
		this.huntersAspect = opts.huntersAspect || "";

		this.moonGift2 = opts.moonGift2 || { name: "", level: 0 };

		this.shadowGifts = opts.shadowGifts || [];
		this.wolfGifts = opts.wolfGifts || [];
		this.rites = opts.rites || [];

		const descs = Object.getOwnPropertyDescriptors(this.attributes);

		const _defProp = (key: string, func: () => number) => ({
			get: () => ((descs[key].get || (() => 0))() || 1) + func(),
			set: (val: number) => (descs[key].set || (() => 0))(val - func()),
			configurable: true
		});
		this.attributes = Object.defineProperties(this.attributes, {
			intelligence: _defProp("intelligence", () => this.currentForm.intelligenceMod),
			wits: _defProp("wits", () => this.currentForm.witsMod),
			resolve: _defProp("resolve", () => this.currentForm.resolveMod),

			strength: _defProp("strength", () => this.currentForm.strengthMod),
			dexterity: _defProp("dexterity", () => this.currentForm.dexterityMod),
			stamina: _defProp("stamina", () => this.currentForm.staminaMod),

			presence: _defProp("presence", () => this.currentForm.presenceMod),
			manipulation: _defProp("manipulation", () => this.currentForm.manipulationMod),
			composure: _defProp("composure", () => this.currentForm.composureMod),
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
	try {
		const splat = SPLATS[opts.splat as unknown as EnumSplat] || SPLATS[EnumSplat.MORTAL];
		return reactive(new splat.characterFactory(opts) as any) as T;
	} catch (e) {
		console.error(e);
	}
}