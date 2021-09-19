// import { RefType, td } from "../Util";
// import { computed, reactive, Ref } from "vue";
// import g from "../i18n";
// import Character, { Ability, ChangelingCharacter, MageCharacter, VampireCharacter, WerewolfCharacter, Armor, def } from "./Character";

// const i18n = g.global;
// const t = i18n.t.bind(i18n);
// const te = i18n.te.bind(i18n);


// //  IntegrityTrackType = string | {type: string; names?: string[]};

// export interface Organization {
// 	name: RefType<string>;

// 	skills?: string[];
// 	abilities?: string[];

// 	gifts?: string[];
// }

// export interface SubType {
// 	name: RefType<string>;
// 	abilities: string[];

// 	skills?: string[];
// 	attributes?: string[];

// 	inferiorArcanum?: string;

// 	moonGifts?: string[];
// 	gifts?: string[];
// }

// export enum EnumSplat {
// 	MORTAL, MAGE, VAMPIRE, WEREWOLF, CHANGELING
// }

// export const SPLATS: { [index: number]: Splat } = reactive({});

// export class Splat {

// 	en: EnumSplat;
// 	characterFactory: new (opts: any) => Character;

// 	nameName: RefType<string>;

// 	virtueAnchorName: RefType<string>;
// 	viceAnchorName: RefType<string>;

// 	subTypeName: RefType<string>;
// 	legacyName: RefType<string>;
// 	orgName: RefType<string>;

// 	abilityName: RefType<string>;
// 	abilities?: { [index: string]: RefType<string> };
// 	finiteAbilities: boolean;

// 	powerTraitName: RefType<string>;
// 	integrityTraitName: RefType<string>;
// 	integrityTrackType: string | { type: string; names?: RefType<string>[] } = "normal";

// 	fuelTraitName: RefType<string>;

// 	alternateBeatName: ((str: string) => string) | undefined;
// 	alternateBeatOptional: boolean;

// 	virtueAnchors: RefType<string>[];
// 	viceAnchors: RefType<string>[];

// 	subTypes: {
// 		[index: string]: SubType;
// 	};
// 	legacies: string[];
// 	organizations: {
// 		[index: string]: Organization
// 	}


// 	constructor({ en, characterFactory, isSup, hasPowerTrait, hasFuelTrait, abilities, integrityTrackType, alternateBeatOptional, finiteAbilities, legacies, organizations, subTypes, viceAnchors, virtueAnchors }: {
// 		en: EnumSplat;
// 		characterFactory?: new (opts: any) => Character;

// 		isSup?: boolean;
// 		hasPowerTrait?: boolean;
// 		hasFuelTrait?: boolean;

// 		abilities?: { [index: string]: RefType<string> };

// 		integrityTrackType?: string | { type: string; names?: RefType<string>[] };
// 		finiteAbilities?: boolean;
// 		alternateBeatOptional?: boolean;
// 		virtueAnchors?: RefType<string>[];
// 		viceAnchors?: RefType<string>[];

// 		subTypes?: {
// 			[index: string]: SubType;
// 		};
// 		legacies?: string[];
// 		organizations?: {
// 			[index: string]: Organization;
// 		};
// 	}) {
// 		this.en = en || EnumSplat.MORTAL;

// 		if (isSup === undefined) {
// 			isSup = true;
// 		}

// 		if (isSup) {
// 			hasFuelTrait = true;
// 			hasPowerTrait = true;
// 		}

// 		SPLATS[en] = this;
// 		const name = EnumSplat[this.en].toLowerCase();

// 		this.characterFactory = characterFactory || Character;

// 		// this.nameName = t(`splat.${name}.nameName`, t("character.name"));
// 		this.nameName = td(`splat.${name}.nameName`, "character.name");

// 		this.virtueAnchorName = td(`splat.${name}.virtueAnchor`, "splat.virtueAnchor");
// 		this.viceAnchorName = td(`splat.${name}.viceAnchor`, "splat.viceAnchor");

// 		this.subTypeName = td(`splat.${name}.subType.name`, "character.chronicle");
// 		this.legacyName = td(`splat.${name}.legacy`);
// 		this.orgName = td(`splat.${name}.organization.name`);

// 		this.virtueAnchors = virtueAnchors || [
// 			"Hopeful",
// 			"Ambitious",
// 			"Loving",
// 			"Just",
// 			"Honest",
// 			"Generous",
// 			"Trustworthy",
// 			"Patient",
// 			"Loyal",
// 			"Courageous"
// 		];
// 		this.viceAnchors = viceAnchors || [
// 			"Pessimistic",
// 			"Addictive",
// 			"Hateful",
// 			"Hasty",
// 			"Deceitful",
// 			"Corrupt",
// 			"Ambitious",
// 			"Greedy",
// 			"Cruel",
// 			"Dogmatic"
// 		];

// 		this.subTypes = subTypes || {};
// 		this.legacies = legacies || [];
// 		this.organizations = organizations || [];

// 		this.powerTraitName = hasPowerTrait ? td(`splat.${name}.powerTrait`, "") : "";
// 		this.integrityTraitName = td(`splat.${name}.integrityTrait`, "splat.integrityTrait");
// 		this.integrityTrackType = integrityTrackType || "normal";

// 		this.abilityName = td(`splat.${name}.ability.name`);
// 		this.abilities = abilities;

// 		this.fuelTraitName = hasFuelTrait ? td(`splat.${name}.fuelTrait`) : "";

// 		this.alternateBeatName = te(`splat.${name}.alternateBeat`) ? (str) => t(`splat.${name}.alternateBeat`, { x: str }, { default: "" }) : undefined;
// 		this.alternateBeatOptional = alternateBeatOptional === undefined ? true : alternateBeatOptional;

// 		this.finiteAbilities = finiteAbilities === undefined ? false : finiteAbilities;
// 	}

// }

// const VAMP_ANCHORS = [
// 	"Authoritarian",
// 	"Child",
// 	"Competitor",
// 	"Conformist",
// 	"Conspirator",
// 	"Courtesan",
// 	"Cult Leader",
// 	"Deviant",
// 	"Follower",
// 	"Guru",
// 	"Idealist",
// 	"Jester",
// 	"Junkie",
// 	"Martyr",
// 	"Masochist",
// 	"Monster",
// 	"Nomad",
// 	"Nurturer",
// 	"Perfectionist",
// 	"Penitent",
// 	"Questioner",
// 	"Rebel",
// 	"Scholar",
// 	"Social Chameleon",
// 	"Spy",
// 	"Survivor",
// 	"Visionary",
// ];
// new Splat({
// 	en: EnumSplat.MORTAL,
// 	isSup: false
// });

// new Splat({
// 	en: EnumSplat.MAGE,
// 	characterFactory: MageCharacter,
// 	// nameName: "Shadow Name",
// 	// virtueAnchorName: "Virtue",
// 	// viceAnchorName: "Vice",
// 	// subTypeName: "Path",
// 	// legacyName: "Legacy",
// 	// orgName: "Order",
// 	abilities: {
// 		death: td("splat.mage.ability.death"),
// 		fate: td("splat.mage.ability.fate"),
// 		forces: td("splat.mage.ability.forces"),
// 		life: td("splat.mage.ability.life"),
// 		matter: td("splat.mage.ability.matter"),
// 		mind: td("splat.mage.ability.mind"),
// 		prime: td("splat.mage.ability.prime"),
// 		spirit: td("splat.mage.ability.spirit"),
// 		space: td("splat.mage.ability.space"),
// 		time: td("splat.mage.ability.time")
// 	},
// 	subTypes: {
// 		acanthus: {
// 			name: td("splat.mage.subType.acanthus"),
// 			abilities: ["time", "fate"],
// 			inferiorArcanum: "forces"
// 		},
// 		mastigos: {
// 			name: td("splat.mage.subType.mastigos"),
// 			abilities: ["space", "mind"],
// 			inferiorArcanum: "matter"
// 		},
// 		moros: {
// 			name: td("splat.mage.subType.moros"),
// 			abilities: ["matter", "death"],
// 			inferiorArcanum: "spirit"
// 		},
// 		obrimos: {
// 			name: td("splat.mage.subType.obrimos"),
// 			abilities: ["forces", "prime"],
// 			inferiorArcanum: "death"
// 		},
// 		thyrsus: {
// 			name: td("splat.mage.subType.thyrsus"),
// 			abilities: ["life", "spirit"],
// 			inferiorArcanum: "mind"
// 		},
// 	},
// 	organizations: {
// 		adamantine_arrow: {
// 			name: td("splat.mage.organization.adamantine_arrow"),

// 			skills: ["athletics", "intimidation", "medicine"]
// 		},
// 		guardians_of_the_veil: {
// 			name: td("splat.mage.organization.guardians_of_the_veil"),

// 			skills: ["investigation", "stealth", "subterfuge"]
// 		},
// 		mysterium: {
// 			name: td("splat.mage.organization.mysterium"),

// 			skills: ["investigation", "occult", "survival"]
// 		},
// 		silver_ladder: {
// 			name: td("splat.mage.organization.silver_ladder"),

// 			skills: ["expression", "persuasion", "subterfuge"]
// 		},
// 		free_council: {
// 			name: td("splat.mage.organization.free_council"),

// 			skills: ["crafts", "persuasion", "science"]
// 		},
// 		seers_of_the_throne: {
// 			name: td("splat.mage.organization.seers_of_the_throne"),

// 			skills: ["investigation", "occult", "persuasion"]
// 		},
// 		hegemony: {
// 			name: td("splat.mage.organization.hegemony"),

// 			skills: ["politics", "persuasion", "empathy"]
// 		},
// 		panopticon: {
// 			name: td("splat.mage.organization.panopticon"),

// 			skills: ["investigation", "stealth", "subterfuge"]
// 		},
// 		paternoster: {
// 			name: td("splat.mage.organization.paternoster"),

// 			skills: ["academics", "occult", "expression"]
// 		},
// 		praetorian: {
// 			name: td("splat.mage.organization.praetorian"),

// 			skills: ["athletics", "larceny", "intimidation"]
// 		},
// 	},
// 	legacies: [],
// 	// powerTraitName: "Gnosis",
// 	// integrityTraitName: "Wisdom",
// 	// abilityName: "Arcana",
// 	finiteAbilities: true,
// 	// fuelTraitName: "Mana",
// 	// alternateBeatName: "Arcane",
// 	alternateBeatOptional: false
// });

// new Splat({
// 	en: EnumSplat.VAMPIRE,
// 	characterFactory: VampireCharacter,
// 	// virtueAnchorName: "Mask",
// 	// viceAnchorName: "Dirge",
// 	virtueAnchors: VAMP_ANCHORS,
// 	viceAnchors: VAMP_ANCHORS,
// 	// subTypeName: "Clan",
// 	// legacyName: "Bloodline",
// 	// orgName: "Covenant",
// 	abilities: {
// 		animalism: td("splat.vampire.ability.animalism"),
// 		auspex: td("splat.vampire.ability.auspex"),
// 		celerity: td("splat.vampire.ability.celerity"),
// 		dominate: td("splat.vampire.ability.dominate"),
// 		majesty: td("splat.vampire.ability.majesty"),
// 		nightmare: td("splat.vampire.ability.nightmare"),
// 		obfuscate: td("splat.vampire.ability.obfuscate"),
// 		protean: td("splat.vampire.ability.protean"),
// 		resilience: td("splat.vampire.ability.resilience"),
// 		vigor: td("splat.vampire.ability.vigor")
// 	},
// 	subTypes: {
// 		daeva: {
// 			name: td("splat.vampire.subType.daeva"),
// 			abilities: ["celerity", "majesty", "vigor"]
// 		},
// 		gangrel: {
// 			name: td("splat.vampire.subType.gangrel"),
// 			abilities: ["animalism", "protean", "resilience"]
// 		},
// 		mekhet: {
// 			name: td("splat.vampire.subType.mekhet"),
// 			abilities: ["celerity", "auspex", "obfuscate"]
// 		},
// 		nosferatu: {
// 			name: td("splat.vampire.subType.nosferatu"),
// 			abilities: ["obfuscate", "nightmare", "vigor"]
// 		},
// 		ventrue: {
// 			name: td("splat.vampire.subType.ventrue"),
// 			abilities: ["animalism", "dominate", "resilience"]
// 		},
// 	},
// 	organizations: {
// 		carthian_movement: { name: td("splat.vampire.organization.carthian_movement") },
// 		circle_of_the_crone: { name: td("splat.vampire.organization.circle_of_the_crone") },
// 		invictus: { name: td("splat.vampire.organization.invictus") },
// 		lancea_et_sanctum: { name: td("splat.vampire.organization.lancea_et_sanctum") },
// 		ordo_dracul: { name: td("splat.vampire.organization.ordo_dracul") },
// 		vii: { name: td("splat.vampire.organization.vii") },
// 	},
// 	// powerTraitName: "Blood Potency",
// 	// integrityTraitName: "Humanity",
// 	integrityTrackType: "verticalTouchstoneTrack",
// 	// abilityName: "Disciplines",
// 	finiteAbilities: false,
// 	// fuelTraitName: "Vitae",
// 	// alternateBeatName: "Blood",
// 	alternateBeatOptional: true
// });

// const WEREWOLF = new Splat({
// 	en: EnumSplat.WEREWOLF,
// 	characterFactory: WerewolfCharacter,
// 	// virtueAnchorName: "Blood",
// 	// viceAnchorName: "Bone",
// 	virtueAnchors: [
// 		"alpha",
// 		"challenger",
// 		"destroyer",
// 		"fox",
// 		"monster",
// 		"soldier"
// 	].map(el => td(`splat.werewolf.blood.${el}`)),
// 	viceAnchors: [
// 		"community_organizer", "cub", "guru", "hedonist", "lone_wolf", "wallflower"
// 	].map(el => td(`splat.werewolf.bone.${el}`)),
// 	// subTypeName: "Auspice",
// 	// legacyName: "Lodge",
// 	// orgName: "Tribe",
// 	abilities: {
// 		purity: td("splat.werewolf.ability.purity"),
// 		glory: td("splat.werewolf.ability.glory"),
// 		honor: td("splat.werewolf.ability.honor"),
// 		wisdom: td("splat.werewolf.ability.wisdom"),
// 		cunning: td("splat.werewolf.ability.cunning"),
// 	},
// 	subTypes: {
// 		cahalith: {
// 			name: td("splat.werewolf.subType.cahalith"),
// 			abilities: ["glory"],
// 			moonGifts: ["gibbous"],
// 			gifts: ["inspiration", "knowledge"],
// 			skills: ["crafts", "expression", "persuasion"]
// 		},
// 		elodoth: {
// 			name: td("splat.werewolf.subType.elodoth"),
// 			abilities: ["honor"],
// 			moonGifts: ["half"],
// 			gifts: ["insight", "warding"],
// 			skills: ["empathy", "investigation", "politics"]
// 		},
// 		irraka: {
// 			name: td("splat.werewolf.subType.irraka"),
// 			abilities: ["cunning"],
// 			moonGifts: ["new"],
// 			gifts: ["evasion", "stealth"],
// 			skills: ["larceny", "stealth", "subterfuge"]
// 		},
// 		itheur: {
// 			name: td("splat.werewolf.subType.itheur"),
// 			abilities: ["wisdom"],
// 			moonGifts: ["crescent"],
// 			gifts: ["elemental", "shaping"],
// 			skills: ["animal_ken", "medicine", "occult"]
// 		},
// 		rahu: {
// 			name: td("splat.werewolf.subType.rahu"),
// 			abilities: ["purity"],
// 			moonGifts: ["full"],
// 			gifts: ["dominance", "strength"],
// 			skills: ["brawl", "intimidation", "survival"]
// 		},
// 	},
// 	organizations: {
// 		blood_talons: {
// 			name: td("splat.werewolf.organization.blood_talons"),

// 			abilities: ["glory"],
// 			gifts: ["inspiration", "rage", "strength"]
// 		},
// 		bone_shadows: {
// 			name: td("splat.werewolf.organization.bone_shadows"),

// 			abilities: ["wisdom"],
// 			gifts: ["death", "elements", "insight"]
// 		},
// 		hunters_in_darkness: {
// 			name: td("splat.werewolf.organization.hunters_in_darkness"),

// 			abilities: ["purity"],
// 			gifts: ["nature", "stealth", "warding"]
// 		},
// 		iron_masters: {
// 			name: td("splat.werewolf.organization.iron_masters"),

// 			abilities: ["cunning"],
// 			gifts: ["knowledge", "shaping", "technology"]
// 		},
// 		storm_lords: {
// 			name: td("splat.werewolf.organization.storm_lords"),

// 			abilities: ["honor"],
// 			gifts: ["evasion", "dominance", "weather"]
// 		},
// 		ghost_wolves: {
// 			name: td("splat.werewolf.organization.ghost_wolves"),

// 			abilities: [],
// 			gifts: []
// 		},
// 		fire_touched: {
// 			name: td("splat.werewolf.organization.fire_touched"),

// 			abilities: ["wisdom", "cunning", "glory"],
// 			gifts: ["disease", "fervor", "insight", "inspiration"]
// 		},
// 		ivory_claws: {
// 			name: td("splat.werewolf.organization.ivory_claws"),

// 			abilities: ["purity", "honor", "glory"],
// 			gifts: ["agony", "blood", "dominance", "warding"]
// 		},
// 		predator_kings: {
// 			name: td("splat.werewolf.organization.predator_kings"),

// 			abilities: ["glory", "purity", "wisdom"],
// 			gifts: ["hunger", "nature", "rage", "strength"]
// 		},
// 	},
// 	// powerTraitName: "Primal Urge",
// 	// integrityTraitName: "Harmony",
// 	integrityTrackType: { type: "dualTouchstone", names: ["Flesh", "Spirit"] },
// 	// abilityName: "Renown",
// 	finiteAbilities: true,
// 	// fuelTraitName: "Essence"
// });

// new Splat({
// 	en: EnumSplat.CHANGELING,
// 	characterFactory: ChangelingCharacter,
// 	// virtueAnchorName: "Blood",
// 	// viceAnchorName: "Bone",
// 	virtueAnchors: [],
// 	viceAnchors: [],
// 	// subTypeName: "Auspice",
// 	// legacyName: "Lodge",
// 	// orgName: "Tribe",
// 	abilities: {
// 	},
// 	subTypes: {
// 	},
// 	organizations: {

// 	},
// 	// powerTraitName: "Primal Urge",
// 	// integrityTraitName: "Harmony",
// 	integrityTrackType: "healthTrack",
// 	// abilityName: "Renown",
// 	finiteAbilities: true,
// 	// fuelTraitName: "Essence"
// });

// export interface FormMods {
// 	intelligenceMod: number;
// 	witsMod: number;
// 	resolveMod: number;

// 	strengthMod: number;
// 	dexterityMod: number;
// 	staminaMod: number;

// 	presenceMod: number;
// 	manipulationMod: number;
// 	composureMod: number;

// 	sizeMod: number;
// 	speedMod: number;

// 	perceptionMod: number;

// 	defenseCalcMax?: boolean;
// 	defenseMod?: number;

// 	armorMod: Armor;
// }

// export interface Form extends FormMods {
// 	name: string;
// 	desc: string;
// 	traits: string[];

// 	[index: string]: any;
// }


// export const WEREWOLF_FORMS = {
// 	hishu: {
// 		name: "Hishu",
// 		desc: t("splat.werewolf.form.human"),
// 		traits: [
// 			"Sheep's Clothing"
// 		],

// 		intelligenceMod: 0,
// 		witsMod: 0,
// 		resolveMod: 0,

// 		strengthMod: 0,
// 		dexterityMod: 0,
// 		staminaMod: 0,

// 		presenceMod: 0,
// 		manipulationMod: 0,
// 		composureMod: 0,

// 		sizeMod: 0,
// 		speedMod: 0,

// 		perceptionMod: 1,

// 		armorMod: {}
// 	},
// 	dalu: {
// 		name: "Dalu",
// 		desc: t("splat.werewolf.form.near_human"),
// 		traits: [
// 			"Teeth/Claws +0L",
// 			"Defense vs. Firearms",
// 			"Mild Lunacy",
// 			"Badass Motherfucker"
// 		],

// 		intelligenceMod: 0,
// 		witsMod: 0,
// 		resolveMod: 0,

// 		strengthMod: 1,
// 		dexterityMod: 0,
// 		staminaMod: 1,

// 		presenceMod: 0,
// 		manipulationMod: -1,
// 		composureMod: 0,

// 		sizeMod: 1,
// 		speedMod: 0,

// 		perceptionMod: 2,

// 		biteDamage: 0,
// 		clawDamage: 0,

// 		armorMod: {}
// 	},
// 	gauru: {
// 		name: "Gauru",
// 		desc: t("splat.werewolf.form.wolf_man"),
// 		traits: [
// 			"Teeth/Claws +2L (Initative +3)",
// 			"Defense vs. Firearms",
// 			"Full Lunacy",
// 			"Regeneration",
// 			"Rage",
// 			"Primal Fear"
// 		],

// 		intelligenceMod: 0,
// 		witsMod: 0,
// 		resolveMod: 0,

// 		strengthMod: 3,
// 		dexterityMod: 1,
// 		staminaMod: 2,

// 		presenceMod: 0,
// 		manipulationMod: 0,
// 		composureMod: 0,

// 		sizeMod: 2,
// 		speedMod: 0,

// 		perceptionMod: 3,

// 		biteDamage: 2,
// 		clawDamage: 2,

// 		armorMod: {}
// 	},
// 	urshul: {
// 		name: "Urshul",
// 		desc: t("splat.werewolf.form.near_wolf"),
// 		traits: [
// 			"Teeth +2L/Claws +1L",
// 			"Defense vs. Firearms",
// 			"Moderate Lunacy",
// 			"Weaken the Prey",
// 		],

// 		intelligenceMod: 0,
// 		witsMod: 0,
// 		resolveMod: 0,

// 		strengthMod: 2,
// 		dexterityMod: 2,
// 		staminaMod: 2,

// 		presenceMod: 0,
// 		manipulationMod: -1,
// 		composureMod: 0,

// 		sizeMod: 1,
// 		speedMod: 3,

// 		perceptionMod: 3,

// 		biteDamage: 2,
// 		clawDamage: 1,

// 		armorMod: {}
// 	},
// 	urhan: {
// 		name: "Urhan",
// 		desc: t("splat.werewolf.form.wolf"),
// 		traits: [
// 			"Teeth +1L",
// 			"Chase Down"
// 		],

// 		intelligenceMod: 0,
// 		witsMod: 0,
// 		resolveMod: 0,

// 		strengthMod: 0,
// 		dexterityMod: 2,
// 		staminaMod: 1,

// 		presenceMod: 0,
// 		manipulationMod: -1,
// 		composureMod: 0,

// 		sizeMod: -1,
// 		speedMod: 3,

// 		perceptionMod: 4,

// 		biteDamage: 1,

// 		armorMod: {}
// 	}
// } as { [index: string]: Form };

// // (WEREWOLF as any).forms = WEREWOLF_FORMS;