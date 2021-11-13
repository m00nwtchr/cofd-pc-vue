import { Mixin, hasMixin } from 'ts-mixer';
import {
	BaseCharacter, 
	EarnsAlternativeBeats, 
	HasIntegrity, 
	HasLegacy, 
	HasOrganization,
	HasVirtueViceAnchors,
} from ".";
import { EnumSplat, Rote } from "..";

import { SupernaturalWithFuel } from "./SupernaturalWithFuel";

export class MageCharacter extends Mixin(BaseCharacter, SupernaturalWithFuel, HasVirtueViceAnchors, HasIntegrity, HasOrganization, HasLegacy, EarnsAlternativeBeats) {

	activeSpells: string[] = [];
	yantras: string[]      = [];
	magicalTools: string[] = [];
	praxes: string[]       = [];
	inuredSpells: string[] = [];
	nimbus: string[]       = [];
	obsessions: string[]   = [];

	attainments: string[]       = [];
	legacyAttainments: string[] = [];

	rotes: Rote[] = [];

	_roteSklls?: string[];
	get roteSkills(): string[] {
		return this.organization.skills || this._roteSklls || [];
	}
	set roteSkills(val: string[]) {
		this._roteSklls = val;
	}

	constructor() {
		super(EnumSplat.MAGE);
	}
}
