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
const app = createApp(App);

app.use(store)
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
		"merits": [
			{
				"name": "Ordo Dracul Status",
				"level": 1
			},
			{
				"name": "City Status",
				"level": 1
			},
			{
				"name": "Cacophony Savvy",
				"level": 3
			},
			{
				"name": "Fast-Talking",
				"level": 1
			},
			{
				"name": "Professional Training",
				"level": 2
			},
			{
				"name": "Feeding Grounds",
				"level": 0
			},
			{
				"name": "Sleight of Hand",
				"level": 0
			},
			{
				"name": "Striking Looks",
				"level": 0
			},
			{
				"name": "Honey Trap",
				"level": 0
			},
			{
				"name": "Safe Place",
				"level": 3
			},
			{
				"name": "Contacts",
				"level": 2
			}
		],
		"spentWillpowerDots": 0,
		"power": 1,
		"fuel": 8,
		"integrityTrait": 7,
		// "size": 5,
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
		// "size": 5,
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
		"abilities": {
			"forces": {
				"name": "Forces",
				"level": 1
			},
			"matter":{
				"name": "Matter",
				"level": 1
			},
			"mind":{
				"name": "Mind",
				"level": 3
			},
			"space":{
				"name": "Space",
				"level": 1
			},
			"time":{
				"name": "Time",
				"level": 2
			}
		},
		"merits": [
			{
				"name": "Mysterium Order Status",
				"level": 1
			},
			{
				"name": "High Speech",
				"level": 1
			},
			{
				"name": "Shadow Name",
				"level": 3
			},
			{
				"name": "Occultation",
				"level": 3
			},
			{
				"name": "Resources",
				"level": 2
			},
			{
				"name": "Safe Place",
				"level": 2
			},
			{
				"name": "Trained Observer",
				"level": 3
			}
		],
		"spentWillpowerDots": 0,
		"power": 2,
		"fuel": 11,
		"integrityTrait": 7,
		// "size": 5,
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
		"merits": [
			{
				"name": "Giant",
				"dots": 0,
				"level": 3
			},
			{
				"name": "Trained Observer",
				"dots": 0,
				"level": 1
			},
			{
				"name": "Defensive Combat (Brawl)",
				"dots": 0,
				"level": 1
			},
			{
				"name": "Favored Form (Gauru)",
				"dots": 0,
				"level": 2
			},
			{
				"name": "Efficient Killer",
				"dots": 0,
				"level": 2
			},
			{
				"name": "Relentless Assault",
				"dots": 0,
				"level": 2
			},
			{
				"name": "Language",
				"dots": 0,
				"level": 1
			},
			{
				"name": "Totem",
				"dots": 0,
				"level": 1
			}
		],
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
		"touchstones": [],
		// "size": 5,
		"armor": {
			"general": 0,
			"ballistic": 0
		},
		"beats": 0,
		"experience": 0,
		"alternateBeats": 0,
		"alternateExperience": 0,
		"roteSkills": [],
		"currentForm": "hishu",
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
	}
};

// Object.keys(characters).forEach(key => {
// 	characters[key] = Object.assign({}, new Character({splat: characters[key].splat}), characters[key]);
// });


if (process.env.NODE_ENV === "development" || !localStorage.characters) {
	localStorage.characters = JSON.stringify(characters);
}

(window as any).export = (): void => {
	const url = `data:application/json;base64,${btoa(JSON.stringify(JSON.parse(localStorage.characters),null,"\t"))}`;
	console.log(url);
};