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
	fuelTraitName: string;

	alternateBeatName: string;
	alternateBeatOptional: boolean;

	constructor({ nameName, virtueAnchorName, viceAnchorName, subTypeName, legacyName, orgName, powerTraitName, integrityTraitName, abilityName, fuelTraitName, alternateBeatName, alternateBeatOptional, finiteAbilities}: {
		nameName?: string;
		virtueAnchorName?: string;
		viceAnchorName?: string;
		subTypeName?: string;
		legacyName?: string;
		orgName?: string;
		powerTraitName?: string;
		integrityTraitName?: string;
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
		abilityName: "Renown",
		finiteAbilities: true,
		fuelTraitName: "Essence"
	})
};