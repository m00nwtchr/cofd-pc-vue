//  IntegrityTrackType = string | {type: string; names?: string[]};

export class Splat {

	nameName: string;

	virtueAnchorName: string;
	viceAnchorName: string;

	subTypeName: string;
	legacyName: string;
	orgName: string;

	abilityName: string;
	finiteAbilities: boolean;

	powerTraitName: string;
	integrityTraitName: string;
	integrityTrackType: string | { type: string; names?: string[] } = "normal";

	fuelTraitName: string;

	alternateBeatName: string;
	alternateBeatOptional: boolean;

	virtueAnchors: string[];
	viceAnchors: string[];

	subTypes: {
		name: string;
		abilities: string[];

		skills?: string[];
		attributes?: string[];

		inferiorArcanum?: string;

		moonGifts?: string[];
		gifts?: string[];
	}[];
	legacies: string[];
	organizations: {
		name: string;

		skills?: string[];

		renown?: string;
		gifts?: string[];
	}[];


	constructor({ nameName, virtueAnchorName, viceAnchorName, subTypeName, legacyName, orgName, powerTraitName, integrityTraitName, integrityTrackType, abilityName, fuelTraitName, alternateBeatName, alternateBeatOptional, finiteAbilities, legacies, organizations, subTypes, viceAnchors, virtueAnchors }: {
		nameName?: string;
		virtueAnchorName?: string;
		viceAnchorName?: string;
		subTypeName?: string;
		legacyName?: string;
		orgName?: string;
		powerTraitName?: string;
		integrityTraitName?: string;
		integrityTrackType?: string | { type: string; names?: string[] };
		abilityName?: string;
		finiteAbilities?: boolean;
		fuelTraitName?: string;
		alternateBeatName?: string;
		alternateBeatOptional?: boolean;
		virtueAnchors?: string[];
		viceAnchors?: string[];

		subTypes?: {
			name: string;
			abilities: string[];

			skills?: string[];
			attributes?: string[];

			inferiorArcanum?: string;

			moonGifts?: string[];
			gifts?: string[];
		}[];
		legacies?: string[];
		organizations?: {
			name: string;

			skills?: string[];

			renown?: string;
			gifts?: string[];
		}[];
	}) {
		this.nameName = nameName || "Name";

		this.virtueAnchorName = virtueAnchorName || "Virtue";
		this.viceAnchorName = viceAnchorName || "Vice";

		this.subTypeName = subTypeName || "Chronicle";
		this.legacyName = legacyName || "Faction";
		this.orgName = orgName || "Group Name";

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

		this.subTypes = subTypes || [];
		this.legacies = legacies || [];
		this.organizations = organizations || [];

		this.powerTraitName = powerTraitName || "";
		this.integrityTraitName = integrityTraitName || "Integrity";
		this.integrityTrackType = integrityTrackType || "normal";

		this.abilityName = abilityName || "";

		this.fuelTraitName = fuelTraitName || "";

		this.alternateBeatName = alternateBeatName || "";
		this.alternateBeatOptional = alternateBeatOptional === undefined ? true : alternateBeatOptional;

		this.finiteAbilities = finiteAbilities === undefined ? false : finiteAbilities;
	}

}

export enum EnumSplat {
	MORTAL = 0, MAGE = 1, VAMPIRE = 2, WEREWOLF = 3
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

export const SPLATS: { [index: number]: Splat } = {
	[EnumSplat.MORTAL]: new Splat({}),
	[EnumSplat.MAGE]: new Splat({
		nameName: "Shadow Name",
		virtueAnchorName: "Virtue",
		viceAnchorName: "Vice",
		subTypeName: "Path",
		legacyName: "Legacy",
		orgName: "Order",
		subTypes: [
			{
				name: "Acanthus",
				abilities: ["time", "fate"],
				inferiorArcanum: "forces"
			},
			{
				name: "Mastigos",
				abilities: ["space", "mind"],
				inferiorArcanum: "matter"
			},
			{
				name: "Moros",
				abilities: ["matter", "death"],
				inferiorArcanum: "spirit"
			},
			{
				name: "Obrimos",
				abilities: ["forces", "prime"],
				inferiorArcanum: "death"
			},
			{
				name: "Thyrsus",
				abilities: ["life", "spirit"],
				inferiorArcanum: "mind"
			},
		],
		organizations: [
			{
				name: "Adamantine Arrow",

				skills: ["athletics", "intimidation", "medicine"]
			},
			{
				name: "Guardians of the Veil",

				skills: ["investigation", "stealth", "subterfuge"]
			},
			{
				name: "Mysterium",

				skills: ["investigation", "occult", "survival"]
			},
			{
				name: "Silver Ladder",

				skills: ["expression", "persuasion", "subterfuge"]
			},
			{
				name: "Free Council",

				skills: ["crafts", "persuasion", "science"]
			},
			{
				name: "Seers of the Throne",

				skills: ["investigation", "occult", "persuasion"]
			},
		],
		// legacies: [],
		powerTraitName: "Gnosis",
		integrityTraitName: "Wisdom",
		abilityName: "Arcana",
		finiteAbilities: true,
		fuelTraitName: "Mana",
		alternateBeatName: "Arcane",
		alternateBeatOptional: false
	}),
	[EnumSplat.VAMPIRE]: new Splat({
		virtueAnchorName: "Mask",
		viceAnchorName: "Dirge",
		virtueAnchors: VAMP_ANCHORS,
		viceAnchors: VAMP_ANCHORS,
		subTypeName: "Clan",
		legacyName: "Bloodline",
		orgName: "Covenant",
		subTypes: [
			{ name: "Davea", abilities: ["celerity", "majesty", "vigor"] },
			{ name: "Gangrel", abilities: ["animalism", "protean", "resilience"] },
			{ name: "Mekhet", abilities: ["celerity", "auspex", "obfuscate"] },
			{ name: "Nosferatu", abilities: ["obfuscate", "nightmare", "vigor"] },
			{ name: "Ventrue", abilities: ["animalism", "dominate", "resilience"] },
		],
		organizations: [
			{ name: "The Carthian Movement" },
			{ name: "The Circle of the Crone" },
			{ name: "The Invictus" },
			{ name: "The Lancea et Sanctum" },
			{ name: "The Ordo Dracul" },
			{ name: "VII" },
		],
		powerTraitName: "Blood Potency",
		integrityTraitName: "Humanity",
		integrityTrackType: "verticalTouchstoneTrack",
		abilityName: "Disciplines",
		finiteAbilities: false,
		fuelTraitName: "Vitae",
		alternateBeatName: "Blood",
		alternateBeatOptional: true
	}),
	[EnumSplat.WEREWOLF]: new Splat({
		virtueAnchorName: "Blood",
		viceAnchorName: "Bone",
		virtueAnchors: ["Alpha", "Challenger", "Destroyer", "Fox", "The Monster", "Soldier"],
		viceAnchors: ["Community Organizer", "Cub", "Guru", "Hedonist", "Lone Wolf", "Wallflower"],
		subTypeName: "Auspice",
		legacyName: "Lodge",
		orgName: "Tribe",
		subTypes: [
			{
				name: "Cahalith",
				abilities: ["glory"],
				moonGifts: ["Gibbous"],
				gifts: ["inspiration", "knowledge"],
				skills: ["crafts", "expression", "persuasion"]
			},
			{
				name: "Elodoth",
				abilities: ["honor"],
				moonGifts: ["Half"],
				gifts: ["insight", "warding"],
				skills: ["empathy", "investigation", "politics"]
			},
			{
				name: "Irraka",
				abilities: ["cunning"],
				moonGifts: ["New"],
				gifts: ["evasion", "stealth"],
				skills: ["larceny", "stealth", "subterfuge"]
			},
			{
				name: "Itheur",
				abilities: ["wisdom"],
				moonGifts: ["Crescent"],
				gifts: ["elemental", "shaping"],
				skills: ["animal_ken", "medicine", "occult"]
			},
			{
				name: "Rahu",
				abilities: ["purity"],
				moonGifts: ["Full"],
				gifts: ["dominance", "strength"],
				skills: ["brawl", "intimidation", "survival"]
			},
		],
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
		powerTraitName: "Primal Urge",
		integrityTraitName: "Harmony",
		integrityTrackType: { type: "dualTouchstone", names: ["Flesh", "Spirit"] },
		abilityName: "Renown",
		finiteAbilities: true,
		fuelTraitName: "Essence"
	})
};

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
		desc: "Human",
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
		desc: "Near-Human",
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
		desc: "Wolf-Man",
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
		desc: "Near-Wolf",
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
		desc: "Wolf",
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