import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter,
	HasIntegrity,
	HasVirtueViceAnchors,
	HasLegacy,
	HasTouchstones,
	JSONMixin,
	HasOrganization,
	Character,
	proxy
} from ".";
import { Ability, Attributes, EnumSplat, Form, SPLATS } from "..";

import { SupernaturalWithFuel } from "./SupernaturalWithFuel";


function _getForm(character: WerewolfCharacter, key: string) {
	const forms = character.splat.forms as { [key: string]: Form };
	const form = forms[key];

	const def = (attr: string) =>
		({ [attr + "Mod"]: { get: () => form[attr + "Mod"] + character.meritTraitMods[key + attr + "mod"] } });

	// console.log(character.meritTraitMods);

	return Object.defineProperties({ ...form } as Form, {
		...def("intelligence"),
		...def("wits"),
		...def("resolve"),

		...def("strength"),
		...def("dexterity"),
		...def("stamina"),

		...def("presence"),
		...def("manipulation"),
		...def("composure"),
		// intelligenceMod: { get: () => form.intelligenceMod + character.meritTraitMods[key+"intelligencemod"] },
		// witsMod:         { get: () => form.witsMod + character.meritTraitMods[key+"intelligencemod"] },
		// resolveMod:      { get: () => form.resolveMod + character.meritTraitMods[key+"intelligencemod"] },

		// strengthMod:     { get: () => form.strengthMod  + character.meritTraitMods[key+"intelligencemod"] },
		// dexterityMod:    { get: () => form.dexterityMod  + character.meritTraitMods[key+"intelligencemod"] },
		// staminaMod:      { get: () => form.staminaMod  + character.meritTraitMods[key+"intelligencemod"] },

		// presenceMod:     { get: () => form.presenceMod + },
		// manipulationMod: { get: () => form.manipulationMod },
		// composureMod:    { get: () => form.composureMod },
	});
}

interface IWere extends Character {
	currentForm: Form;
}

interface WerewolfInit extends IWere {}
class WerewolfInit {
	protected init() {
		if (hasMixin(this, JSONMixin)) {
			const funcs = this.toJSONFuncs;

			function f(this: any) {
				if (this._currentForm) {
					this.currentForm = this._currentForm;
					delete this._currentForm;
				}
				if (this._moonGift1) {
					this.moonGift1 = this._moonGift1;
					delete this._moonGift1;
				}
				if (this.moonGift2 && !this.moonGift2.name) {
					delete this.moonGift2;
				}

				return this;
			}
			funcs["WerewolfCharacter"] = f;
		}
	}
}

export class WerewolfCharacter extends Mixin(BaseCharacter, WerewolfInit, SupernaturalWithFuel, HasIntegrity, HasVirtueViceAnchors, HasLegacy, HasTouchstones, HasOrganization) {
	// currentForm: Form;

	_currentForm: string = "hishu";
	get currentForm(): Form {
		const f = this.forms[this._currentForm];
		return f || {};
	}
	set currentForm(val: string | Form) {
		this._currentForm = typeof val === "string" ? val : this._currentForm;
	}

	get forms(): { [key: string]: Form } {
		const forms: { [key: string]: Form } = {};
		Object.keys(this.splat.forms || {})
			.forEach(key => forms[key] = _getForm(this, key));
		return forms;
	}

	get attributes(): Attributes {
		const _defProp = (key: string, func: () => number) => ({
			get: () => super.attributes[key] + func(),
			set: (val: number) => super.attributes[key] = val - func(),
			configurable: true
		});
		return Object.defineProperties({}, {
			intelligence: _defProp("intelligence", () => this.currentForm.intelligenceMod),
			wits:         _defProp("wits",         () => this.currentForm.witsMod),
			resolve:     _defProp("resolve",       () => this.currentForm.resolveMod),

			strength:  _defProp("strength",  () => this.currentForm.strengthMod),
			dexterity: _defProp("dexterity", () => this.currentForm.dexterityMod),
			stamina:  _defProp("stamina",    () => this.currentForm.staminaMod),

			presence:     _defProp("presence",     () => this.currentForm.presenceMod),
			manipulation: _defProp("manipulation", () => this.currentForm.manipulationMod),
			composure:    _defProp("composure",    () => this.currentForm.composureMod),
		}) as Attributes;
	}

	get size(): number {
		return super.size + this.currentForm.sizeMod;
	}
	set size(val: number) {
		super.size = val - this.currentForm.sizeMod;
	}

	get speed(): number {
		return super.speed + this.currentForm.speedMod;
	}

	get maxHealth(): number {
		return super.maxHealth + (this.moonGifts.full.level >= 2 ?
			this.abilities.purity.level : 0);
	}

	kuruthTriggers: { passive: string; common: string; specific: string; } = {
		passive: "",
		common: "",
		specific: ""
	};
	huntersAspect: string = "";

	// moonGift1: Ability;

	_moonGift1?: Ability;
	get moonGift1(): Ability {
		if (this.subType.name) {
			const key = (this.subType.moonGifts as string[])[0];
			const renown = this.subType.abilities[0];

			return {
				// name: "splat.werewolf.gift.moon." + key,
				key,
				level: this.abilities[renown].level
			} as Ability;
		}
		return this._moonGift1 || { name: "", key: "", level: 0 } as Ability;
	}
	set moonGift1(val: Ability) {
		if (!this.subType.name) {
			this._moonGift1 = val;
		}
	}
   
	moonGift2?: Ability;

	get moonGifts(): { [key: string]: Ability } {
		const obj: { [key: string]: Ability } = {
			[this.moonGift1.key || ""]: this.moonGift1
		};

		if (this.moonGift2) {
			if (!this.moonGift2.key) this.moonGift2.key = "NEW";
			obj[this.moonGift2.key] = this.moonGift2;
		}

		return proxy(obj, {}, { level: 0 });
	}

	shadowGifts: string[] = [];
	wolfGifts: string[] = [];
	rites: string[] = [];

	get perception(): number {
		return super.perception + this.currentForm.perceptionMod;
	}

	// constructor(opts: IWerewolfCharacter) {
	// 	super(opts);
	// 	this.touchstones = opts.touchstones || [];

	// 	this.moonGift2 = opts.moonGift2 || { name: "", level: 0 };

	// 	const descs = Object.getOwnPropertyDescriptors(this.attributes);

	// 	const _defProp = (key: string, func: () => number) => ({
	// 		get: () => ((descs[key].get || (() => 0))() || 1) + func(),
	// 		set: (val: number) => (descs[key].set || (() => 0))(val - func()),
	// 		configurable: true
	// 	});
	// 	this.attributes = Object.defineProperties(this.attributes, {
	// 		intelligence: _defProp("intelligence", () => this.currentForm.intelligenceMod),
	// 		wits: _defProp("wits", () => this.currentForm.witsMod),
	// 		resolve: _defProp("resolve", () => this.currentForm.resolveMod),

	// 		strength: _defProp("strength", () => this.currentForm.strengthMod),
	// 		dexterity: _defProp("dexterity", () => this.currentForm.dexterityMod),
	// 		stamina: _defProp("stamina", () => this.currentForm.staminaMod),

	// 		presence: _defProp("presence", () => this.currentForm.presenceMod),
	// 		manipulation: _defProp("manipulation", () => this.currentForm.manipulationMod),
	// 		composure: _defProp("composure", () => this.currentForm.composureMod),
	// 	});
	// }

	constructor() {
		super(EnumSplat.WEREWOLF);
	}
}

