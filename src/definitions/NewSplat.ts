import { Character, MortalCharacter } from ".";

export enum EnumSplat {
	MORTAL, MAGE, VAMPIRE, WEREWOLF, CHANGELING
}

export interface Splat { 
	enum: EnumSplat;
	string: string;
	characterFactory?: new (opts: any) => Character;


	name: string;

	virtueAnchorName: string;
	viceAnchorName: string;

	integrityTraitName: string;
	integrityTrackType: string | { 
		type: string; 
		names?: string[]
	};
}

export const SPLATS = {
	[EnumSplat.MORTAL]: {
		enum: EnumSplat.MORTAL,
		string: "MORTAL",
		// characterFactory: MortalCharacter,

		name: "translated name for splat",

		virtueAnchorName: "virtue",
		viceAnchorName: "vice",

		integrityTraitName: "Integrity",
		integrityTrackType: "normal"
	}
} as {[key: number]: Splat;};