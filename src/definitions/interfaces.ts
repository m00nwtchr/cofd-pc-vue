export interface Ability {
	key?: string;
	name?: string;
	level: number;
}

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

export interface IEphemeralAttributes {
	power: number;
	finesse: number;
	resistance: number;
}

export interface EphemeralAttributes extends Attributes, IEphemeralAttributes {}

export interface Skills {
	[index: string]: number;
}

export interface Armor {
	[key: string]: number;
	general: number;
	ballistic: number;
}

export interface FormMods {
	intelligenceMod: number;
	witsMod: number;
	resolveMod: number;

	strengthMod: number;
	dexterityMod: number;
	staminaMod: number;

	presenceMod: number;
	manipulationMod: number;
	composureMod: number;

	sizeMod: number;
	speedMod: number;

	perceptionMod: number;

	defenseCalcMax?: boolean;
	defenseMod?: number;

	armorMod: Armor;
}

export interface Form extends FormMods {
	name: string;
	desc: string;
	traits: string[];

	[index: string]: any;
}