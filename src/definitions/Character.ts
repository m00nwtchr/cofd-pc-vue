import { EnumSplat } from "./Splat";

export interface Ability {
	name: string;
	dots: number;
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
// 		{name: "Animalism", dots: 0},
// 		{name: "Auspex", dots: 0},
// 		{name: "Celerity", dots: 0},
// 		{name: "Dominate", dots: 0},
// 		{name: "Majesty", dots: 0},
// 		{name: "Nightmare", dots: 0},
// 		{name: "Obfuscate", dots: 0},
// 		{name: "Protean", dots: 0},
// 		{name: "Resilience", dots: 0},
// 		{name: "Vigor", dots: 0}
// 	];
// }

// class WerewolfTraits implements SplatTraits {
// 	abilities: Ability[] = [
// 		{name: "Cunning", dots: 0},
// 		{name: "Glory", dots: 0},
// 		{name: "Honor", dots: 0},
// 		{name: "Purity", dots: 0},
// 		{name: "Wisdom", dots: 0}
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

	attributes!: Attributes;

	skills: { [index: string]: number } = {};

	abilities: Ability[] = [];
	merits: Ability[] = [];

	healthTrack: number[] = [];
	// maxHealth?: number;

	willpower?: number;
	spentWillpowerDots = 0;
	// maxWillpower?: number;

	power = 1; // Gnosis/Primal Urge/Blood Potency

	fuel = 0;
	// maxFuel = 10;

	integrityTrait?= 7;

	size = 5;
	// speed?: number;
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

	constructor({ splat }: { splat?: EnumSplat }) {
		switch (splat) {
		case (EnumSplat.VAMPIRE):
			this.abilities = [
				{ name: "Animalism", dots: 0 },
				{ name: "Auspex", dots: 0 },
				{ name: "Celerity", dots: 0 },
				{ name: "Dominate", dots: 0 },
				{ name: "Majesty", dots: 0 },
				{ name: "Nightmare", dots: 0 },
				{ name: "Obfuscate", dots: 0 },
				{ name: "Protean", dots: 0 },
				{ name: "Resilience", dots: 0 },
				{ name: "Vigor", dots: 0 }
			];
			break;
		}
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
	// 			{name: "Animalism", dots: 0},
	// 			{name: "Auspex", dots: 0},
	// 			{name: "Celerity", dots: 0},
	// 			{name: "Dominate", dots: 0},
	// 			{name: "Majesty", dots: 0},
	// 			{name: "Nightmare", dots: 0},
	// 			{name: "Obfuscate", dots: 0},
	// 			{name: "Protean", dots: 0},
	// 			{name: "Resilience", dots: 0},
	// 			{name: "Vigor", dots: 0}
	// 		],
	// 	},
	// 	[EnumSplat.MAGE]: {
	// 		abilities: [
	// 			{name: "Death", dots: 0},
	// 			{name: "Fate", dots: 0},
	// 			{name: "Forces", dots: 0},
	// 			{name: "Life", dots: 0},
	// 			{name: "Matter", dots: 0},
	// 			{name: "Mind", dots: 0},
	// 			{name: "Prime", dots: 0},
	// 			{name: "Spirit", dots: 0},				
	// 			{name: "Space", dots: 0},
	// 			{name: "Time", dots: 0}
	// 		],
	// 		roteSkills: []

	// 	},
	// 	[EnumSplat.WEREWOLF]: {
	// 		abilities: [
	// 			{name: "Cunning", dots: 0},
	// 			{name: "Glory", dots: 0},
	// 			{name: "Honor", dots: 0},
	// 			{name: "Purity", dots: 0},
	// 			{name: "Wisdom", dots: 0}
	// 		],
	// 	},
	// };
}