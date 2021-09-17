import { Character, MageCharacter, MortalCharacter, VampireCharacter } from ".";

// import g from "../i18n";

// const i18n = g.global;
// const t = i18n.t.bind(i18n);
// const te = i18n.te.bind(i18n);

export enum EnumSplat {
	MORTAL, MAGE, VAMPIRE, WEREWOLF, CHANGELING
}

export interface Splat { 
	enum: EnumSplat;
	characterFactory: new (opts: any) => Character;

	name: string;

	nameName: string;

	virtueAnchorName: string;
	viceAnchorName: string;

	subTypeName: string;
	orgName: string;
	legacyName: string;

	powerTraitName?: string;
	abilityName?: string;
	fuelTraitName?: string;

	integrityTraitName: string;

	virtueAnchors: string[];
	viceAnchors: string[];

	finiteAbilities?: boolean;
	abilities?: { [key: string]: string };

	integrityTrackType: string | { 
		type: string; 
		names?: string[]
	};


	subTypes: {
		[index: string]: SubType;
	};
	organizations: {
		[index: string]: Organization
	},
	legacies: string[];
}

export interface Organization {
	name: string;

	skills?: string[];
	abilities?: string[];

	gifts?: string[];
}

export interface SubType {
	name: string;
	abilities: string[];

	skills?: string[];
	attributes?: string[];

	inferiorArcanum?: string;

	moonGifts?: string[];
	gifts?: string[];
}

const VIRTUES = [
	"hopeful",
	"ambitious",
	"loving",
	"just",
	"honest",
	"generous",
	"trustworthy",
	"patient",
	"loyal",
	"courageous"
].map(el => `virtue.${el}`);

const VICES = [
	"pessimistic",
	"addictive",
	"hateful",
	"hasty",
	"deceitful",
	"corrupt",
	"ambitious",
	"greedy",
	"cruel",
	"dogmatic"
].map(el => `vice.${el}`);

const VAMP_ANCHORS = [
	"authoritarian",
	"child",
	"competitor",
	"conformist",
	"conspirator",
	"courtesan",
	"cult_leader",
	"deviant",
	"follower",
	"guru",
	"idealist",
	"jester",
	"junkie",
	"martyr",
	"masochist",
	"monster",
	"nomad",
	"nurturer",
	"perfectionist",
	"penitent",
	"questioner",
	"rebel",
	"scholar",
	"social_chameleon",
	"spy",
	"survivor",
	"visionary",
].map(el => `splat.vampire.anchor.${el}`);

export const SPLATS = {
	[EnumSplat.MORTAL]: {
		enum: EnumSplat.MORTAL,
		characterFactory: MortalCharacter,

		name: "translated name for splat",

		nameName: "character.name",

		virtueAnchorName: "splat.virtueAnchor",
		viceAnchorName: "splat.viceAnchor",

		subTypeName: "splat.mortal.subType.name",
		legacyName: "splat.mortal.legacy",
		orgName: "splat.mortal.organization.name",

		integrityTraitName: "splat.integrityTrait",

		integrityTrackType: "normal",

		virtueAnchors: VIRTUES,
		viceAnchors: VICES,

		subTypes: {
			
		},
		organizations: {

		},
		legacies: [],
	},
	[EnumSplat.VAMPIRE]: {
		enum: EnumSplat.VAMPIRE,
		characterFactory: VampireCharacter,

		name: "translated name for splat",

		nameName: "character.name",

		virtueAnchorName: "splat.vampire.virtueAnchor",
		viceAnchorName: "splat.vampire.viceAnchor",

		subTypeName: "splat.vampire.subType.name",
		legacyName: "splat.vampire.legacy",
		orgName: "splat.vampire.organization.name",

		powerTraitName: "splat.vampire.powerTrait",
		fuelTraitName: "splat.vampire.fuelTrait",

		abilityName: "splat.vampire.ability.name",

		integrityTraitName: "splat.vampire.integrityTrait",

		integrityTrackType: "verticalTouchstoneTrack",

		virtueAnchors: VAMP_ANCHORS,
		viceAnchors: VAMP_ANCHORS,

		subTypes: {
			
		},
		organizations: {

		},
		legacies: [],
	},
	[EnumSplat.MAGE]: {
		enum: EnumSplat.MAGE,
		characterFactory: MageCharacter,

		name: "translated name for splat",

		nameName: "splat.mage.nameName",

		virtueAnchorName: "splat.virtueAnchor",
		viceAnchorName: "splat.viceAnchor",

		subTypeName: "splat.mage.subType.name",
		legacyName: "splat.mage.legacy",
		orgName: "splat.mage.organization.name",

		powerTraitName: "splat.mage.powerTrait",
		fuelTraitName: "splat.mage.fuelTrait",

		abilityName: "splat.mage.ability.name",

		integrityTraitName: "splat.mage.integrityTrait",

		integrityTrackType: "normal",

		virtueAnchors: VIRTUES,
		viceAnchors: VICES,

		abilities: {
			death: "splat.mage.ability.death",
			fate: "splat.mage.ability.fate",
			forces: "splat.mage.ability.forces",
			life: "splat.mage.ability.life",
			matter: "splat.mage.ability.matter",
			mind: "splat.mage.ability.mind",
			prime: "splat.mage.ability.prime",
			spirit: "splat.mage.ability.spirit",
			space: "splat.mage.ability.space",
			time: "splat.mage.ability.time"
		},
		subTypes: {
			acanthus: {
				name: "splat.mage.subType.acanthus",
				abilities: ["time", "fate"],
				inferiorArcanum: "forces"
			},
			mastigos: {
				name: "splat.mage.subType.mastigos",
				abilities: ["space", "mind"],
				inferiorArcanum: "matter"
			},
			moros: {
				name: "splat.mage.subType.moros",
				abilities: ["matter", "death"],
				inferiorArcanum: "spirit"
			},
			obrimos: {
				name: "splat.mage.subType.obrimos",
				abilities: ["forces", "prime"],
				inferiorArcanum: "death"
			},
			thyrsus: {
				name: "splat.mage.subType.thyrsus",
				abilities: ["life", "spirit"],
				inferiorArcanum: "mind"
			},
		},
		organizations: {
			adamantine_arrow: {
				name: "splat.mage.organization.adamantine_arrow",
	
				skills: ["athletics", "intimidation", "medicine"]
			},
			guardians_of_the_veil: {
				name: "splat.mage.organization.guardians_of_the_veil",
	
				skills: ["investigation", "stealth", "subterfuge"]
			},
			mysterium: {
				name: "splat.mage.organization.mysterium",
	
				skills: ["investigation", "occult", "survival"]
			},
			silver_ladder: {
				name: "splat.mage.organization.silver_ladder",
	
				skills: ["expression", "persuasion", "subterfuge"]
			},
			free_council: {
				name: "splat.mage.organization.free_council",
	
				skills: ["crafts", "persuasion", "science"]
			},
			seers_of_the_throne: {
				name: "splat.mage.organization.seers_of_the_throne",
	
				skills: ["investigation", "occult", "persuasion"]
			},
			hegemony: {
				name: "splat.mage.organization.hegemony",
	
				skills: ["politics", "persuasion", "empathy"]
			},
			panopticon: {
				name: "splat.mage.organization.panopticon",
	
				skills: ["investigation", "stealth", "subterfuge"]
			},
			paternoster: {
				name: "splat.mage.organization.paternoster",
	
				skills: ["academics", "occult", "expression"]
			},
			praetorian: {
				name: "splat.mage.organization.praetorian",
	
				skills: ["athletics", "larceny", "intimidation"]
			},
		},
		legacies: [],
		// powerTraitName: "Gnosis",
		// integrityTraitName: "Wisdom",
		// abilityName: "Arcana",
		finiteAbilities: true,
		// fuelTraitName: "Mana",
		// alternateBeatName: "Arcane",
		alternateBeatOptional: false
	}
} as {[key: number]: Splat};