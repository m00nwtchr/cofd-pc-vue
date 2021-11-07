import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter, HasIntegrity,
} from ".";
import { EnumSplat } from "..";

export class MortalCharacter extends Mixin(BaseCharacter, HasIntegrity) { 
	constructor() {
		super();
	}
}
