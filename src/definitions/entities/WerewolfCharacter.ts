import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter, HasIntegrity,
} from ".";
import { EnumSplat } from "..";

import {SupernaturalWithFuel} from "./SupernaturalWithFuel";

export class WerewolfCharacter extends Mixin(BaseCharacter, SupernaturalWithFuel, HasIntegrity) { 
	constructor() {
		super();
		this._splat = EnumSplat.WEREWOLF;
	}
}
