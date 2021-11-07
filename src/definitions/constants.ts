export const ATTRIBUTES = [
	["intelligence", "wits", "resolve"],
	["strength", "dexterity", "stamina"],
	["presence", "manipulation", "composure"],
];

export type MentalSkill   = "academics"  | "computer" | "crafts"     | "investigation" | "medicine"   | "occult"    | "politics"   | "science";
export type PhysicalSkill = "athletics"  | "brawl"    | "drive"      | "firearms"      | "stealth"    | "stealth"   | "survival"   | "weaponry";
export type SocialSkill   = "animal_ken" | "empathy"  | "expression" | "intimidation"  | "persuasion" | "socialize" | "streetwise" | "subterfuge";

export type Skill = MentalSkill | PhysicalSkill | SocialSkill;

export const SKILLS = [
	[
		"academics",
		"computer",
		"crafts",
		"investigation",
		"medicine",
		"occult",
		"politics",
		"science",
	],
	[
		"athletics",
		"brawl",
		"drive",
		"firearms",
		"larceny",
		"stealth",
		"survival",
		"weaponry",
	],
	[
		"animal_ken",
		"empathy",
		"expression",
		"intimidation",
		"persuasion",
		"socialize",
		"streetwise",
		"subterfuge",
	],
];