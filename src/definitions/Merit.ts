/* eslint-disable no-fallthrough */
import { RefType, toObject } from "../Util";
import { Ability, Character, SKILLS, EnumSplat, SPLATS, ATTRIBUTES, Form } from ".";

const WEREWOLF_FORMS = (SPLATS[EnumSplat.WEREWOLF] as any).forms as { [key: string]: Form };

export interface Modifier {
	trait: string;
	mod: number | (() => number);
}

type LType = { [key: string]: string } | string[];

interface Option {
	name: string;
	list?: LType;
	lists?: LType[];
	bool?: boolean;
}

export class Merit implements Ability {
	key?: string;
	name?: string;
	level: number;

	// character: Character;

	constructor(character: Character, ability: Ability) {
		// this.character = character;

		this.name = ability.name;
		this.level = ability.level;

		Object.assign(this, ability);
	}

	getOptions(): Option[] {
		return [];
	}

	getTraitMods(character: Character): Modifier[] {
		return [];
	}

	// getData() {
	// 	const data = Object.assign({}, this) as any;
	// 	delete data.character;
	// 	return data;
	// }
}

class GiantMerit extends Merit {
	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(): Modifier[] {
		return [
			{ trait: "size", mod: () => this.level >= 3 ? 1 : 0 }
		];
	}
}

class SmallFramedMerit extends Merit {
	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(): Modifier[] {
		return [
			{ trait: "size", mod: () => this.level >= 2 ? -1 : 0 }
		];
	}
}


class FavoredFormMerit extends Merit {

	form!: string;
	physicalSkill!: string;
	attribute!: string;
	secondAttribute!: string;
	skill!: string;

	penaltyChoice1?: string[];
	penaltyChoice2?: string[];
	penaltyChoice3?: string[];
	penaltyChoice4?: string[];
	penaltyChoice5?: string[];

	// [index: string]: s

	constructor(character: Character, ability: Ability) {
		super(character, ability);

		this.getOptions().forEach(el => {
			// (this as any)[el.name] = (ability as any)[el.name] || ;
		});
	}

	getTraitMods(): Modifier[] {
		return [
			{ trait: this.form + this.attribute + "mod", mod: () => this.level >= 2 ? 1 : 0 },
			{ trait: this.form + this.secondAttribute + "mod", mod: () => this.level >= 4 ? 1 : 0 },
			...Array.from({ length: this.level }, (v, k) => k + 1).map(index => {
				const name = "penaltyChoice" + index;
				const val = (this as any)[name];

				if (val && val[0] && val[1]) {
					return { trait: val[0] + val[1] + "mod", mod: -1 };
				}
				return {};
			}).filter(el => el.trait) as Modifier[]
		];
	}

	getOptions(): Option[] {
		const formsObj: { [key: string]: string } = {};
		Object.entries(WEREWOLF_FORMS).forEach(entry => {
			formsObj[entry[0]] = (entry[1] as any).name;
		});

		// delete formsObj["hishu"];

		const opts: Option[] = [
			{
				name: "form",
				list: toObject(Object.entries(formsObj).filter(el => el[0] !== "hishu"))
			}
		];

		if (this.form) {
			const formObj = WEREWOLF_FORMS[this.form];

			const formAttrs: string[] = ATTRIBUTES.flat();

			Object.keys(formObj).forEach(key => {
				const val = (formObj as any)[key];

				if (typeof val == "number") {
					if (val < 0) {
						formAttrs.splice(formAttrs.indexOf(key.substr(0, key.length - 3)));
					}
				}
			});

			switch (this.level) {
			case (5):
				opts.push({
					name: "skill",
					list: SKILLS.flat()
				});
			case (4):
				opts.push({
					name: "secondAttribute",
					list: formAttrs.filter(el => el !== this.attribute)
				});
			case (3):
				opts.push({
					name: "facet"
				});
			case (2):
				opts.push({
					name: "attribute",
					list: formAttrs
				});
			case (1):
				opts.push({
					name: "physicalSkill",
					list: SKILLS[1]
				});
				break;
			}

			const penaltyForms = toObject(Object.entries(formsObj)
				.filter(el => el[0] !== this.form));

			const penaltyAttrs = [
				...ATTRIBUTES[0],
				...ATTRIBUTES[1]
			];

			for (let index = 1; index < this.level + 1; index++) {
				const name = "penaltyChoice" + index;
				if (!(this as any)[name]) {
					(this as any)[name] = [];
				}
				opts.push({
					name,
					lists: [penaltyForms, penaltyAttrs],
					// bindObj: this.penalties
				});
			}
		}
		return opts;
	}
}

class DefensiveCombatMerit extends Merit {

	skill!: string;

	use!: boolean;

	private static SKILLS = ["brawl", "weaponry"];

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(character: Character): Modifier[] {
		return [
			{
				trait: "defense", mod: () => this.level >= 1 &&
					DefensiveCombatMerit.SKILLS.includes(this.skill) &&
					this.use ? (-character.skills.athletics || 0) + character.skills.brawl : 0
			}
		];
	}

	getOptions(): Option[] {
		const opts: Option[] = [
			{
				name: "skill",
				list: DefensiveCombatMerit.SKILLS
			},
			{
				name: "use",
				bool: true
			}
		];

		return opts;
	}
}

class FortifiedFormMerit extends Merit {

	form!: string;

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(): Modifier[] {
		return [
			{ trait: this.form + "generalarmormod", mod: this.level >= 5 ? 2 : this.level >= 3 ? 1 : 0 },
			{ trait: this.form + "ballisticarmormod", mod: this.level === 4 ? 1 : this.level >= 5 ? 2 : 0 }
		];
	}

	getOptions(): Option[] {
		const formsObj: { [key: string]: string } = {};
		Object.entries(WEREWOLF_FORMS).forEach(entry => {
			formsObj[entry[0]] = (entry[1] as any).name;
		});

		delete formsObj["hishu"];

		const opts: Option[] = [
			{
				name: "form",
				list: formsObj
			}
		];

		return opts;
	}
}

class LivingWeaponMerit extends Merit {

	form!: string;
	weapon!: string;

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(): Modifier[] {
		return [
			{ trait: this.form + this.weapon + "damagemod", mod: this.level >= 4 ? 1 : 0 },
		];
	}

	getOptions(): Option[] {
		const formsObj: { [key: string]: string } = {};
		Object.entries((SPLATS[EnumSplat.WEREWOLF] as any).forms).forEach(entry => {
			formsObj[entry[0]] = (entry[1] as any).name;
		});

		delete formsObj["hishu"];

		return [
			{
				name: "form",
				list: formsObj
			},
			{
				name: "weapon",
				list: ["bite", "claws"]
			}
		];
	}
}


class EmbodimentOfTheFirstbornMerit extends Merit {

	attribute!: string;

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods() {
		return [
			{ trait: this.attribute, mod: this.level >= 5 ? 1 : 0 },
		];
	}

	getOptions(): Option[] {
		return [{
			name: "attribute",
			list: ATTRIBUTES.flat()
		}];
	}
}

class InstinctiveDefenseMerit extends Merit {

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(): Modifier[] {
		const mod = () => this.level >= 2 ? 1 : 0;

		return [
			{ trait: "urhandefensecalcmax", mod },
			{ trait: "urshuldefensecalcmax", mod }
		];
	}
}

class DistillationOfFormMerit extends Merit {

	constructor(character: Character, ability: Ability) {
		super(character, ability);
	}

	getTraitMods(character: Character): Modifier[] {
		const mod = () => character.power >= 3 && this.level >= 4 ? 1 : 0;

		return [
			{ trait: "gaurusizemod", mod },
			{ trait: "gaurustrengthmod", mod },

			{ trait: "urshulsizemod", mod },
			{ trait: "urshultrengthmod", mod },
		];
	}
}

function createTraitMerit(trait: string, maxLevel = 3, minLevel = 1, bonusMax?: number) {
	return class extends Merit {

		constructor(character: Character, ability: Ability) {
			super(character, ability);
		}

		getTraitMods(): Modifier[] {
			return [
				{ trait, mod: () => this.level >= minLevel ? Math.max(Math.min(this.level, maxLevel), bonusMax || maxLevel) : 0 },
			];
		}
	};
}


export const MERITS: { [index: string]: new (character: Character, ability: Ability) => Merit } = {
	giant: GiantMerit,
	small_framed: SmallFramedMerit,
	defensive_combat: DefensiveCombatMerit,
	fleet_of_foot: createTraitMerit("speed"),
	fast_reflexes: createTraitMerit("initative"),
	iron_stamina: createTraitMerit("woundPenalty"),

	// Werewolf
	favored_form: FavoredFormMerit,
	fortified_form: FortifiedFormMerit,
	living_weapon: LivingWeaponMerit,
	instinctive_defense: InstinctiveDefenseMerit,
	embodiment_of_the_firstborn: EmbodimentOfTheFirstbornMerit,

	// Werewolf - Ivory Claw
	distillation_of_form: DistillationOfFormMerit,

};