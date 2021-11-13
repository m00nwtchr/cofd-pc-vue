import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter,
	HasIntegrity,
	HasVirtueViceAnchors,
} from ".";
import { HasOrganization } from './mixins';

export class MortalCharacter extends Mixin(BaseCharacter, HasIntegrity, HasVirtueViceAnchors, HasOrganization) {}