import { createApp } from "vue";
import App from "./App.vue";

import store, { Characters } from "./store";
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



import Character, { createCharacter } from "./definitions/Character";
import { EnumSplat } from "./definitions/Splat";
import { WebGLDiceRoller } from "./components/sheetComponents/diceRoller/3DDiceRoller";

const app = createApp(App);

app.use(store)
	.use(router)
	.use(i18n)
	// .use(Vuetify)
	// .use(BootstrapVue)
	.mount("#app");

const characters: { [index: string]: Character | any } = {
	"488669fb-7e01-4ed7-b368-fbba0d37379a": {
		"name": "Darren Webb",
		"splat": EnumSplat.VAMPIRE,
		"player": "m00n",
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
			"animalism": {
				"name": "Animalism",
				"level": 1
			},
			"dominate":{
				"name": "Dominate",
				"level": 2
			},
			"coil of the voivode": {
				"name": "Coil of the Voivode",
				"level": 1
			}
		},
		"merits": {
			"ordo_dracul_status": {
				"name": "Ordo Dracul Status",
				"level": 1
			},
			"city_status": {
				"name": "City Status",
				"level": 1
			},
			"cacophony_savvy": {
				"name": "Cacophony Savvy",
				"level": 3
			},
			"fast-talking": {
				"name": "Fast-Talking",
				"level": 1
			},
			"professional_training": {
				"name": "Professional Training",
				"level": 2
			},
			"feeding_grounds": {
				"name": "Feeding Grounds",
				"level": 0
			},
			"sleight_of_hand": {
				"name": "Sleight of Hand",
				"level": 0
			},
			"striking_looks": {
				"name": "Striking Looks",
				"level": 0
			},
			"honey_trap": {
				"name": "Honey Trap",
				"level": 0
			},
			"safe_place": {
				"name": "Safe Place",
				"level": 3
			},
			"contacts": {
				"name": "Contacts",
				"level": 2
			},
			"resources": {
				"name": "Resources",
				"level": 3
			},
			"nest_guardian": {
				"name": "Nest Guardian",
				"level": 3
			}
		},
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 8,
		"integrityTrait": 7,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 1,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"chronicle": "Chicago: Night Trains",
		"concept": "Occult Journalist Mastermind",
		"virtueAnchor": "Scholar",
		"viceAnchor": "Authoritarian",
		"subType": "Ventrue",
		"organization": "Ordo Dracul",
		"legacy": "",
		"baseAttributes": {
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
		"willpower": 1,
		"touchstones": [null, null, null, null, null, null, {name: "Therapist"}]
	},
	"88f0cd49-41d6-42cb-9c66-07214cc910f1": {
		"skills": {},
		"abilities": [],
		"merits": [],
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 0,
		"integrityTrait": 7,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 0,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"name": "Troll Mc. Trollface",
		"splat": EnumSplat.MORTAL,
		"age": 1000,
		"player": "That Guy",
		"chronicle": "The Troll Chronicle",
		"concept": "Ultimate Troller",
		"virtueAnchor": "eh",
		"viceAnchor": "whatever",
		"faction": "The Trollers",
		"organization": "The Mystery Troll Cult",
		"baseAttributes": {
			"intelligence": 3,
			"wits": 3,
			"resolve": 2,
			"strength": 1,
			"dexterity": 3,
			"stamina": 2,
			"presence": 3,
			"manipulation": 2,
			"composure": 3
		}
	},
	"86d23c4e-d887-46d2-ba5e-d472d87f1533": {
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
			"forces": {
				"level": 1
			},
			"matter":{
				"level": 1
			},
			"mind":{
				"level": 3
			},
			"space":{
				"level": 1
			},
			"time":{
				"level": 2
			}
		},
		"merits": {
			"mysterium_order_status": {
				"name": "Mysterium Order Status",
				"level": 1
			},
			"high_speech": {
				"name": "High Speech",
				"level": 1
			},
			"shadow_name": {
				"name": "Shadow Name",
				"level": 3
			},
			"occultation": {
				"name": "Occultation",
				"level": 3
			},
			"resources": {
				"name": "Resources",
				"level": 2
			},
			"safe_place": {
				"name": "Safe Place",
				"level": 2
			},
			"trained_observer": {
				"name": "Trained Observer",
				"level": 3
			}
		},
		rotes: [
			{arcanum: "Mind", level: 1, spell: "Mental Scan", roteSkill: "occult"},
			{arcanum: "Mind", level: 2, spell: "Psychic Domination", roteSkill: "subterfuge"},
			{arcanum: "Time", level: 1, spell: "Postcognition", roteSkill: "investigation"},
		],
		yantras: [
			"High Speech (+2)",
			"Shadow Name (+3)"
		],
		praxes: [
			"Know Nature",
			"Choose the Threads"
		],
		"spentWillpowerDots": 0,
		"power": 2,
		"fuel": 11,
		"integrityTrait": 7,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 1,
		"experience": 2,
		"alternateBeats": 0,
		"alternateExperience": 1,
		"name": "Moonwatcher",
		"splat": EnumSplat.MAGE,
		"player": "m00n",
		"chronicle": "What Lurks Below",
		"concept": "Technomancer/Computer Programmer",
		"virtueAnchor": "Patient",
		"viceAnchor": "Greedy",
		"subType": "Mastigos",
		"organization": "Mysterium",
		"legacy": "",
		"baseAttributes": {
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
		"willpower": 5
	},
	"b153b71d-57b0-488e-8a14-165f0ebc5b20": {
		"skills": {
			"investigation": 2,
			"medicine": 2,
			"athletics": 2,
			"brawl": 3,
			"stealth": 2,
			"survival": 3,
			"intimidation": 3,
			"persuasion": 4
		},
		"specialties": {
			"brawl": ["Claws"],
			"stealth": ["Stalking"],
			"intimidation": ["Direct Threats"]
		},
		"abilities": {
			"purity":{
				"level": 3,
				"name": "Purity"
			},
			"glory": {
				"level": 1,
				"name": "Glory"
			}
		},
		"merits": {
			"giant": {
				"name": "Giant",
				"level": 3
			},
			"trained_observer": {
				"name": "Trained Observer",
				"level": 1
			},
			"defensive_combat_(brawl)": {
				"name": "Defensive Combat (Brawl)",
				"level": 1,
				"skill": "brawl",
				"use": true
			},
			"favored_form_(gauru)": {
				"name": "Favored Form (Gauru)",
				"level": 2,
				"form": "gauru",
				"physicalSkill": "brawl",
				"attribute": "strength",
				"penaltyChoice1": [ "urhan", "stamina" ],
				"penaltyChoice2": [ "dalu", "stamina" ]
			},
			"efficient_killer": {
				"name": "Efficient Killer",
				"level": 2
			},
			"relentless_assault": {
				"name": "Relentless Assault",
				"level": 2
			},
			"language": {
				"name": "Language",
				"level": 1
			},
			"totem": {
				"name": "Totem",
				"level": 1
			},
			"fortified_form_(dalu)": {
				"name": "Fortified Form (Dalu)",
				"level": 0,
				"form": "dalu"
			}
		},
		"healthTrack": [
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		"spentWillpowerDots": 0,
		"power": 3,
		"fuel": 7,
		"integrityTrait": 7,
		"touchstones": [{name: "The Old Gang"}, {name: "The Ambitious Totem"}],
		// "size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 0,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"currentForm": "hishu",
		"name": "Amos Gray",
		"splat": EnumSplat.WEREWOLF,
		"player": "m00n",
		"chronicle": "",
		"concept": "",
		"virtueAnchor": "Destroyer",
		"viceAnchor": "Lone Wolf",
		"subType": "Rahuhuehue",
		"moonGift1": {
			"name": "Custom Gift",
			"level": 4,
			"key": "custom"
		},
		"organization": "Blood Talons",
		"legacy": "",
		"baseAttributes": {
			"intelligence": 1,
			"wits": 3,
			"resolve": 2,
			"strength": 3,
			"dexterity": 2,
			"stamina": 3,
			"presence": 3,
			"manipulation": 1,
			"composure": 3
		},
		"kuruthTriggers": {
			"passive": "Your auspice moon is in the sky.",
			"common": "You witness your auspice moon in the sky.",
			"specific": "Hear a wolf or werewolf howl when your auspice moon is in the sky."
		}
	},
	// "db32e1fe-f3c3-4b80-b5b1-b86ad99124de": {
	// 	"splat": EnumSplat.CHANGELING,
	// 	"baseAttributes": {
	// 		"intelligence": 1,
	// 		"wits": 3,
	// 		"resolve": 2,
	// 		"strength": 3,
	// 		"dexterity": 2,
	// 		"stamina": 3,
	// 		"presence": 3,
	// 		"manipulation": 1,
	// 		"composure": 3
	// 	},
	// }
};

if (import.meta.env.MODE === "development" || Object.keys(store.state.characters || {}).length === 0) {
	store.commit("UPDATE_CHARACTERS", characters);
}

(window as any).export = (): void => {
	const chara = {} as Characters;
	Object.entries(store.state.characters)
		.map(entry => [entry[0],createCharacter(entry[1])] as [string, Character])
		.forEach(entry => {
			chara[entry[0]] = entry[1];
		});
	store.commit("UPDATE_CHARACTERS", chara);

	console.log(store.getters.export);
};

// new WebGLDiceRoller(document.body, {dimensions:{x:500,y:500}});

