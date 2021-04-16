import deepmerge from "deepmerge";
import { computed, ComputedRef, isRef, reactive, Ref, ref, toRefs, WritableComputedRef } from "vue";
import { EnumSplat, Form, FormMods, SPLATS } from "./Splat";

export interface Ability {
	name: string;
	level: number;
}
function sortObj(obj: any) {
	return Object.keys(obj).sort().reduce((result, key) => {
		(result as any)[key] = obj[key];
		return result;
	}, {});
}

export function getNum(val: string): number {
	// return computed(() => {
	// const ret = (() => {
	try {
		return eval(val) || 0;
	} catch (e) {
		return 0;
	}
	// })();

	// return isRef(ret) ? ret : ref(ret);
	// });
}

function def<T>(func: () => T, def?: T): ComputedRef<T> {
	if (!def) def = 0 as any;
	return computed(() => {
		try {
			const val = func();
			// console.log(def);
			// if (def === undefined) {
			// 	if (typeof val === "number") {
			// 		def = 0 as any;
			// 	}
			// }
			// console.log(val, typeof val);

			return val || def;
		} catch (e) {
			return def || 0;
		}
	}) as any;
	// try {
	// 	return func() || def;
	// } catch (e) {
	// 	return def;
	// }
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

// interface IntegrityTrack {}

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

	baseAttributes!: Attributes;
	attributes: ComputedRef<Attributes>;

	skills: { [index: string]: number } = {};
	specialties: { [index: string]: string[] } = {};

	// abilityArr: Ability[] | Ref<Ability[]>;
	abilities: { [index: string]: Ability };

	merits: { [index in number | string]: Ability } = [] as unknown as { [index in number | string]: Ability };

	// abilities: {[index: string]: Ability} = {};;
	// merits: {[index: string]: Ability} = {};


	healthTrack: number[] = [];
	maxHealth: ComputedRef<number>;

	willpower?: number;
	spentWillpowerDots = 0;
	// maxWillpower?: number;

	power = 1; // Gnosis/Primal Urge/Blood Potency

	fuel = 0;
	// maxFuel = 10;

	integrityTrait = ref(7);
	integrityTrack?: number[];

	touchstones: { name: string; type?: string }[] = [];

	conditions: string[] = [];

	baseSize = ref(5);
	size: ComputedRef<number>;

	defense: ComputedRef<number>;

	speed: ComputedRef<number>;
	// defense?: number;
	armor?: { general?: number; ballistic?: number } = {
		general: 0,
		ballistic: 0
	};

	weapons: {
		name: string;
		damage: string;
		range: string;
		clip: string;
		initative: number;
		strength: number;
		size: number;
	}[] = [
		{
			name: "",
			damage: "",
			range: "",
			clip: "",
			initative: 0,
			strength: 0,
			size: 0,
		}
	];

	// initative?: number;

	beats?= 0;
	experience?= 0;

	alternateBeats?= 0;
	alternateExperience?= 0;

	traitMods: {trait: string; mod: Ref<number>|number}[] = reactive([]);

	getNum(arg: string) {
		return getNum.call(this, arg);
	}

	constructor(opts: Character) {
		
		this.addTraitMod("size", def(() => this.merits.giant.level >= 3 ? 1 : 0));

		if (SPLATS[opts.splat].integrityTrackType === "healthTrack") {
			this.integrityTrack = [];
		}

		{
			const defaultAbl: { [index: string]: Ability } = {};

			Object.entries(SPLATS[opts.splat].abilities || {}).forEach((el) => {
				defaultAbl[el[0]] = { name: el[1], level: 0 };
			});
			Object.assign(this, opts);
	
			const ablTemp = Object.assign({}, defaultAbl, (this as any).abilities);

			Object.keys(ablTemp).forEach(key => {
				const value = ablTemp[key];
				const def = defaultAbl[key];

				if (def && value.name != def.name) {
					value.name = def.name;
				}
			});

			this.abilities = reactive(sortObj(ablTemp));
		}
		this.baseAttributes = reactive(this.baseAttributes);
		
		const mod = (name: string) => {
			const na = name.toLowerCase();
			return this.traitMods
				.filter(el => el.trait.toLocaleLowerCase() === na)
				.map(el => el.mod)
				.reduce((prev: any, val: any) => prev+val, 0) || 0;
		};

		this.attributes = computed(() => {
			return {
				intelligence: this.baseAttributes.intelligence + mod("intelligence"),
				wits:         this.baseAttributes.wits         + mod("wits"),
				resolve:      this.baseAttributes.resolve      + mod("resolve"),
	
				strength:     this.baseAttributes.strength     + mod("strength"),
				dexterity:    this.baseAttributes.dexterity    + mod("dexterity"),
				stamina:      this.baseAttributes.stamina      + mod("stamina"),//((self.abilities.value.resilience || {}).level || 0),//vue.getNum("this.character.abilities.value.resilience.level"),
	
				presence:     this.baseAttributes.presence     + mod("presence"),
				manipulation: this.baseAttributes.manipulation + mod("manipulation"),
				composure:    this.baseAttributes.composure    + mod("composure"),
			};
		});
		
		this.size = computed({
			get: () => {
				return this.baseSize.value + mod("size");
			},
			set: (val) => {
				this.baseSize.value = val - mod("size");
			}
		});

		this.maxHealth = computed(() => {
			let val = this.attributes.value.stamina + this.size.value;

			if (this.splat === EnumSplat.WEREWOLF) {
				if (this.subType.toLowerCase() === "rahu") {
					const purity = def(() => this.abilities.purity.level, 0).value;
					val += purity >= 2 ? purity : 0;
				}
			}

			return val;
		});

		this.speed = computed(() => {
			return this.attributes.value.strength + this.attributes.value.dexterity + 5 + mod("speed");
		});

		this.defense = computed(() => {
			return Math.min(this.attributes.value.dexterity, this.attributes.value.wits) + def(() => this.skills.athletics).value + mod("defense");
		});
	}

	addTraitMod(name: string, ref: Ref<number>) {
		this.traitMods.push({trait: name, mod: ref});
	}

	getData() {
		const obj = Object.assign({}, this) as any;

		delete obj.traitMods;

		return obj;
	}
}

export class MageCharacter extends Character {
	activeSpells!: string[];
	yantras!: string[];
	magicalTools!: string[];
	praxes!: string[];
	inuredSpells!: string[];

	rotes!: {
		arcanum: string;
		level: number;
		spell: string;
		creator?: string;
		roteSkill: string;
	}[];

	constructor(opts: MageCharacter) {
		super(opts as any);

		this.activeSpells = [];
		this.yantras = [];
		this.magicalTools = [];
		this.praxes = [];
		this.inuredSpells = [];

		this.rotes = [];
	}
}

export class VampireCharacter extends Character {
	constructor(opts: VampireCharacter) {
		super(opts as any);

		this.addTraitMod("stamina", def(() => this.abilities.resilience.level));
		this.addTraitMod("strength", def(() => this.abilities.vigor.level));

		this.addTraitMod("defense", def(() => this.abilities.celerity.level));
	}
}

export class WerewolfCharacter extends Character {

	currentForm: Ref<string> = ref("hishu");
	// currentFormObj!: ComputedRef<Form>;
	baseFormMods!: { [key: string]: FormMods };

	kuruthTriggers?: { passive: string; common: string; specific: string };

	constructor(opts: WerewolfCharacter) {
		super(opts);

		this.baseFormMods = opts.baseFormMods || {};
		this.kuruthTriggers = { passive: "", common: "", specific: "" };

		this.addTraitMod("strength",     def(() => this.currentFormObj().value.strengthMod));
		this.addTraitMod("dexterity",    def(() => this.currentFormObj().value.dexterityMod));
		this.addTraitMod("stamina",      def(() => this.currentFormObj().value.staminaMod));
		this.addTraitMod("manipulation", def(() => this.currentFormObj().value.manipulationMod));

		this.addTraitMod("size",       def(() => this.currentFormObj().value.sizeMod));
		this.addTraitMod("speed",      def(() => this.currentFormObj().value.speedMod));
		this.addTraitMod("perception", def(() => this.currentFormObj().value.perceptionMod));

		// this.currentFormObj = computed({
		// 	get() {
		// 		const form = vue.splat.forms && self.currentForm ? vue.splat.forms[self.currentForm.value] : {
		// 			name: "",
		// 			desc: "",
		// 			dexterityMod: 0,
		// 			manipulationMod: 0,
		// 			perceptionMod: 0,
		// 			sizeMod: 0,
		// 			staminaMod: 0,
		// 			strengthMod: 0,
		// 			speedMod: 0,
		// 			traits: []
		// 		};

		// 		const baseMod = self.currentForm && self.baseFormMods[self.currentForm.value] ? self.baseFormMods[self.currentForm.value] : {
		// 			dexterityMod: 0,
		// 			manipulationMod: 0,
		// 			perceptionMod: 0,
		// 			sizeMod: 0,
		// 			staminaMod: 0,
		// 			strengthMod: 0,
		// 			speedMod: 0,
		// 		};

		// 		console.log("baseMod", baseMod);

		// 		const e = Object.assign({}, form, {
		// 			dexterityMod: form.dexterityMod + baseMod.dexterityMod,
		// 			manipulationMod: form.manipulationMod + baseMod.manipulationMod,
		// 			perceptionMod: form.perceptionMod + baseMod.perceptionMod,
		// 			sizeMod: form.sizeMod + baseMod.sizeMod,
		// 			staminaMod: form.staminaMod + baseMod.staminaMod,
		// 			strengthMod: form.strengthMod + baseMod.strengthMod,
		// 			speedMod: form.speedMod + baseMod.speedMod
		// 		});
		// 		console.log(e);
		// 		return e;
		// 	}, set(val) {
		// 		console.log("EEE");
		// 		if (self.currentForm) {
		// 			// if (!self.baseFormMods[self.currentForm.value]) {
		// 			// 	self.baseFormMods[self.currentForm.value] = {} as any;
		// 			// }
		// 			const form = vue.splat.forms && self.currentForm ? vue.splat.forms[self.currentForm.value] : {
		// 				name: "",
		// 				desc: "",
		// 				dexterityMod: 0,
		// 				manipulationMod: 0,
		// 				perceptionMod: 0,
		// 				sizeMod: 0,
		// 				staminaMod: 0,
		// 				strengthMod: 0,
		// 				speedMod: 0,
		// 				traits: []
		// 			};

		// 			const baseMod = self.currentForm && self.baseFormMods[self.currentForm.value] ? self.baseFormMods[self.currentForm.value] : {
		// 				dexterityMod: 0,
		// 				manipulationMod: 0,
		// 				perceptionMod: 0,
		// 				sizeMod: 0,
		// 				staminaMod: 0,
		// 				strengthMod: 0,
		// 				speedMod: 0,
		// 			};

		// 			val = Object.assign({}, form, val);

		// 			self.baseFormMods[self.currentForm.value] = {
		// 				dexterityMod: val.dexterityMod - form.dexterityMod,
		// 				manipulationMod: val.manipulationMod - form.manipulationMod,
		// 				perceptionMod: val.perceptionMod - form.perceptionMod,
		// 				sizeMod: val.sizeMod - form.sizeMod,
		// 				staminaMod: val.staminaMod - form.staminaMod,
		// 				strengthMod: val.strengthMod - form.strengthMod,
		// 				speedMod: val.speedMod - form.speedMod
		// 			};
		// 		}
		// 	}
		// });
	}

	currentFormObj(): WritableComputedRef<Form> {
		return this.getForm(this.currentForm);
	}

	getForm(name: Ref<string> | string): WritableComputedRef<Form> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		const vue = (window as any).vue;
		
		return computed({
			get() {
				const key = isRef(name) ? name.value : name;

				const form = vue.splat.forms[key] || {
					name: "",
					desc: "",
					dexterityMod: 0,
					manipulationMod: 0,
					perceptionMod: 0,
					sizeMod: 0,
					staminaMod: 0,
					strengthMod: 0,
					speedMod: 0,
					traits: []
				};

				const baseMod = Object.assign({
					dexterityMod: 0,
					manipulationMod: 0,
					perceptionMod: 0,
					sizeMod: 0,
					staminaMod: 0,
					strengthMod: 0,
					speedMod: 0,
				}, self.baseFormMods[key]);

				// self.baseFormMods[key] = baseMod;

				return Object.assign({}, form, {
					dexterityMod:    form.dexterityMod    + baseMod.dexterityMod,
					manipulationMod: form.manipulationMod + baseMod.manipulationMod,
					perceptionMod:   form.perceptionMod   + baseMod.perceptionMod,
					sizeMod:         form.sizeMod         + baseMod.sizeMod,
					staminaMod:      form.staminaMod      + baseMod.staminaMod,
					strengthMod:     form.strengthMod     + baseMod.strengthMod,
					speedMod:        form.speedMod        + baseMod.speedMod
				});
			},
			set(val) {
				const key = isRef(name) ? name.value : name;

				const form = vue.splat.forms[key] || {
					name: "",
					desc: "",
					dexterityMod: 0,
					manipulationMod: 0,
					perceptionMod: 0,
					sizeMod: 0,
					staminaMod: 0,
					strengthMod: 0,
					speedMod: 0,
					traits: []
				};

				val = Object.assign({}, form, val);

				self.baseFormMods[key] = Object.assign({}, {
					dexterityMod:    val.dexterityMod    - form.dexterityMod,
					manipulationMod: val.manipulationMod - form.manipulationMod,
					perceptionMod:   val.perceptionMod   - form.perceptionMod,
					sizeMod:         val.sizeMod         - form.sizeMod,
					staminaMod:      val.staminaMod      - form.staminaMod,
					strengthMod:     val.strengthMod     - form.strengthMod,
					speedMod:        val.speedMod        - form.speedMod
				});
			}
		});
	}

	getForms() {
		const vue = (window as any).vue;
		const forms: {[key: string]: Form} = {};

		Object.keys(vue.splat.forms)
			.forEach(el => forms[el] = this.getForm(el) as any);

		return reactive(forms);
	}
}

export class ChangelingCharacter extends Character {
	constructor(opts: ChangelingCharacter) {
		super(opts as any);
		
		this.integrityTrait = computed(() => {
			const val = this.attributes.value.wits + this.attributes.value.composure;

			return val;
		});
	}
}

export function createCharacter<T extends Character>(opts: T): Character {
	return new SPLATS[opts.splat].characterFactory(opts);
}