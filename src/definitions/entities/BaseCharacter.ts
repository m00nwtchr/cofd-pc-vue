import { Mixin } from 'ts-mixer';
import {
	EarnsBeats,
	HasMerits
} from "./index";

import { CharacterWithSkills } from "./CharacterWithSkills";

export class BaseCharacter extends Mixin(CharacterWithSkills, EarnsBeats, HasMerits) {}