import { Mixin } from 'ts-mixer';
import {
	Character,
	JSONMixin,
	HasSkills
} from "./index";

export class CharacterWithSkills extends Mixin(Character, JSONMixin, HasSkills) {
	get defense() { return super.defense + this.skills.athletics; }
}