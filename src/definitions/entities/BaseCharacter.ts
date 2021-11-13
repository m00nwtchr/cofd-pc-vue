import { Mixin } from 'ts-mixer';
import {
	EarnsBeats,
	HasIntegrity,
	HasLegacy,
	HasMerits,
	HasOrganization,
	HasWoundPenalties
} from ".";

import { CharacterWithSkills } from "./CharacterWithSkills";

export class BaseCharacter extends Mixin(CharacterWithSkills, HasWoundPenalties, EarnsBeats, HasMerits) {}

// export class BaseSplatCharacter extends Mixin(BaseCharacter, HasIntegrity, HasOrganization, HasLegacy) {}