// import deepmerge from "deepmerge";
import { computed, ComputedRef, isRef, reactive, Ref, ref, toRefs, unref, watch, WritableComputedRef } from "vue";
import Merit, { MERITS } from "./Merit";
import { EnumSplat, Form, FormMods, SPLATS } from "./Splat";

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
	name: string;
	level: number;
}


function sortObj(obj: any) {
	return Object.keys(obj).sort().reduce((result, key) => {
		(result as any)[key] = obj[key];
		return result;
	}, {});
}

export function getNum(val: string): number {
	// return computed(() => {
	// const ret = (() => {
	try {
		return eval(val) || 0;
	} catch (e) {
		return 0;
	}
	// })();

	// return isRef(ret) ? ret : ref(ret);
	// });
}

export function nameToKey(name: string) {
	return name.trim().toLowerCase().replaceAll(" ", "_");//.replaceAll("(", "_").replaceAll(")", "_");
}

export function keyToName(key: string) {
	return key.replaceAll("_", " ");
}

export function def<T>(func: () => T, def?: T): ComputedRef<T> {
	if (!def) def = 0 as any;
	return computed(() => {
		try {
			const val = func();
			// console.log(def);
			// if (def === undefined) {
			// 	if (typeof val === "number") {
			// 		def = 0 as any;
			// 	}
			// }
			// console.log(val, typeof val);

			return val || def;
		} catch (e) {
			return def || 0;
		}
	}) as any;
	// try {
	// 	return func() || def;
	// } catch (e) {
	// 	return def;
	// }
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

// interface IntegrityTrack {}

export interface Armor {
	general?: number;
	ballistic?: number;
}

export interface TraitMod {
	trait?: string;
	mod?: Ref<number> | number;
	func?: (traitName: string) => Ref<number> | number;
}

export default class Character {
	name!: string;
	age?: number;

	player?: string;
	chronicle?: string;

	virtueAnchor!: string;
	viceAnchor!: string;

	concept?: string;

	splat!: EnumSplat;

	subType!: string; // Clan/Auspice/Path

	faction?: string; // Cabal/Coterie/Pack
	organization!: string; // Order/Covenant/Tribe

	legacy?: string; // Legacy/Bloodline/Lodge

	baseAttributes!: Attributes;
	attributes: ComputedRef<Attributes>;

	skills: { [index: string]: number } = {};
	specialties: { [index: string]: string[] } = {};

	// abilityArr: Ability[] | Ref<Ability[]>;
	abilities: { [index: string]: Ability };

	merits: { [key in number | string]: Ability | Merit } = {};

	// abilities: {[index: string]: Ability} = {};;
	// merits: {[index: string]: Ability} = {};


	healthTrack: number[] = [];
	woundPenalty: ComputedRef<number>;
	maxHealth: ComputedRef<number>;

	willpower?: number;
	spentWillpowerDots = 0;
	// maxWillpower?: number;

	power = 1; // Gnosis/Primal Urge/Blood Potency

	fuel = 0;
	// maxFuel = 10;

	integrityTrait: Ref<number> = ref(7);
	integrityTrack?: number[];

	touchstones: { name: string; type?: string }[] = [];

	conditions: string[] = [];

	baseSize = 5;
	size: ComputedRef<number>;

	defenseCalcMax: ComputedRef<boolean>;
	defense: ComputedRef<number>;

	speed: ComputedRef<number>;

	armor: ComputedRef<Armor>;
	baseArmor: Armor = {
		general: 0,
		ballistic: 0
	};

	weapons: {
		name: string;
		damage: string;
		range: string;
		clip: string;
		initative: number;
		strength: number;
		size: number;
	}[] = [
			{
				name: "",
				damage: "",
				range: "",
				clip: "",
				initative: 0,
				strength: 0,
				size: 0,
			}
		];

	// initative?: number;

	beats?= 0;
	experience?= 0;

	alternateBeats?= 0;
	alternateExperience?= 0;

	traitMods: ComputedRef<TraitMod[]> = computed(() => {
		const meritMods = Object.keys(this.merits)
			.map((key) => this.merits[key])
			.filter(el => (el as any).getOptions)
			.flatMap((el) => (el as Merit).getTraitMods(this));

		return [...this.getTraitMods(), ...meritMods];
	});

	getNum(arg: string) {
		return getNum.call(this, arg);
	}

	constructor(opts: Character) {
		if (SPLATS[opts.splat].integrityTrackType === "healthTrack") {
			this.integrityTrack = [];
		}

		{
			const defaultAbl: { [index: string]: Ability } = {};

			Object.entries(SPLATS[opts.splat].abilities || {}).forEach((el) => {
				defaultAbl[el[0]] = { name: el[1], level: 0 };
			});
			Object.assign(this, opts);

			this.integrityTrait = ref(this.integrityTrait);

			this.merits = reactive(this.merits);

			// const arr: string[] = [];

			// watch(
			// 	() => Object.keys(this.merits),
			// 	(keys, prevKeys) => {
			// 		console.log("merits");

			// 		const newKeys = keys.filter(x => prevKeys.includes(x));

			// 		newKeys.forEach(key => {
			// 			const val = this.merits[key];

			// 			const m = MERITS[key];

			// 			if (!(val as Merit).getOptions && m) {
			// 				const meritObj = new m(this, val);

			// 				// arr.push(key);

			// 				this.merits[key] = meritObj;
			// 			}
			// 		});

			// 		// // Object.values(val).forEach(value => {
			// 		// 	let key = nameToKey(value.name);

			// 		// 	if (key.includes("(")) {
			// 		// 		key = key.substr(0, key.indexOf("(")-1);
			// 		// 	}

			// 		// 	const m = MERITS[key];

			// 		// 	// if ((value as Merit).getOptions) {
			// 		// 	// 	console.log("replace", value.name, val, prevVal);
			// 		// 	// }

			// 		// 	if (!arr.includes(key) && !(value as any).getOptions && m) {
			// 		// 		const meritObj = new m(this, value);
			// 		// 		// Object.assign(m, value);

			// 		// 		arr.push(key);

			// 		// 		this.merits[key] = meritObj;
			// 		// 		console.log(this.merits[key]);
			// 		// 	}
			// 		// });
			// 	},
			// 	{ deep: true }
			// );

			let ablTemp = Object.assign({}, defaultAbl, (this as any).abilities);

			const custom: any = {};

			Object.keys(ablTemp).forEach(key => {
				const value = ablTemp[key];
				const def = defaultAbl[key];

				if (!def) {
					custom[key] = value;
					delete ablTemp[key];
				} else if (value.name != def.name) {
					value.name = def.name;
				}
			});

			ablTemp = sortObj(ablTemp);

			Object.entries(custom)
				.forEach(entry => ablTemp[entry[0]] = entry[1]);

			this.abilities = reactive(ablTemp);
		}

		Object.values(this.merits).forEach(value => {
			let key = nameToKey(value.name);

			if (key.includes("(")) {
				key = key.substr(0, key.indexOf("(") - 1);
			}

			const m = MERITS[key];

			if (!(value as Merit).getOptions && m) {
				const meritObj = new m(this, value);
				// Object.assign(m, value);

				this.merits[key] = meritObj;
			}
		});


		this.baseAttributes = reactive(this.baseAttributes);

		this.attributes = computed(() => {
			return {
				intelligence: this.baseAttributes.intelligence + this.mod("intelligence"),
				wits: this.baseAttributes.wits + this.mod("wits"),
				resolve: this.baseAttributes.resolve + this.mod("resolve"),

				strength: this.baseAttributes.strength + this.mod("strength"),
				dexterity: this.baseAttributes.dexterity + this.mod("dexterity"),
				stamina: this.baseAttributes.stamina + this.mod("stamina"),//((self.abilities.value.resilience || {}).level || 0),//vue.getNum("this.character.abilities.value.resilience.level"),

				presence: this.baseAttributes.presence + this.mod("presence"),
				manipulation: this.baseAttributes.manipulation + this.mod("manipulation"),
				composure: this.baseAttributes.composure + this.mod("composure"),
			};
		});

		this.size = computed({
			get: () => {
				// console.log(this.baseSize, this.mod("size"));
				return this.baseSize + this.mod("size");
			},
			set: (val) => {
				this.baseSize = val - this.mod("size");
			}
		});

		this.woundPenalty = computed(() => {
			return Math.min((this.healthTrack[this.healthTrack.length - 1] !== 0 ?
				-3 : this.healthTrack[this.healthTrack.length - 2] !== 0 ?
					-2 : this.healthTrack[this.healthTrack.length - 3] !== 0 ?
						-1 : 0)+this.mod("woundPenalty"), 0);
		});

		this.maxHealth = computed(() => {
			return this.attributes.value.stamina + this.size.value + this.mod("health");
		});

		this.speed = computed(() => {
			return this.attributes.value.strength + this.attributes.value.dexterity + 5 + this.mod("speed");
		});

		this.defenseCalcMax = computed(() => {
			return this.mod("defenseCalcMax") as boolean;
		});
		this.defense = computed(() => {
			return (this.defenseCalcMax ? Math.max : Math.min)(this.attributes.value.dexterity, this.attributes.value.wits) + def(() => this.skills.athletics).value + this.mod("defense");
		});

		this.armor = computed(() => {
			return {
				general: this.baseArmor.general + this.mod("generalArmor"),
				ballistic: this.baseArmor.ballistic + this.mod("ballisticArmor")
			};
		});
	}

	getTraitMods(): TraitMod[] {
		return [];
	}

	mod(traitName: string) {
		const na = traitName.toLowerCase();

		return unref(this.traitMods)
			.filter(el => el.trait && el.trait.toLowerCase() === na)
			.map(el => el.mod)
			.reduce((prev: any, val: any) => prev + unref(val), 0) || 0;
	}

	getData() {
		const obj = Object.assign({}, this) as any;

		delete obj.traitMods;

		return obj;
	}
}

export class MageCharacter extends Character {
	activeSpells!: string[];
	yantras!: string[];
	magicalTools!: string[];
	praxes!: string[];
	inuredSpells!: string[];

	rotes!: {
		arcanum: string;
		level: number;
		spell: string;
		creator?: string;
		roteSkill: string;
	}[];

	constructor(opts: MageCharacter) {
		super(opts as any);

		this.activeSpells = [];
		this.yantras = [];
		this.magicalTools = [];
		this.praxes = [];
		this.inuredSpells = [];

		this.rotes = [];
	}
}

export class VampireCharacter extends Character {
	constructor(opts: VampireCharacter) {
		super(opts as any);
	}

	getTraitMods() {
		return super.getTraitMods().concat([
			{ trait: "stamina", mod: def(() => this.abilities.resilience.level) },
			{ trait: "strength", mod: def(() => this.abilities.vigor.level) },

			{ trait: "defense", mod: def(() => this.abilities.celerity.level) }
		]);
	}
}

export class WerewolfCharacter extends Character {

	currentForm: Ref<string> = ref("hishu");
	baseFormMods!: { [key: string]: FormMods };

	kuruthTriggers?: { passive: string; common: string; specific: string };

	constructor(opts: WerewolfCharacter) {
		super(opts);

		this.baseFormMods = opts.baseFormMods || {};
		this.kuruthTriggers = Object.assign({
			passive: "",
			common: "",
			specific: ""
		}, this.kuruthTriggers);
	}

	getTraitMods() {
		return super.getTraitMods().concat([
			{
				trait: "health", mod: def(() => {
					if (this.subType.toLowerCase() === "rahu") {
						const purity = def(() => this.abilities.purity.level, 0).value;
						return purity >= 2 ? purity : 0;
					}
					return 0;
				})
			},
			...ATTRIBUTES.flat().map(attr => {
				return { trait: attr, mod: def(() => (this.currentFormObj().value as any)[attr + "Mod"]) };
			}),
			{ trait: "size", mod: def(() => this.currentFormObj().value.sizeMod) },
			{ trait: "speed", mod: def(() => this.currentFormObj().value.speedMod) },
			{ trait: "perception", mod: def(() => this.currentFormObj().value.perceptionMod) },

			{ trait: "ballisticArmor", mod: def(() => this.currentFormObj().value.armorMod.ballistic || 0) },
			{ trait: "defenseCalcMax", mod: def(() => this.currentFormObj().value.defenseCalcMax) },

			{ trait: "generalArmor", mod: def(() => this.currentFormObj().value.armorMod.general || 0) },
			{ trait: "ballisticArmor", mod: def(() => this.currentFormObj().value.armorMod.ballistic || 0) },
		]);
	}

	currentFormObj(): WritableComputedRef<Form> {
		return this.getForm(this.currentForm);
	}

	getForm(name: Ref<string> | string): WritableComputedRef<Form> {
		const vue = (window as any).vue;

		return computed({
			get: () => {
				const key = isRef(name) ? name.value : name;

				const form = vue.splat.forms[key] || {
					name: "",
					desc: "",

					intelligenceMod: 0,
					witsMod: 0,
					resolveMod: 0,

					strengthMod: 0,
					staminaMod: 0,
					dexterityMod: 0,

					presenceMod: 0,
					manipulationMod: 0,
					composureMod: 0,

					sizeMod: 0,
					speedMod: 0,
					perceptionMod: 0,

					traits: []
				};

				const baseMod: FormMods = Object.assign({
					intelligenceMod: 0,
					witsMod: 0,
					resolveMod: 0,

					strengthMod: 0,
					staminaMod: 0,
					dexterityMod: 0,

					presenceMod: 0,
					manipulationMod: 0,
					composureMod: 0,

					sizeMod: 0,
					speedMod: 0,
					perceptionMod: 0,

					armorMod: {}
				}, this.baseFormMods[key]);

				// self.baseFormMods[key] = baseMod;

				return Object.assign({}, form, {
					intelligenceMod: form.intelligenceMod + baseMod.intelligenceMod + this.mod(key + "IntelligenceMod"),
					witsMod: form.witsMod + baseMod.witsMod + this.mod(key + "WitsMod"),
					resolveMod: form.resolveMod + baseMod.resolveMod + this.mod(key + "ResolveMod"),

					strengthMod: form.strengthMod + baseMod.strengthMod + this.mod(key + "StrengthMod"),
					dexterityMod: form.dexterityMod + baseMod.dexterityMod + this.mod(key + "DexterityMod"),
					staminaMod: form.staminaMod + baseMod.staminaMod + this.mod(key + "StaminaMod"),

					presenceMod: form.presenceMod + baseMod.presenceMod + this.mod(key + "PresenceMod"),
					manipulationMod: form.manipulationMod + baseMod.manipulationMod + this.mod(key + "ManipulationMod"),
					composureMod: form.composureMod + baseMod.composureMod + this.mod(key + "ComposureMod"),

					sizeMod: form.sizeMod + baseMod.sizeMod + this.mod(key + "SizeMod"),
					speedMod: form.speedMod + baseMod.speedMod + this.mod(key + "SpeedMod"),
					perceptionMod: form.perceptionMod + baseMod.perceptionMod + this.mod(key + "PerceptionMod"),

					defenseCalcMax: this.mod(key + "DefenseCalcMax") as boolean,
					defenseMod: this.mod(key + "DefenseMod"),

					armorMod: {
						general: (form.armorMod.general || 0) + (baseMod.armorMod.general || 0) + this.mod(key + "generalArmorMod"),
						ballistic: (form.armorMod.ballistic || 0) + (baseMod.armorMod.ballistic || 0) + this.mod(key + "ballisticArmorMod")
					}
				});
			},
			set: (val) => {
				const key = isRef(name) ? name.value : name;

				const form = vue.splat.forms[key] || {
					name: "",
					desc: "",

					strengthMod: 0,
					staminaMod: 0,
					dexterityMod: 0,
					manipulationMod: 0,

					sizeMod: 0,
					speedMod: 0,
					perceptionMod: 0,

					traits: []
				};

				val = Object.assign({}, form, val);

				this.baseFormMods[key] = Object.assign({}, {
					intelligenceMod: val.intelligenceMod - form.intelligenceMod - this.mod(key + "IntelligenceMod"),
					witsMod: val.witsMod - form.witsMod - this.mod(key + "WitsMod"),
					resolveMod: val.resolveMod - form.resolveMod - this.mod(key + "ResolveMod"),

					strengthMod: val.strengthMod - form.strengthMod - this.mod(key + "StrengthMod"),
					staminaMod: val.staminaMod - form.staminaMod - this.mod(key + "DexterityMod"),
					dexterityMod: val.dexterityMod - form.dexterityMod - this.mod(key + "StaminaMod"),

					presenceMod: val.presenceMod - form.presenceMod - this.mod(key + "PresenceMod"),
					manipulationMod: val.manipulationMod - form.manipulationMod - this.mod(key + "ManipulationMod"),
					composureMod: val.composureMod - form.composureMod - this.mod(key + "ComposureMod"),

					sizeMod: val.sizeMod - form.sizeMod - this.mod(key + "SizeMod"),
					speedMod: val.speedMod - form.speedMod - this.mod(key + "SpeedMod"),
					perceptionMod: val.perceptionMod - form.perceptionMod - this.mod(key + "PerceptionMod"),

					armorMod: {
						general: (val.armorMod.general || 0) - (form.armorMod.general || 0) - this.mod(key + "generalArmorMod"),
						ballistic: (val.armorMod.ballistic || 0) - (form.armorMod.ballistic || 0) - this.mod(key + "ballisticArmorMod"),
					}
				});
			}
		});
	}

	getForms() {
		const vue = (window as any).vue;
		const forms: { [key: string]: Form } = {};

		Object.keys(vue.splat.forms)
			.forEach(el => forms[el] = this.getForm(el) as any);

		return reactive(forms);
	}
}

export class ChangelingCharacter extends Character {
	constructor(opts: ChangelingCharacter) {
		super(opts as any);

		this.integrityTrait = computed(() => this.attributes.value.wits + this.attributes.value.composure);
	}
}

export function createCharacter<T extends Character>(opts: T): T {
	return new SPLATS[opts.splat].characterFactory(opts) as T;
}