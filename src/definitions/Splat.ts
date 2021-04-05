import { computed } from "vue";
import g from "../i18n";
import { Ability } from "./Character";

const i18n = g.global;
const t = i18n.t.bind(i18n);
const te = i18n.te.bind(i18n);

//  IntegrityTrackType = string | {type: string; names?: string[]};

export enum EnumSplat {
	MORTAL, MAGE, VAMPIRE, WEREWOLF, CHANGELING
}

export const SPLATS: { [index: number]: Splat } = {};

export class Splat {

	en: EnumSplat;
	nameName: string;

	virtueAnchorName: string;
	viceAnchorName: string;

	subTypeName: string;
	legacyName: string;
	orgName: string;

	abilityName: string;
	abilities?: { [index: string]: string };
	finiteAbilities: boolean;

	powerTraitName: string;
	integrityTraitName: string;
	integrityTrackType: string | { type: string; names?: string[] } = "normal";

	fuelTraitName: string;

	alternateBeatName: ((str: string) => string) | undefined;
	alternateBeatOptional: boolean;

	virtueAnchors: string[];
	viceAnchors: string[];

	subTypes: {
		[index: string]: {
			name: string;
			abilities: string[];

			skills?: string[];
			attributes?: string[];

			inferiorArcanum?: string;

			moonGifts?: string[];
			gifts?: string[];
		};
	};
	legacies: string[];
	organizations: {
		name: string;

		skills?: string[];

		renown?: string;
		gifts?: string[];
	}[];


	constructor({ en, isSup, hasPowerTrait, hasFuelTrait, abilities, integrityTrackType, alternateBeatOptional, finiteAbilities, legacies, organizations, subTypes, viceAnchors, virtueAnchors }: {
		en: EnumSplat;

		isSup?: boolean;
		hasPowerTrait?: boolean;
		hasFuelTrait?: boolean;

		abilities?: { [index: string]: string };

		integrityTrackType?: string | { type: string; names?: string[] };
		finiteAbilities?: boolean;
		alternateBeatOptional?: boolean;
		virtueAnchors?: string[];
		viceAnchors?: string[];

		subTypes?: {
			[index: string]: {
				name: string;
				abilities: string[];

				skills?: string[];
				attributes?: string[];

				inferiorArcanum?: string;

				moonGifts?: string[];
				gifts?: string[];
			};
		};
		legacies?: string[];
		organizations?: {
			name: string;

			skills?: string[];

			renown?: string;
			gifts?: string[];
		}[];
	}) {
		this.en = en || EnumSplat.MORTAL;
		console.log(this.en);

		if (isSup === undefined) {
			isSup = true;
		}

		if (isSup) {
			hasFuelTrait = true;
			hasPowerTrait = true;
		}

		SPLATS[en] = this;

		const name = EnumSplat[this.en].toLowerCase();

		this.nameName = t(`splat.${name}.nameName`, t("character.name"));
 
		this.virtueAnchorName = t(`splat.${name}.virtueAnchor`, t("splat.virtueAnchor"));
		this.viceAnchorName = t(`splat.${name}.viceAnchor`, t("splat.viceAnchor"));

		this.subTypeName = t(`splat.${name}.subType.name`, t("character.chronicle"));
		this.legacyName = t(`splat.${name}.legacy`);
		this.orgName = t(`splat.${name}.organization`);

		this.virtueAnchors = virtueAnchors || [
			"Hopeful",
			"Ambitious",
			"Loving",
			"Just",
			"Honest",
			"Generous",
			"Trustworthy",
			"Patient",
			"Loyal",
			"Courageous"
		];
		this.viceAnchors = viceAnchors || [
			"Pessimistic",
			"Addictive",
			"Hateful",
			"Hasty",
			"Deceitful",
			"Corrupt",
			"Ambitious",
			"Greedy",
			"Cruel",
			"Dogmatic"
		];

		this.subTypes = subTypes || {};
		this.legacies = legacies || [];
		this.organizations = organizations || [];

		this.powerTraitName = hasPowerTrait ? t(`splat.${name}.powerTrait`, "") : "";
		this.integrityTraitName = t(`splat.${name}.integrityTrait`, t("splat.integrityTrait"));
		this.integrityTrackType = integrityTrackType || "normal";

		this.abilityName = t(`splat.${name}.ability.name`, "");
		this.abilities = abilities;

		this.fuelTraitName = hasFuelTrait ? t(`splat.${name}.fuelTrait`, "") : "";

		this.alternateBeatName = te(`splat.${name}.alternateBeat`) ? (str) => t(`splat.${name}.alternateBeat`, { x: str }, { default: "" }) : undefined;
		this.alternateBeatOptional = alternateBeatOptional === undefined ? true : alternateBeatOptional;

		this.finiteAbilities = finiteAbilities === undefined ? false : finiteAbilities;
	}

}

const VAMP_ANCHORS = [
	"Authoritarian",
	"Child",
	"Competitor",
	"Conformist",
	"Conspirator",
	"Courtesan",
	"Cult Leader",
	"Deviant",
	"Follower",
	"Guru",
	"Idealist",
	"Jester",
	"Junkie",
	"Martyr",
	"Masochist",
	"Monster",
	"Nomad",
	"Nurturer",
	"Perfectionist",
	"Penitent",
	"Questioner",
	"Rebel",
	"Scholar",
	"Social Chameleon",
	"Spy",
	"Survivor",
	"Visionary",
];
new Splat({
	en: EnumSplat.MORTAL,
	isSup: false
});

new Splat({
	en: EnumSplat.MAGE,
	// nameName: "Shadow Name",
	// virtueAnchorName: "Virtue",
	// viceAnchorName: "Vice",
	// subTypeName: "Path",
	// legacyName: "Legacy",
	// orgName: "Order",
	abilities: {
		death: t("splat.mage.ability.death"),
		fate: t("splat.mage.ability.fate"),
		forces: t("splat.mage.ability.forces"),
		life: t("splat.mage.ability.life"),
		matter: t("splat.mage.ability.matter"),
		mind: t("splat.mage.ability.mind"),
		prime: t("splat.mage.ability.prime"),
		spirit: t("splat.mage.ability.spirit"),
		space: t("splat.mage.ability.space"),
		time: t("splat.mage.ability.time")
	},
	subTypes: {
		acanthus: {
			name: t("splat.mage.subType.acanthus"),
			abilities: ["time", "fate"],
			inferiorArcanum: "forces"
		},
		mastigos: {
			name: t("splat.mage.subType.mastigos"),
			abilities: ["space", "mind"],
			inferiorArcanum: "matter"
		},
		moros: {
			name: t("splat.mage.subType.moros"),
			abilities: ["matter", "death"],
			inferiorArcanum: "spirit"
		},
		obrimos: {
			name: t("splat.mage.subType.obrimos"),
			abilities: ["forces", "prime"],
			inferiorArcanum: "death"
		},
		thyrsus: {
			name: t("splat.mage.subType.thyrsus"),
			abilities: ["life", "spirit"],
			inferiorArcanum: "mind"
		},
	},
	organizations: [
		{
			name: t("splat.mage.organization.adamantine_arrow"),

			skills: ["athletics", "intimidation", "medicine"]
		},
		{
			name: t("splat.mage.organization.guardians_of_the_veil"),

			skills: ["investigation", "stealth", "subterfuge"]
		},
		{
			name: t("splat.mage.organization.mysterium"),

			skills: ["investigation", "occult", "survival"]
		},
		{
			name: t("splat.mage.organization.silver_ladder"),

			skills: ["expression", "persuasion", "subterfuge"]
		},
		{
			name: t("splat.mage.organization.free_council"),

			skills: ["crafts", "persuasion", "science"]
		},
		{
			name: t("splat.mage.organization.seers_of_the_throne"),

			skills: ["investigation", "occult", "persuasion"]
		},
	],
	legacies: [],
	// powerTraitName: "Gnosis",
	// integrityTraitName: "Wisdom",
	// abilityName: "Arcana",
	finiteAbilities: true,
	// fuelTraitName: "Mana",
	// alternateBeatName: "Arcane",
	alternateBeatOptional: false
});

new Splat({
	en: EnumSplat.VAMPIRE,
	// virtueAnchorName: "Mask",
	// viceAnchorName: "Dirge",
	virtueAnchors: VAMP_ANCHORS,
	viceAnchors: VAMP_ANCHORS,
	// subTypeName: "Clan",
	// legacyName: "Bloodline",
	// orgName: "Covenant",
	abilities: {
		animalism: t("splat.vampire.ability.animalism"),
		auspex: t("splat.vampire.ability.auspex"),
		celerity: t("splat.vampire.ability.celerity"),
		dominate: t("splat.vampire.ability.dominate"),
		majesty: t("splat.vampire.ability.majesty"),
		nightmare: t("splat.vampire.ability.nightmare"),
		obfuscate: t("splat.vampire.ability.obfuscate"),
		protean: t("splat.vampire.ability.protean"),
		resilience: t("splat.vampire.ability.resilience"),
		vigor: t("splat.vampire.ability.vigor")

	},
	subTypes: {
		davea: { name: "Davea", abilities: ["celerity", "majesty", "vigor"] },
		gangrel: { name: "Gangrel", abilities: ["animalism", "protean", "resilience"] },
		mekhet: { name: "Mekhet", abilities: ["celerity", "auspex", "obfuscate"] },
		nosferatu: { name: "Nosferatu", abilities: ["obfuscate", "nightmare", "vigor"] },
		ventrue: { name: "Ventrue", abilities: ["animalism", "dominate", "resilience"] },
	},
	organizations: [
		{ name: "The Carthian Movement" },
		{ name: "The Circle of the Crone" },
		{ name: "The Invictus" },
		{ name: "The Lancea et Sanctum" },
		{ name: "The Ordo Dracul" },
		{ name: "VII" },
	],
	// powerTraitName: "Blood Potency",
	// integrityTraitName: "Humanity",
	integrityTrackType: "verticalTouchstoneTrack",
	// abilityName: "Disciplines",
	finiteAbilities: false,
	// fuelTraitName: "Vitae",
	// alternateBeatName: "Blood",
	alternateBeatOptional: true
});

new Splat({
	en: EnumSplat.WEREWOLF,
	// virtueAnchorName: "Blood",
	// viceAnchorName: "Bone",
	virtueAnchors: [
		"alpha",
		"challenger",
		"destroyer",
		"fox",
		"monster",
		"soldier"
	].map(el => t(`splat.werewolf.blood.${el}`)),
	viceAnchors: [
		"community_organizer", "cub", "guru", "hedonist", "lone_wolf", "wallflower"
	].map(el => t(`splat.werewolf.bone.${el}`)),
	// subTypeName: "Auspice",
	// legacyName: "Lodge",
	// orgName: "Tribe",
	abilities: {
		cunning: t("splat.werewolf.ability.cunning"),
		glory: t("splat.werewolf.ability.glory"),
		honor: t("splat.werewolf.ability.honor"),
		purity: t("splat.werewolf.ability.purity"),
		wisdom: t("splat.werewolf.ability.wisdom"),
	},
	subTypes: {
		cahalith: {
			name: "Cahalith",
			abilities: ["glory"],
			moonGifts: ["Gibbous"],
			gifts: ["inspiration", "knowledge"],
			skills: ["crafts", "expression", "persuasion"]
		},
		elodoth: {
			name: "Elodoth",
			abilities: ["honor"],
			moonGifts: ["Half"],
			gifts: ["insight", "warding"],
			skills: ["empathy", "investigation", "politics"]
		},
		irraka: {
			name: "Irraka",
			abilities: ["cunning"],
			moonGifts: ["New"],
			gifts: ["evasion", "stealth"],
			skills: ["larceny", "stealth", "subterfuge"]
		},
		itheur: {
			name: "Itheur",
			abilities: ["wisdom"],
			moonGifts: ["Crescent"],
			gifts: ["elemental", "shaping"],
			skills: ["animal_ken", "medicine", "occult"]
		},
		rahu: {
			name: "Rahu",
			abilities: ["purity"],
			moonGifts: ["Full"],
			gifts: ["dominance", "strength"],
			skills: ["brawl", "intimidation", "survival"]
		},
	},
	organizations: [
		{
			name: "Blood Talons",

			renown: "glory",
			gifts: ["inspiration", "rage", "strength"]
		},
		{
			name: "Bone Shadows",

			renown: "wisdom",
			gifts: ["death", "elements", "insight"]
		},
		{
			name: "Hunters in Darkness",

			renown: "purity",
			gifts: ["nature", "stealth", "warding"]
		},
		{
			name: "Iron Masters",

			renown: "cunning",
			gifts: ["knowledge", "shaping", "technology"]
		},
		{
			name: "Storm Lords",

			renown: "honor",
			gifts: ["evasion", "dominance", "weather"]
		},
		{
			name: "Ghost Wolves",

			renown: "",
			gifts: []
		},
	],
	// powerTraitName: "Primal Urge",
	// integrityTraitName: "Harmony",
	integrityTrackType: { type: "dualTouchstone", names: ["Flesh", "Spirit"] },
	// abilityName: "Renown",
	finiteAbilities: true,
	// fuelTraitName: "Essence"
});

// export const SPLATS: { [index: string]: Splat } = {
// 	[EnumSplat.MORTAL]: new Splat({en:EnumSplat.MORTAL}),
// 	[EnumSplat.MAGE]: new Splat({
// 		en: EnumSplat.MAGE,
// 		nameName: "Shadow Name",
// 		virtueAnchorName: "Virtue",
// 		viceAnchorName: "Vice",
// 		subTypeName: "Path",
// 		legacyName: "Legacy",
// 		orgName: "Order",
// 		subTypes: [
// 			{
// 				name: t("splat.mage.subtype.acanthus"),
// 				abilities: ["time", "fate"],
// 				inferiorArcanum: "forces"
// 			},
// 			{
// 				name:  t("splat.mage.subtype.mastigos"),
// 				abilities: ["space", "mind"],
// 				inferiorArcanum: "matter"
// 			},
// 			{
// 				name:  t("splat.mage.subtype.moros"),
// 				abilities: ["matter", "death"],
// 				inferiorArcanum: "spirit"
// 			},
// 			{
// 				name:  t("splat.mage.subtype.obrimos"),
// 				abilities: ["forces", "prime"],
// 				inferiorArcanum: "death"
// 			},
// 			{
// 				name:  t("splat.mage.subtype.thyrsus"),
// 				abilities: ["life", "spirit"],
// 				inferiorArcanum: "mind"
// 			},
// 		],
// 		organizations: [
// 			{
// 				name:  t("splat.mage.organization.adamantinearrow"),

// 				skills: ["athletics", "intimidation", "medicine"]
// 			},
// 			{
// 				name: t("splat.mage.organization.guardiansoftheveil"),

// 				skills: ["investigation", "stealth", "subterfuge"]
// 			},
// 			{
// 				name: t("splat.mage.organization.mysterium"),

// 				skills: ["investigation", "occult", "survival"]
// 			},
// 			{
// 				name: t("splat.mage.organization.silverladder"),

// 				skills: ["expression", "persuasion", "subterfuge"]
// 			},
// 			{
// 				name: t("splat.mage.organization.freecouncil"),

// 				skills: ["crafts", "persuasion", "science"]
// 			},
// 			{
// 				name: t("splat.mage.organization.seersofthethrone"),

// 				skills: ["investigation", "occult", "persuasion"]
// 			},
// 		],
// 		// legacies: [],
// 		powerTraitName: t("splat.mage.gnosis"),
// 		integrityTraitName: "Wisdom",
// 		abilityName: "Arcana",
// 		finiteAbilities: true,
// 		fuelTraitName: "Mana",
// 		alternateBeatName: "Arcane",
// 		alternateBeatOptional: false
// 	}),
// 	[EnumSplat.VAMPIRE]: new Splat({
// 		en: EnumSplat.VAMPIRE,
// 		virtueAnchorName: "Mask",
// 		viceAnchorName: "Dirge",
// 		virtueAnchors: VAMP_ANCHORS,
// 		viceAnchors: VAMP_ANCHORS,
// 		subTypeName: "Clan",
// 		legacyName: "Bloodline",
// 		orgName: "Covenant",
// 		subTypes: [
// 			{ name: "Davea", abilities: ["celerity", "majesty", "vigor"] },
// 			{ name: "Gangrel", abilities: ["animalism", "protean", "resilience"] },
// 			{ name: "Mekhet", abilities: ["celerity", "auspex", "obfuscate"] },
// 			{ name: "Nosferatu", abilities: ["obfuscate", "nightmare", "vigor"] },
// 			{ name: "Ventrue", abilities: ["animalism", "dominate", "resilience"] },
// 		],
// 		organizations: [
// 			{ name: "The Carthian Movement" },
// 			{ name: "The Circle of the Crone" },
// 			{ name: "The Invictus" },
// 			{ name: "The Lancea et Sanctum" },
// 			{ name: "The Ordo Dracul" },
// 			{ name: "VII" },
// 		],
// 		powerTraitName: "Blood Potency",
// 		integrityTraitName: "Humanity",
// 		integrityTrackType: "verticalTouchstoneTrack",
// 		abilityName: "Disciplines",
// 		finiteAbilities: false,
// 		fuelTraitName: "Vitae",
// 		alternateBeatName: "Blood",
// 		alternateBeatOptional: true
// 	}),
// 	[EnumSplat.WEREWOLF]: new Splat({
// 		en: EnumSplat.WEREWOLF,
// 		virtueAnchorName: "Blood",
// 		viceAnchorName: "Bone",
// 		virtueAnchors: ["Alpha", "Challenger", "Destroyer", "Fox", "The Monster", "Soldier"],
// 		viceAnchors: ["Community Organizer", "Cub", "Guru", "Hedonist", "Lone Wolf", "Wallflower"],
// 		subTypeName: "Auspice",
// 		legacyName: "Lodge",
// 		orgName: "Tribe",
// 		subTypes: [
// 			{
// 				name: "Cahalith",
// 				abilities: ["glory"],
// 				moonGifts: ["Gibbous"],
// 				gifts: ["inspiration", "knowledge"],
// 				skills: ["crafts", "expression", "persuasion"]
// 			},
// 			{
// 				name: "Elodoth",
// 				abilities: ["honor"],
// 				moonGifts: ["Half"],
// 				gifts: ["insight", "warding"],
// 				skills: ["empathy", "investigation", "politics"]
// 			},
// 			{
// 				name: "Irraka",
// 				abilities: ["cunning"],
// 				moonGifts: ["New"],
// 				gifts: ["evasion", "stealth"],
// 				skills: ["larceny", "stealth", "subterfuge"]
// 			},
// 			{
// 				name: "Itheur",
// 				abilities: ["wisdom"],
// 				moonGifts: ["Crescent"],
// 				gifts: ["elemental", "shaping"],
// 				skills: ["animal_ken", "medicine", "occult"]
// 			},
// 			{
// 				name: "Rahu",
// 				abilities: ["purity"],
// 				moonGifts: ["Full"],
// 				gifts: ["dominance", "strength"],
// 				skills: ["brawl", "intimidation", "survival"]
// 			},
// 		],
// 		organizations: [
// 			{
// 				name: "Blood Talons",

// 				renown: "glory",
// 				gifts: ["inspiration", "rage", "strength"]
// 			},
// 			{
// 				name: "Bone Shadows",

// 				renown: "wisdom",
// 				gifts: ["death", "elements", "insight"]
// 			},
// 			{
// 				name: "Hunters in Darkness",

// 				renown: "purity",
// 				gifts: ["nature", "stealth", "warding"]
// 			},
// 			{
// 				name: "Iron Masters",

// 				renown: "cunning",
// 				gifts: ["knowledge", "shaping", "technology"]
// 			},
// 			{
// 				name: "Storm Lords",

// 				renown: "honor",
// 				gifts: ["evasion", "dominance", "weather"]
// 			},
// 			{
// 				name: "Ghost Wolves",

// 				renown: "",
// 				gifts: []
// 			},
// 		],
// 		powerTraitName: "Primal Urge",
// 		integrityTraitName: "Harmony",
// 		integrityTrackType: { type: "dualTouchstone", names: ["Flesh", "Spirit"] },
// 		abilityName: "Renown",
// 		finiteAbilities: true,
// 		fuelTraitName: "Essence"
// 	})
// };

const wolf = (SPLATS[EnumSplat.WEREWOLF] as any);

export interface Form {
	name: string;
	desc: string;
	traits: string[];

	strengthMod: number;
	dexterityMod: number;
	staminaMod: number;
	manipulationMod: number;

	sizeMod: number;
	speedMod: number;

	perceptionMod: number;
}

wolf.forms = {
	hishu: {
		name: "Hishu",
		desc: t("splat.werewolf.form.human"),
		traits: [
			"Sheep's Clothing"
		],
		strengthMod: 0,
		dexterityMod: 0,
		staminaMod: 0,
		manipulationMod: 0,

		sizeMod: 0,
		speedMod: 0,

		perceptionMod: 1
	},
	dalu: {
		name: "Dalu",
		desc: t("splat.werewolf.form.near_human"),
		traits: [
			"Teeth/Claws +0L",
			"Defense vs. Firearms",
			"Mild Lunacy",
			"Badass Motherfucker"
		],
		strengthMod: 1,
		dexterityMod: 1,
		staminaMod: 0,
		manipulationMod: -1,

		sizeMod: 1,
		speedMod: 0,

		perceptionMod: 2
	},
	gauru: {
		name: "Gauru",
		desc: t("splat.werewolf.form.wolf_man"),
		traits: [
			"Teeth/Claws +2L (Initative +3)",
			"Defense vs. Firearms",
			"Full Lunacy",
			"Regeneration",
			"Rage",
			"Primal Fear"
		],
		strengthMod: 3,
		dexterityMod: 1,
		staminaMod: 2,
		manipulationMod: 0,

		sizeMod: 2,
		speedMod: 0,

		perceptionMod: 3
	},
	urshul: {
		name: "Urshul",
		desc: t("splat.werewolf.form.near_wolf"),
		traits: [
			"Teeth +2L/Claws +1L",
			"Defense vs. Firearms",
			"Moderate Lunacy",
			"Weaken the Prey"
		],
		strengthMod: 2,
		dexterityMod: 2,
		staminaMod: 2,
		manipulationMod: -1,

		sizeMod: 1,
		speedMod: 0,

		perceptionMod: 3
	},
	urhan: {
		name: "Urhan",
		desc: t("splat.werewolf.form.wolf"),
		traits: [
			"Teeth +1L",
			"Chase Down"
		],
		strengthMod: 0,
		dexterityMod: 2,
		staminaMod: 1,
		manipulationMod: -1,

		sizeMod: -1,
		speedMod: 3,

		perceptionMod: 4
	}
} as { [index: string]: Form };

// wolf.forms    = ["Hishu", "Dalu"      , "Gauru"   , "Urshul"   , "Urhan"];
// wolf.formDesc = ["Human", "Near Human", "Wolf-Man", "Near-Wolf", "Wolf" ];