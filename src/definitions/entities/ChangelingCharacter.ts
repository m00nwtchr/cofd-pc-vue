import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter,
	HasIntegrity,
	HasVirtueViceAnchors,
	HasLegacy,
	HasTouchstones
} from ".";
import { EnumSplat } from "..";
import { HasIntegrityHealth } from './mixins';

import {SupernaturalWithFuel} from "./SupernaturalWithFuel";

export class ChangelingCharacter extends Mixin(BaseCharacter, SupernaturalWithFuel, HasIntegrity, HasVirtueViceAnchors, HasLegacy, HasTouchstones, HasIntegrityHealth) { 
	constructor() {
		super(EnumSplat.CHANGELING);
	}
}
