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

	constructor({ nameName, virtueAnchorName, viceAnchorName, subTypeName, legacyName, orgName, powerTraitName, integrityTraitName, integrityTrackType, abilityName, fuelTraitName, alternateBeatName, alternateBeatOptional, finiteAbilities }: {
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
	}) {
		this.nameName = nameName || "Name";

		this.virtueAnchorName = virtueAnchorName || "Virtue";
		this.viceAnchorName = viceAnchorName || "Vice";

		this.subTypeName = subTypeName || "Chronicle";
		this.legacyName = legacyName || "Faction";
		this.orgName = orgName || "Group Name";

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

export const SPLATS: { [index: number]: Splat } = {
	[EnumSplat.MORTAL]: new Splat({}),
	[EnumSplat.MAGE]: new Splat({
		nameName: "Shadow Name",
		virtueAnchorName: "Virtue",
		viceAnchorName: "Vice",
		subTypeName: "Path",
		legacyName: "Legacy",
		orgName: "Order",
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
		subTypeName: "Clan",
		legacyName: "Bloodline",
		orgName: "Covenant",
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
		subTypeName: "Auspice",
		legacyName: "Lodge",
		orgName: "Tribe",
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
} as {[index: string]: Form};

// wolf.forms    = ["Hishu", "Dalu"      , "Gauru"   , "Urshul"   , "Urhan"];
// wolf.formDesc = ["Human", "Near Human", "Wolf-Man", "Near-Wolf", "Wolf" ];