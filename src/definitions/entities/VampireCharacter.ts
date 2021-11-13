import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter,
	HasIntegrity,
	HasLegacy,
	HasOrganization,
	HasTouchstones,
	HasVirtueViceAnchors,
} from ".";
import { EnumSplat, Splat } from "..";

import {SupernaturalWithFuel} from "./SupernaturalWithFuel";

export class VampireCharacter extends Mixin(BaseCharacter, SupernaturalWithFuel, HasIntegrity, HasVirtueViceAnchors, HasOrganization, HasLegacy, HasTouchstones) { 
	constructor() {
		super(EnumSplat.VAMPIRE);
	}
}
