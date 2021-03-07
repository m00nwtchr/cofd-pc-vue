import deepmerge from "deepmerge";
import { computed, ComputedRef, Ref, ref, toRefs } from "vue";
import { Computed } from "vuex";
import { EnumSplat, Form } from "./Splat";

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

	baseAttributes!: Ref<Attributes>;
	attributes: ComputedRef<Attributes>;

	skills: { [index: string]: number } = {};

	// abilityArr: Ability[] | Ref<Ability[]>;
	abilities: Ref<{ [index: string]: Ability }>;

	merits: Ability[] = [];

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

	// initative?: number;

	beats?= 0;
	experience?= 0;

	alternateBeats?= 0;
	alternateExperience?= 0;

	roteSkills: string[] = [];

	currentForm?: string = undefined;

	kuruthTriggers?: {passive: string; common: string; specific: string};

	constructor(opts: Character) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		// const giantBonus = 

		let ablList: string[] = [];

		switch (opts.splat) {
		case (EnumSplat.VAMPIRE):
			ablList = ["Animalism", "Auspex", "Celerity", "Dominate", "Majesty", "Nightmare", "Obfuscate", "Protean", "Resilience", "Vigor"];
			break;
		case (EnumSplat.MAGE):
			ablList = ["Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Spirit", "Space", "Time"];
			break;
		case (EnumSplat.WEREWOLF):
			ablList = ["Purity", "Glory", "Honor", "Wisdom", "Cunning"];
			this.currentForm = "hishu";
			this.kuruthTriggers = {passive: "", common: "", specific: ""};
			break;
		}

		const defaultAbl: { [index: string]: Ability } = {};

		ablList.forEach(el => {
			defaultAbl[el.toLowerCase()] = { name: el, level: 0 };
		});

		Object.assign(this, opts);

		this.abilities = ref(Object.assign({}, defaultAbl, (this as any).abilities));
		this.baseAttributes = ref(this.baseAttributes);

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

		const vue = (window as any).vue;

		this.attributes = computed(function() {
			return {
				intelligence: self.baseAttributes.value.intelligence,
				wits: self.baseAttributes.value.wits,
				resolve: self.baseAttributes.value.resolve,

				strength : self.baseAttributes.value.strength  + vue.getNum("this.currentForm.strengthMod") + vue.getNum("this.character.abilities.value.vigor.level"),
				dexterity: self.baseAttributes.value.dexterity + vue.getNum("this.currentForm.dexterityMod"),
				stamina  : self.baseAttributes.value.stamina   + vue.getNum("this.currentForm.staminaMod")  + vue.getNum("this.character.abilities.value.resilience.level"),

				presence: self.baseAttributes.value.presence,
				manipulation: self.baseAttributes.value.manipulation + vue.getNum("this.currentForm.manipulationMod"),
				composure: self.baseAttributes.value.composure,
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

		this.size = computed({
			get() {
				return self.baseSize.value + vue.getNum("this.currentForm.sizeMod") + (self.merits.find(el => el.name === "Giant" && el.level == 3) ? 1 : 0);
			},
			set(val) {
				self.baseSize.value = val - vue.getNum("this.currentForm.sizeMod") - (self.merits.find(el => el.name === "Giant" && el.level == 3) ? 1 : 0);
			}
		});

		this.maxHealth = computed(function() {
			return self.attributes.value.stamina + self.size.value;
		});
		
		this.speed = computed(function() {
			// this.getNum;
			return self.attributes.value.strength + self.attributes.value.dexterity + 5 + vue.getNum("this.character.abilities.celerity.level") + vue.getNum("this.currentForm.speedMod");
		});

		this.defense = computed(function() {
			return Math.min(self.attributes.value.dexterity, self.attributes.value.wits) + (self.skills.athletics || 0);
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