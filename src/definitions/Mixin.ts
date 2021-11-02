import { Mixin } from 'ts-mixer';

interface Attributes {
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


interface ICharacter {

	name: string;
	
	attributes: Attributes;

	maxHealth: number;
	healthTrack: number[];

	willpower: number;
	maxWillpower: number;
	spentWillpowerDots: number;

	size: number;
	speed: number;
	defense: number;
	// armor: Armor;
	initative: number;
	perception: number;
}

class Character implements ICharacter {
	name: string;

	attributes: Attributes;


	get maxHealth() { return this.size + this.attributes.stamina; }
	healthTrack = [];

	get maxWillpower() { return this.attributes.resolve + this.attributes.composure; }
	willpower = 0;
	spentWillpowerDots = 0;

	size = 5;
	get speed() { return this.attributes.strength + this.attributes.dexterity + 5 }
	get defense() { return Math.min(this.attributes.dexterity, this.attributes.wits) }
	// armor: Armor;
	get initative() { return this.attributes.dexterity + this.attributes.composure }
	get perception() { return this.attributes.wits + this.attributes.composure }

	constructor(name: string) { 
		this.name = name;
		this.attributes = {
			composure: 0,
			dexterity: 0,
			intelligence: 0,
			manipulation: 0,
			presence: 0,
			resolve: 0,
			stamina: 0,
			strength: 0,
			wits: 0
		};
	}

}
