import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "@/assets/fonts/NWoD/stylesheet.css";

import "@/style/style.scss";

import Character from "./definitions/Character";
import { EnumSplat } from "./definitions/Splat";

createApp(App)
	.use(store)
	.use(router)
	// .use(BootstrapVue)
	.mount("#app");

const characters: { [index: string]: Character | any } = {
	"488669fb-7e01-4ed7-b368-fbba0d37379a": {
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
		"abilities": [
			{
				"name": "Animalism",
				"dots": 1
			},
			{
				"name": "Auspex",
				"dots": 0
			},
			{
				"name": "Celerity",
				"dots": 0
			},
			{
				"name": "Dominate",
				"dots": 2
			},
			{
				"name": "Majesty",
				"dots": 0
			},
			{
				"name": "Nightmare",
				"dots": 0
			},
			{
				"name": "Obfuscate",
				"dots": 0
			},
			{
				"name": "Protean",
				"dots": 0
			},
			{
				"name": "Resilience",
				"dots": 0
			},
			{
				"name": "Vigor",
				"dots": 0
			},
			{
				"name": "Coil of the Voivode",
				"dots": 1
			}
		],
		"merits": [
			{
				"name": "Ordo Dracul Status",
				"dots": 1
			},
			{
				"name": "City Status",
				"dots": 1
			},
			{
				"name": "Cacophony Savvy",
				"dots": 3
			},
			{
				"name": "Fast-Talking",
				"dots": 1
			},
			{
				"name": "Professional Training",
				"dots": 2
			},
			{
				"name": "Feeding Grounds",
				"dots": 0
			},
			{
				"name": "Sleight of Hand",
				"dots": 0
			},
			{
				"name": "Striking Looks",
				"dots": 0
			},
			{
				"name": "Honey Trap",
				"dots": 0
			},
			{
				"name": "Safe Place",
				"dots": 3
			},
			{
				"name": "Contacts",
				"dots": 2
			}
		],
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 8,
		"integrityTrait": 7,
		"size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 1,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"roteSkills": [],
		"name": "Darren Webb",
		"splat": 2,
		"player": "m00n",
		"chronicle": "Chicago: Night Trains",
		"concept": "Occult Journalist Mastermind",
		"virtueAnchor": "Scholar",
		"viceAnchor": "Authoritarian",
		"subType": "Ventrue",
		"organization": "Ordo Dracul",
		"legacy": "",
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
		"willpower": 1
	},
	"88f0cd49-41d6-42cb-9c66-07214cc910f1": {
		"skills": {},
		"abilities": [],
		"merits": [],
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 0,
		"integrityTrait": 7,
		"size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 0,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"roteSkills": [],
		"name": "Troll Mc. Trollface",
		"splat": 0,
		"age": 1000,
		"player": "That Guy",
		"chronicle": "The Troll Chronicle",
		"concept": "Ultimate Troller",
		"virtueAnchor": "eh",
		"viceAnchor": "whatever",
		"faction": "The Trollers",
		"organization": "The Mystery Troll Cult",
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
		"abilities": [
			{
				"name": "Death",
				"dots": 0
			},
			{
				"name": "Fate",
				"dots": 0
			},
			{
				"name": "Forces",
				"dots": 1
			},
			{
				"name": "Life",
				"dots": 0
			},
			{
				"name": "Matter",
				"dots": 1
			},
			{
				"name": "Mind",
				"dots": 3
			},
			{
				"name": "Prime",
				"dots": 0
			},
			{
				"name": "Spirit",
				"dots": 0
			},
			{
				"name": "Space",
				"dots": 1
			},
			{
				"name": "Time",
				"dots": 2
			}
		],
		"merits": [
			{
				"name": "Mysterium Order Status",
				"dots": 1
			},
			{
				"name": "High Speech",
				"dots": 1
			},
			{
				"name": "Shadow Name",
				"dots": 3
			},
			{
				"name": "Occultation",
				"dots": 3
			},
			{
				"name": "Resources",
				"dots": 2
			},
			{
				"name": "Safe Place",
				"dots": 2
			},
			{
				"name": "Trained Observer",
				"dots": 3
			}
		],
		"spentWillpowerDots": 0,
		"power": 2,
		"fuel": 11,
		"integrityTrait": 7,
		"size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 1,
		"experience": "2",
		"alternateBeats": 0,
		"alternateExperience": "1",
		"roteSkills": [
			"investigation",
			"occult",
			"survival"
		],
		"name": "Moonwatcher",
		"splat": 1,
		"player": "m00n",
		"chronicle": "What Lurks Below",
		"concept": "Technomancer/Computer Programmer",
		"virtueAnchor": "Patient",
		"viceAnchor": "Greedy",
		"subType": "Mastigos",
		"organization": "Ordo Dracul",
		"legacy": "",
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
		"willpower": 5
	},
	"b153b71d-57b0-488e-8a14-165f0ebc5b20": {
		"skills": {},
		"abilities": [
			{
				"name": "Cunning",
				"dots": 0
			},
			{
				"name": "Glory",
				"dots": 0
			},
			{
				"name": "Honor",
				"dots": 0
			},
			{
				"name": "Purity",
				"dots": 0
			},
			{
				"name": "Wisdom",
				"dots": 0
			}
		],
		"merits": [],
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 0,
		"integrityTrait": 7,
		"size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 0,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"roteSkills": [],
		"name": "Amos Gray",
		"splat": 3,
		"player": "m00n",
		"chronicle": "",
		"concept": "",
		"virtueAnchor": "Destroyer",
		"viceAnchor": "Lone Wolf",
		"subType": "Rahu",
		"organization": "Blood Talons",
		"legacy": "",
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
		}
	}
};

Object.keys(characters).forEach(key => {
	characters[key] = Object.assign({}, new Character({splat: characters[key].splat}), characters[key]);
});


if (process.env.NODE_ENV === "development" || !localStorage.characters) {
	localStorage.characters = JSON.stringify(characters);
}

(window as any).export = (): void => {
	const url = `data:text/plain;base64,${btoa(localStorage.characters)}`;
	console.log(url);
};