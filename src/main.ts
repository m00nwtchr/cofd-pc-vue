import { createApp } from "vue";
import App from "./App.vue";

import { store, key } from "./store";
import router from "./router";
import i18n from "./i18n";

// import "./registerServiceWorker.ts";

// import Vuetify from "./plugins/vuetify";

// import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

import "./assets/fonts/CofD/stylesheet.css";
import "./assets/fonts/WtF/stylesheet.css";
import "./assets/fonts/MtA/stylesheet.css";

import "./style/style.scss";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faDiceD20,
	faCaretDown,
	faCaretRight,
	faBars,
	faPlus,
	faFileExport,
	faFileImport
} from "@fortawesome/free-solid-svg-icons";

library.add(
	faDiceD20, faCaretDown, faCaretRight, faBars, faPlus,
	faFileImport, faFileExport
);
// console.log(library);

import { EnumSplat } from "./definitions";
import { WebGLDiceRoller } from "./components/sheetComponents/diceRoller/3DDiceRoller";

import { Character } from "./definitions";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

(window as any).Character = Character;

const app = createApp(App);

app.use(store, key)
	.use(router)
	.use(i18n)
	.component("font-awesome-icon", FontAwesomeIcon)
	// .use(Vuetify)
	// .use(BootstrapVue)
	.mount("#app");

// (window as any).vue = app;

const characters: { [index: string]: Character | any } = {
	"488669fb-7e01-4ed7-b368-fbba0d37379a": {
		"splat": 2,

		"name": "Darren Webb",
		"player": "m00n",

		"chronicle": "Chicago: Night Trains",
		"concept": "Occult Journalist Mastermind",

		"subType": "ventrue",
		"organization": "ordo_dracul",
		"legacy": "",

		"virtueAnchor": "scholar",
		"viceAnchor": "authoritarian",

		"power": 1,
		"fuel": 8,

		"integrityTrait": 7,
		"touchstones": [null, null, null, null, null, null, { "name": "Therapist" }],

		"attributes": {
			"intelligence": 3,
			"wits": 3,
			"resolve": 2,
			"strength": 1,
			"dexterity": 3,
			"stamina": 2,
			"presence": 3,
			"manipulation": 2,
			"composure": 3
		},
		"skills": {
			"investigation": 2,
			"occult": 3,
			"politics": 2,
			"larceny": 3,
			"stealth": 1,
			"animal_ken": 1,
			"expression": 3,
			"intimidation": 1,
			"streetwise": 2,
			"subterfuge": 4
		},
		"specialties": {
			"larceny": ["Sleight of Hand"],
			"streetwise": ["Rumors"],
			"subterfuge": ["Detecting Lies"]
		},
		"abilities": {
			"animalism": { "level": 1 },
			"dominate": { "level": 2 },
			"coil of the voivode": { "name": "Coil of the Voivode", "level": 1 }
		},
		"merits": {
			"ordo_dracul_status": { "name": "Ordo Dracul Status", "level": 1 },
			"city_status": { "name": "City Status", "level": 1 },
			"cacophony_savvy": { "name": "Cacophony Savvy", "level": 3 },
			"fast-talking": { "name": "Fast-Talking", "level": 1 },
			"professional_training": { "name": "Professional Training", "level": 2 },
			"feeding_grounds": { "name": "Feeding Grounds", "level": 0 },
			"sleight_of_hand": { "name": "Sleight of Hand", "level": 0 },
			"striking_looks": { "name": "Striking Looks", "level": 0 },
			"honey_trap": { "name": "Honey Trap", "level": 0 },
			"safe_place": { "name": "Safe Place", "level": 3 },
			"contacts": { "name": "Contacts", "level": 2 },
			"resources": { "name": "Resources", "level": 3 },
			"nest_guardian": { "name": "Nest Guardian", "level": 3 }
		},

		"spentWillpowerDots": 0,
		"willpower": 1,

		"beats": 0,
		"experience": 1,
	},
	"88f0cd49-41d6-42cb-9c66-07214cc910f1": {
		"splat": 0,

		"name": "Guy",
		"age": 40,

		"player": "That Guy",
		"chronicle": "Oregon Trail",
		"concept": "Archeologist seeking occult power",

		"faction": "",
		"organization": "",

		"virtueAnchor": "ambitious",
		"viceAnchor": "greedy",

		"attributes": {
			"intelligence": 3,
			"wits": 2,
			"resolve": 3,
			"strength": 1,
			"dexterity": 3,
			"stamina": 3,
			"presence": 1,
			"manipulation": 2,
			"composure": 3
		},

		"skills": {
			academics: 3,
			crafts: 2,
			occult: 3,

			athletics: 2,
			stealth: 3,
			survival: 2,
			weaponry: 3,

			animal_ken: 1,
			subterfuge: 3
		},
		"merits": {
			"defensive_combat_(weaponry)": { "name": "Defensive Combat (Weaponry)", "level": 0 },
			"fighting_finesse_(rapier)": { "name": "Fighting Finesse (Rapier)", "level": 2 },
			"light_weapons": { "name": "Light Weapons", "level": 0 },
			"multilingual_(chinese)": { "name": "Multilingual (Chinese)", "level": 1 },
			"danger_sense": { "name": "Danger Sense", "level": 2 },
			"occult_research_(mci)": { "name": "Occult Research (MCI)", "level": 1 }
		},

		"willpower": 6,
		"spentWillpowerDots": 0,

		"integrityTrait": 7,

		"armor": { "general": 0, "ballistic": 0 },

		"beats": 0,
		"experience": 0,
	},
	"86d23c4e-d887-46d2-ba5e-d472d87f1533": {
		"splat": 1,

		"name": "Moonwatcher",
		"player": "m00n",
		"chronicle": "What Lurks Below",
		"concept": "Technomancer/Computer Programmer",

		"virtueAnchor": "patient",
		"viceAnchor": "greedy",

		"subType": "mastigos",
		"organization": "mysterium",

		"power": 2,
		"fuel": 11,

		"integrityTrait": 7,

		"attributes": {
			"intelligence": 3,
			"wits": 3,
			"resolve": 2,
			"strength": 1,
			"dexterity": 3,
			"stamina": 2,
			"presence": 2,
			"manipulation": 3,
			"composure": 3
		},
		"skills": {
			"academics": 1,
			"computer": 4,
			"crafts": 1,
			"investigation": 3,
			"occult": 3,
			"science": 2,
			"stealth": 3,
			"larceny": 4,
			"animal_ken": 1,
			"subterfuge": 3
		},
		"specialties": {
			"computer": ["Hacking"],
			"investigation": ["Cryptography"],
			"occult": ["Goetia"]
		},

		"abilities": {
			"forces": { "level": 1 },
			"matter": { "level": 1 },
			"mind": { "level": 3 },
			"space": { "level": 1 },
			"time": { "level": 2 }
		},
		"merits": {
			"mysterium_order_status": { "name": "Mysterium Order Status", "level": 1 },
			"high_speech": { "name": "High Speech", "level": 1 },
			"shadow_name": { "name": "Shadow Name", "level": 3 },
			"occultation": { "name": "Occultation", "level": 3 },
			"resources": { "name": "Resources", "level": 2 },
			"safe_place": { "name": "Safe Place", "level": 2 },
			"trained_observer": { "name": "Trained Observer", "level": 3 }
		},

		"rotes": [
			{ "arcanum": "Mind", "level": 1, "spell": "Mental Scan", "roteSkill": "occult" },
			{ "arcanum": "Mind", "level": 2, "spell": "Psychic Domination", "roteSkill": "subterfuge" },
			{ "arcanum": "Time", "level": 1, "spell": "Postcognition", "roteSkill": "investigation" }
		],
		"yantras": ["High Speech (+2)", "Shadow Name (+3)"],
		"praxes": ["Know Nature", "Choose the Threads"],
		"nimbus": ["A sense of anxiety/doubt creeping into your head."],
		"magicalTools": ["A small knife", "A short iron rod", "", "Dedicated: Smartphone (Mirror)"],

		"attainments": ["Mind’s Eye", "Temporal Sympathy"],

		"beats": 1, "experience": 2,
		"alternateBeats": 0, "alternateExperience": 1,
		"willpower": 5
	},
	"b153b71d-57b0-488e-8a14-165f0ebc5b20": {
		"splat": 3,
		"name": "Amos Gray",
		"player": "m00n",

		"chronicle": "",
		"concept": "",

		"virtueAnchor": "destroyer",
		"viceAnchor": "lone_wolf",

		"subType": "rahu",
		"organization": "blood_talons",

		"skills": { "investigation": 2, "medicine": 2, "athletics": 2, "brawl": 3, "stealth": 2, "survival": 3, "intimidation": 3, "persuasion": 4 },
		"specialties": { "brawl": ["Claws"], "stealth": ["Stalking"], "intimidation": ["Direct Threats"] },
		"merits": {
			"giant": { "name": "Giant", "level": 3 },
			"trained_observer": { "name": "Trained Observer", "level": 1 },
			"defensive_combat_(brawl)": { "name": "Defensive Combat (Brawl)", "level": 1, "skill": "brawl", "use": true },
			"favored_form_(gauru)": { 
				"name": "Favored Form (Gauru)",
				"level": 2,
				"form": "gauru",
				"physicalSkill": "brawl",
				"attribute": "strength",

				"penaltyChoice1": ["urhan", "stamina"],
				"penaltyChoice2": ["dalu", "stamina"]
			},
			"efficient_killer": { "name": "Efficient Killer", "level": 2 },
			"relentless_assault": { "name": "Relentless Assault", "level": 2 },
			"language": { "name": "Language", "level": 1 },
			"totem": { "name": "Totem", "level": 1 },
			"fortified_form_(dalu)": { "name": "Fortified Form (Dalu)", "level": 0, "form": "dalu" }
		},
		"power": 3, "fuel": 7, "integrityTrait": 7,
		"touchstones": [{ "name": "The Old Gang" }, { "name": "The Ambitious Totem" }],
		"abilities": {
			"cunning": { "level": 0 },
			"glory": { "level": 1 },
			"honor": { "level": 0 },
			"purity": { "level": 3 },
			"wisdom": { "level": 0 }
		},
		"legacy": "",
		"attributes": { "intelligence": 1, "wits": 3, "resolve": 2, "strength": 3, "dexterity": 2, "stamina": 3, "presence": 3, "manipulation": 1, "composure": 3 },
		"kuruthTriggers": { "passive": "Your auspice moon is in the sky.", "common": "You witness your auspice moon in the sky.", "specific": "Hear a wolf or werewolf howl when your auspice moon is in the sky." },
		"moonGift2": { "name": "", "level": 0 }, "shadowGifts": ["-Gift of Rage", "Slaughterer (Purity)", " -Gift of Strength", "Primal Strength (Purity)"], "wolfGifts": ["The Father's Form"],
		"rites": ["Sacred Hunt (••)"],
		"huntersAspect": "Dominant"
	}
};
if (import.meta.env.MODE === "development" && Object.keys(store.state.characters || {}).length === 0) {
	store.commit("UPDATE_CHARACTERS", characters);
	console.log(store.state);
// debugger;
}
if (import.meta.env.MODE === "development") {
	// store.state.debug = true;
	store.commit("UPDATE_ENV", true);
}

// (window as any).export = (): void => {
// 	const chara = {} as Characters;
// 	Object.entries(store.state.characters)
// 		.map(entry => [entry[0], createCharacter(entry[1])] as [string, Character])
// 		.forEach(entry => {
// 			chara[entry[0]] = entry[1];
// 		});
// 	store.commit("UPDATE_CHARACTERS", chara);

// 	console.log(store.getters.export);
// };

// new WebGLDiceRoller(document.body, {dimensions:{x:500,y:500}});

