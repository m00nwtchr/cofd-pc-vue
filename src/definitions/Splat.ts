import { Character, Form, MageCharacter, MortalCharacter, VampireCharacter, WerewolfCharacter } from ".";

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

	virtueAnchor?: (key: string) => string;
	viceAnchor?: (key: string) => string;

	alternateBeatName?: string;

	finiteAbilities?: boolean;
	abilities?: { [key: string]: string };

	integrityTrackType: string | {
		type: string;
		names?: string[]
	};

	alternateBeatDefault?: boolean;

	subTypes: {
		[index: string]: SubType;
	};
	organizations: {
		[index: string]: Organization
	},
	legacies?: string[];
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

		name: "splat.mortal.name",

		nameName: "character.name",

		virtueAnchorName: "splat.virtueAnchor",
		viceAnchorName: "splat.viceAnchor",

		virtueAnchor: (key) => `virtue.${key}`,
		viceAnchor: (key) => `vice.${key}`,

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

		}
	},
	[EnumSplat.VAMPIRE]: {
		enum: EnumSplat.VAMPIRE,
		characterFactory: VampireCharacter,

		name: "splat.vampire.name",

		nameName: "character.name",

		virtueAnchorName: "splat.vampire.virtueAnchor",
		viceAnchorName: "splat.vampire.viceAnchor",

		virtueAnchor: (key) => `splat.vampire.anchor.${key}`,
		viceAnchor: (key) => `splat.vampire.anchor.${key}`,

		subTypeName: "splat.vampire.subType.name",
		legacyName: "splat.vampire.legacy",
		orgName: "splat.vampire.organization.name",

		powerTraitName: "splat.vampire.powerTrait",
		fuelTraitName: "splat.vampire.fuelTrait",

		abilityName: "splat.vampire.ability.name",

		integrityTraitName: "splat.vampire.integrityTrait",

		alternateBeatName: "splat.vampire.alternateBeat",

		integrityTrackType: "verticalTouchstoneTrack",

		virtueAnchors: VAMP_ANCHORS,
		viceAnchors: VAMP_ANCHORS,

		abilities: {
			animalism: "splat.vampire.ability.animalism",
			auspex: "splat.vampire.ability.auspex",
			celerity: "splat.vampire.ability.celerity",
			dominate: "splat.vampire.ability.dominate",
			majesty: "splat.vampire.ability.majesty",
			nightmare: "splat.vampire.ability.nightmare",
			obfuscate: "splat.vampire.ability.obfuscate",
			protean: "splat.vampire.ability.protean",
			resilience: "splat.vampire.ability.resilience",
			vigor: "splat.vampire.ability.vigor"
		},
		subTypes: {
			daeva: {
				name: "splat.vampire.subType.daeva",
				abilities: ["celerity", "majesty", "vigor"]
			},
			gangrel: {
				name: "splat.vampire.subType.gangrel",
				abilities: ["animalism", "protean", "resilience"]
			},
			mekhet: {
				name: "splat.vampire.subType.mekhet",
				abilities: ["celerity", "auspex", "obfuscate"]
			},
			nosferatu: {
				name: "splat.vampire.subType.nosferatu",
				abilities: ["obfuscate", "nightmare", "vigor"]
			},
			ventrue: {
				name: "splat.vampire.subType.ventrue",
				abilities: ["animalism", "dominate", "resilience"]
			},
		},
		organizations: {
			carthian_movement: { name: "splat.vampire.organization.carthian_movement" },
			circle_of_the_crone: { name: "splat.vampire.organization.circle_of_the_crone" },
			invictus: { name: "splat.vampire.organization.invictus" },
			lancea_et_sanctum: { name: "splat.vampire.organization.lancea_et_sanctum" },
			ordo_dracul: { name: "splat.vampire.organization.ordo_dracul" },
			vii: { name: "splat.vampire.organization.vii" },
		},
	},
	[EnumSplat.MAGE]: {
		enum: EnumSplat.MAGE,
		characterFactory: MageCharacter,

		name: "splat.mage.name",

		nameName: "splat.mage.nameName",

		virtueAnchorName: "splat.virtueAnchor",
		viceAnchorName: "splat.viceAnchor",


		virtueAnchor: (key) => `virtue.${key}`,
		viceAnchor: (key) => `vice.${key}`,


		subTypeName: "splat.mage.subType.name",
		legacyName: "splat.mage.legacy",
		orgName: "splat.mage.organization.name",

		powerTraitName: "splat.mage.powerTrait",
		fuelTraitName: "splat.mage.fuelTrait",

		abilityName: "splat.mage.ability.name",

		alternateBeatName: "splat.mage.alternateBeat",

		integrityTraitName: "splat.mage.integrityTrait",

		integrityTrackType: "normal",

		virtueAnchors: VIRTUES,
		viceAnchors: VICES,

		alternateBeatDefault: true,

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
		finiteAbilities: true,
		alternateBeatOptional: false
	},
	[EnumSplat.WEREWOLF]: {
		enum: EnumSplat.WEREWOLF,
		characterFactory: WerewolfCharacter,

		name: "splat.werewolf.name",

		nameName: "character.name",

		virtueAnchorName: "splat.werewolf.virtueAnchor",
		viceAnchorName: "splat.werewolf.viceAnchor",

		virtueAnchor: (key) => `splat.werewolf.blood.${key}`,
		viceAnchor: (key) => `splat.werewolf.bone.${key}`,

		subTypeName: "splat.werewolf.subType.name",
		legacyName: "splat.werewolf.legacy",
		orgName: "splat.werewolf.organization.name",

		powerTraitName: "splat.werewolf.powerTrait",
		fuelTraitName: "splat.werewolf.fuelTrait",

		abilityName: "splat.werewolf.ability.name",

		alternateBeatName: "splat.werewolf.alternateBeat",

		integrityTraitName: "splat.werewolf.integrityTrait",
		
		virtueAnchors: [
			"alpha",
			"challenger",
			"destroyer",
			"fox",
			"monster",
			"soldier"
		].map(el => `splat.werewolf.blood.${el}`),
		viceAnchors: [
			"community_organizer", "cub", "guru", "hedonist", "lone_wolf", "wallflower"
		].map(el => `splat.werewolf.bone.${el}`),
		// subTypeName: "Auspice",
		// legacyName: "Lodge",
		// orgName: "Tribe",
		abilities: {
			purity: "splat.werewolf.ability.purity",
			glory: "splat.werewolf.ability.glory",
			honor: "splat.werewolf.ability.honor",
			wisdom: "splat.werewolf.ability.wisdom",
			cunning: "splat.werewolf.ability.cunning",
		},
		subTypes: {
			cahalith: {
				name: "splat.werewolf.subType.cahalith",
				abilities: ["glory"],
				moonGifts: ["gibbous"],
				gifts: ["inspiration", "knowledge"],
				skills: ["crafts", "expression", "persuasion"]
			},
			elodoth: {
				name: "splat.werewolf.subType.elodoth",
				abilities: ["honor"],
				moonGifts: ["half"],
				gifts: ["insight", "warding"],
				skills: ["empathy", "investigation", "politics"]
			},
			irraka: {
				name: "splat.werewolf.subType.irraka",
				abilities: ["cunning"],
				moonGifts: ["new"],
				gifts: ["evasion", "stealth"],
				skills: ["larceny", "stealth", "subterfuge"]
			},
			itheur: {
				name: "splat.werewolf.subType.itheur",
				abilities: ["wisdom"],
				moonGifts: ["crescent"],
				gifts: ["elemental", "shaping"],
				skills: ["animal_ken", "medicine", "occult"]
			},
			rahu: {
				name: "splat.werewolf.subType.rahu",
				abilities: ["purity"],
				moonGifts: ["full"],
				gifts: ["dominance", "strength"],
				skills: ["brawl", "intimidation", "survival"]
			},
		},
		organizations: {
			blood_talons: {
				name: "splat.werewolf.organization.blood_talons",

				abilities: ["glory"],
				gifts: ["inspiration", "rage", "strength"]
			},
			bone_shadows: {
				name: "splat.werewolf.organization.bone_shadows",

				abilities: ["wisdom"],
				gifts: ["death", "elements", "insight"]
			},
			hunters_in_darkness: {
				name: "splat.werewolf.organization.hunters_in_darkness",

				abilities: ["purity"],
				gifts: ["nature", "stealth", "warding"]
			},
			iron_masters: {
				name: "splat.werewolf.organization.iron_masters",

				abilities: ["cunning"],
				gifts: ["knowledge", "shaping", "technology"]
			},
			storm_lords: {
				name: "splat.werewolf.organization.storm_lords",

				abilities: ["honor"],
				gifts: ["evasion", "dominance", "weather"]
			},
			ghost_wolves: {
				name: "splat.werewolf.organization.ghost_wolves",

				abilities: [],
				gifts: []
			},
			fire_touched: {
				name: "splat.werewolf.organization.fire_touched",

				abilities: ["wisdom", "cunning", "glory"],
				gifts: ["disease", "fervor", "insight", "inspiration"]
			},
			ivory_claws: {
				name: "splat.werewolf.organization.ivory_claws",

				abilities: ["purity", "honor", "glory"],
				gifts: ["agony", "blood", "dominance", "warding"]
			},
			predator_kings: {
				name: "splat.werewolf.organization.predator_kings",

				abilities: ["glory", "purity", "wisdom"],
				gifts: ["hunger", "nature", "rage", "strength"]
			},
		},
		// powerTraitName: "Primal Urge",
		// integrityTraitName: "Harmony",
		integrityTrackType: { type: "dualTouchstone", names: ["Flesh", "Spirit"] },
		// abilityName: "Renown",
		finiteAbilities: true,
		// fuelTraitName: "Essence",
		forms: {
			hishu: {
				name: "Hishu",
				desc: "splat.werewolf.form.human",
				traits: [
					"Sheep's Clothing"
				],
		
				intelligenceMod: 0,
				witsMod: 0,
				resolveMod: 0,
		
				strengthMod: 0,
				dexterityMod: 0,
				staminaMod: 0,
		
				presenceMod: 0,
				manipulationMod: 0,
				composureMod: 0,
		
				sizeMod: 0,
				speedMod: 0,
		
				perceptionMod: 1,
		
				armorMod: {
					general: 0,
					ballistic: 0
				}
			},
			dalu: {
				name: "Dalu",
				desc: "splat.werewolf.form.near_human",
				traits: [
					"Teeth/Claws +0L",
					"Defense vs. Firearms",
					"Mild Lunacy",
					"Badass Motherfucker"
				],
		
				intelligenceMod: 0,
				witsMod: 0,
				resolveMod: 0,
		
				strengthMod: 1,
				dexterityMod: 0,
				staminaMod: 1,
		
				presenceMod: 0,
				manipulationMod: -1,
				composureMod: 0,
		
				sizeMod: 1,
				speedMod: 0,
		
				perceptionMod: 2,
		
				biteDamage: 0,
				clawDamage: 0,
		
				armorMod: {
					general: 0,
					ballistic: 0
				}
			},
			gauru: {
				name: "Gauru",
				desc: "splat.werewolf.form.wolf_man",
				traits: [
					"Teeth/Claws +2L (Initative +3)",
					"Defense vs. Firearms",
					"Full Lunacy",
					"Regeneration",
					"Rage",
					"Primal Fear"
				],
		
				intelligenceMod: 0,
				witsMod: 0,
				resolveMod: 0,
		
				strengthMod: 3,
				dexterityMod: 1,
				staminaMod: 2,
		
				presenceMod: 0,
				manipulationMod: 0,
				composureMod: 0,
		
				sizeMod: 2,
				speedMod: 0,
		
				perceptionMod: 3,
		
				biteDamage: 2,
				clawDamage: 2,

				armorMod: {
					general: 0,
					ballistic: 0
				}
			},
			urshul: {
				name: "Urshul",
				desc: "splat.werewolf.form.near_wolf",
				traits: [
					"Teeth +2L/Claws +1L",
					"Defense vs. Firearms",
					"Moderate Lunacy",
					"Weaken the Prey",
				],
		
				intelligenceMod: 0,
				witsMod: 0,
				resolveMod: 0,
		
				strengthMod: 2,
				dexterityMod: 2,
				staminaMod: 2,
		
				presenceMod: 0,
				manipulationMod: -1,
				composureMod: 0,
		
				sizeMod: 1,
				speedMod: 3,
		
				perceptionMod: 3,
		
				biteDamage: 2,
				clawDamage: 1,
		
				armorMod: {}
			},
			urhan: {
				name: "Urhan",
				desc: "splat.werewolf.form.wolf",
				traits: [
					"Teeth +1L",
					"Chase Down"
				],
		
				intelligenceMod: 0,
				witsMod: 0,
				resolveMod: 0,
		
				strengthMod: 0,
				dexterityMod: 2,
				staminaMod: 1,
		
				presenceMod: 0,
				manipulationMod: -1,
				composureMod: 0,
		
				sizeMod: -1,
				speedMod: 3,
		
				perceptionMod: 4,
		
				biteDamage: 1,
		
				armorMod: {
					general: 0,
					ballistic: 0
				}
			}
		} as unknown as {[key: string]: Form}
	}
} as { [key: number]: Splat };

// (WEREWOLF as any).forms = WEREWOLF_FORMS;