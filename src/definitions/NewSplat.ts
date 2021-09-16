import { Character, MortalCharacter } from ".";

// import g from "../i18n";

// const i18n = g.global;
// const t = i18n.t.bind(i18n);
// const te = i18n.te.bind(i18n);

export enum EnumSplat {
	MORTAL, MAGE, VAMPIRE, WEREWOLF, CHANGELING
}

export interface Splat { 
	enum: EnumSplat;
	string: string;
	characterFactory?: new (opts: any) => Character;

	name: string;

	nameName: string;

	virtueAnchorName: string;
	viceAnchorName: string;

	subTypeName: string;
	orgName: string;
	legacyName: string;

	integrityTraitName: string;

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

export const SPLATS = {
	[EnumSplat.MORTAL]: {
		enum: EnumSplat.MORTAL,
		string: "MORTAL",
		// characterFactory: MortalCharacter,

		name: "translated name for splat",

		nameName: "character.name",

		virtueAnchorName: "splat.virtueAnchor",
		viceAnchorName: "splat.viceAnchor",

		subTypeName: "splat.mortal.subType.name",
		legacyName: "splat.mortal.legacy",
		orgName: "splat.mortal.organization.name",

		integrityTraitName: "splat.integrityTrait",

		integrityTrackType: "normal",

		subTypes: {
			
		},
		organizations: {

		},
		legacies: [],
	}
} as {[key: number]: Splat;};