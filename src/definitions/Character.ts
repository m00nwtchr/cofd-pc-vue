import deepmerge from "deepmerge";
import { computed, ComputedRef, isRef, reactive, Ref, ref, toRefs } from "vue";
import { Computed } from "vuex";
import { EnumSplat, Form, SPLATS } from "./Splat";

export interface Ability {
	name: string;
	level: number;
}

interface SplatTraits {
	abilities: Ability[];
	// finiteAbilities: boolean;
}

interface MageTraits extends SplatTraits {
	roteSkills: string[];
	abilities: Ability[];
}

// class VampireTraits implements SplatTraits {
// 	abilities: Ability[] = [
// 		{name: "Animalism", level: 0},
// 		{name: "Auspex", level: 0},
// 		{name: "Celerity", level: 0},
// 		{name: "Dominate", level: 0},
// 		{name: "Majesty", level: 0},
// 		{name: "Nightmare", level: 0},
// 		{name: "Obfuscate", level: 0},
// 		{name: "Protean", level: 0},
// 		{name: "Resilience", level: 0},
// 		{name: "Vigor", level: 0}
// 	];
// }

// class WerewolfTraits implements SplatTraits {
// 	abilities: Ability[] = [
// 		{name: "Cunning", level: 0},
// 		{name: "Glory", level: 0},
// 		{name: "Honor", level: 0},
// 		{name: "Purity", level: 0},
// 		{name: "Wisdom", level: 0}
// 	];
// }


// const TRAIT_SPLAT_MAP: {[index: number]: any} = {
// 	[EnumSplat.WEREWOLF]: WerewolfTraits,
// 	[EnumSplat.VAMPIRE]: VampireTraits,
// 	[EnumSplat.MAGE]: MageTraits,
// };

// function get(baseObj: any, traitName: string): Ref<any> {
// 	return computed(() => {
// 		return (baseObj as any)[traitName] || {};
// 	});
// }

// (window as any).get = get;
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
	} catch(e) {
		return 0;
	}
	// })();

	// return isRef(ret) ? ret : ref(ret);
	// });
}

function def<T>(func: () => T, def?: T): ComputedRef<T> {
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

	merits: {[index in number | string]: Ability} = [] as unknown as {[index in number | string]: Ability};

	// abilities: {[index: string]: Ability} = {};;
	// merits: {[index: string]: Ability} = {};


	healthTrack: number[] = [];
	maxHealth: ComputedRef<number>;

	willpower?: number;
	spentWillpowerDots = 0;
	// maxWillpower?: number;

	power = 1; // Gnosis/Primal Urge/Blood Potency

	fuel = 0;
	// maxFuel = 10;

	integrityTrait?= 7;

	touchstones: { name: string; type?: string }[] = [];

	conditions: string[] = [];

	baseSize = ref(5);
	size: ComputedRef<number>;

	defense: ComputedRef<number>;

	speed: ComputedRef<number>;
	// defense?: number;
	armor?: { general?: number; ballistic?: number } = {
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

	currentForm?: Ref<string> = undefined;
	currentFormObj!: ComputedRef<Form>;

	kuruthTriggers?: {passive: string; common: string; specific: string};

	getNum(arg: string) {
		return getNum.call(this, arg);
	}

	constructor(opts: Character) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		const vue = (window as any).vue;

		// const giantBonus = 

		let ablList: string[] = [];

		switch (opts.splat) {
		case (EnumSplat.VAMPIRE):
			ablList = ["Animalism", "Auspex", "Celerity", "Dominate", "Majesty", "Nightmare", "Obfuscate", "Protean", "Resilience", "Vigor"];
			break;
		case (EnumSplat.MAGE):
			// ablList = ["Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Spirit", "Space", "Time"];
			this.activeSpells = [];
			this.yantras = [];
			this.magicalTools = [];
			this.praxes = [];
			this.inuredSpells = [];
			
			this.rotes = [];
			break;
		case (EnumSplat.WEREWOLF):
			ablList = ["Purity", "Glory", "Honor", "Wisdom", "Cunning"];
			this.currentForm = ref("hishu");

			this.currentFormObj = computed(function() {
				return vue.splat.forms && self.currentForm ? vue.splat.forms[self.currentForm.value] : {
					name: "",
					desc: "",
					dexterityMod: 0,
					manipulationMod: 0,
					perceptionMod: 0,
					sizeMod: 0,
					staminaMod:0,
					strengthMod:0,
					speedMod: 0,
					traits: []
				};
			});
			this.kuruthTriggers = {passive: "", common: "", specific: ""};
			break;
		}

		const defaultAbl: { [index: string]: Ability } = {};

		Object.entries(SPLATS[opts.splat].abilities || {}).forEach((el) => {
			defaultAbl[el[0]] = {name: el[1], level: 0};
		});

		// ablList.forEach(el => {
		// 	defaultAbl[el.toLowerCase()] = { name: el, level: 0 };
		// });

		Object.assign(this, opts);

		this.abilities = reactive(Object.assign({}, defaultAbl, (this as any).abilities));
		
		console.log(defaultAbl);
		Object.keys(this.abilities).forEach(key => {
			const value = this.abilities[key];
			const def = defaultAbl[key];

			console.log(key, value.name, def);
			if (def && value.name != def.name) {
				value.name = def.name;
			}
		});
		
		this.abilities = sortObj(this.abilities);
		console.log(Object.entries(this.abilities));

		this.baseAttributes = reactive(this.baseAttributes);
		
		if (this.currentForm && !isRef(this.currentForm)) {
			this.currentForm = ref(this.currentForm);
		}

		// console.log(toRefs(this));

		// console.log((this.abilityArr as any).value);

		// if (typeof this.baseSize === "number") {
		// 	this.baseSize = ref(this.baseSize);
		// }

		// this.abilities = computed(() => {
		// 	const obj: {[index: string]: Ability} = {};
		// 	(self.abilityArr as Ref<Ability[]>).value.forEach((el: { name: string; level: number}) => {
		// 		obj[el.name.toLowerCase()] = {level: el.level, name: el.name};
		// 	});
		// 	return obj;
		// });

		console.log(this.abilities);


		this.attributes = computed(function() {
			return {
				intelligence: self.baseAttributes.intelligence,
				wits: self.baseAttributes.wits,
				resolve: self.baseAttributes.resolve,

				strength : self.baseAttributes.strength  + def(() => self.currentFormObj.value.strengthMod).value + def(() => self.abilities.vigor.level).value,
				dexterity: self.baseAttributes.dexterity + def(() => self.currentFormObj.value.dexterityMod).value,
				stamina  : self.baseAttributes.stamina   + def(() => self.currentFormObj.value.staminaMod).value  + def(() => self.abilities.resilience.level).value,//((self.abilities.value.resilience || {}).level || 0),//vue.getNum("this.character.abilities.value.resilience.level"),

				presence: self.baseAttributes.presence,
				manipulation: self.baseAttributes.manipulation + def(() => self.currentFormObj.value.manipulationMod).value,
				composure: self.baseAttributes.composure,
			};
		}/*,set(val) {
			console.log(val);
			self.baseAttributes.value = {
				intelligence: val.intelligence,
				wits: val.wits,
				resolve: val.resolve,

				strength : val.strength  - vue.getNum("this.currentForm.strengthMod") - self.abilities.value.vigor.level,
				dexterity: val.dexterity - vue.getNum("this.currentForm.dexterityMod"),
				stamina  : val.stamina   - vue.getNum("this.currentForm.staminaMod")  - self.abilities.value.resilience.level,

				presence: val.presence,
				manipulation: val.manipulation - vue.getNum("this.currentForm.manipulationMod"),
				composure: val.composure,
			};
		}}*/);

		const giantMod = def(() => self.merits.giant.level >= 3 ? 1 : 0);
		const sizeMod = def(() => self.currentFormObj.value.sizeMod);
		this.size = computed({
			get() {
				return self.baseSize.value + sizeMod.value + giantMod.value;
			},
			set(val) {
				self.baseSize.value = val - sizeMod.value - giantMod.value;
			}
		});

		this.maxHealth = computed(function() {
			let val = self.attributes.value.stamina + self.size.value;
			
			if (self.splat === EnumSplat.WEREWOLF) {
				if (self.subType.toLowerCase() === "rahu") {
					const purity = def(() => self.abilities.purity.level, 0).value;
					val += purity >= 2 ? purity : 0;
				}
			}

			return val;
		});
		
		this.speed = computed(function() {
			// this.getNum;
			return self.attributes.value.strength + self.attributes.value.dexterity + 5 + def(() => self.abilities.celerity.level).value + def(() => self.currentFormObj.value.speedMod).value;
		});

		this.defense = computed(function() {
			console.log(def(() => self.skills.athletics));
			return Math.min(self.attributes.value.dexterity, self.attributes.value.wits) + def(() => self.skills.athletics).value;
		});
	}

	// splatTraits: {
	// 	// [index: number]: SplatTraits;
	// 	[EnumSplat.MORTAL]: undefined;
	// 	[EnumSplat.WEREWOLF]: SplatTraits;
	// 	[EnumSplat.MAGE]: MageTraits;
	// 	[EnumSplat.VAMPIRE]: SplatTraits;
	// } = {
	// 	[EnumSplat.MORTAL]: undefined,
	// 	[EnumSplat.VAMPIRE]: {
	// 		abilities: [
	// 			{name: "Animalism", level: 0},
	// 			{name: "Auspex", level: 0},
	// 			{name: "Celerity", level: 0},
	// 			{name: "Dominate", level: 0},
	// 			{name: "Majesty", level: 0},
	// 			{name: "Nightmare", level: 0},
	// 			{name: "Obfuscate", level: 0},
	// 			{name: "Protean", level: 0},
	// 			{name: "Resilience", level: 0},
	// 			{name: "Vigor", level: 0}
	// 		],
	// 	},
	// 	[EnumSplat.MAGE]: {
	// 		abilities: [
	// 			{name: "Death", level: 0},
	// 			{name: "Fate", level: 0},
	// 			{name: "Forces", level: 0},
	// 			{name: "Life", level: 0},
	// 			{name: "Matter", level: 0},
	// 			{name: "Mind", level: 0},
	// 			{name: "Prime", level: 0},
	// 			{name: "Spirit", level: 0},				
	// 			{name: "Space", level: 0},
	// 			{name: "Time", level: 0}
	// 		],
	// 		roteSkills: []

	// 	},
	// 	[EnumSplat.WEREWOLF]: {
	// 		abilities: [
	// 			{name: "Cunning", level: 0},
	// 			{name: "Glory", level: 0},
	// 			{name: "Honor", level: 0},
	// 			{name: "Purity", level: 0},
	// 			{name: "Wisdom", level: 0}
	// 		],
	// 	},
	// };
}