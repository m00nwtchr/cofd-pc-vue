<template>
	<header class="col-12">
		<div>{{ character.name }}</div>
	</header>

	<dice-roller></dice-roller>

	<floating-action-menu :items="[
		{
			name: 'Roll Selected',
			action: rollSelected
		}
	]">
	</floating-action-menu>
	<!-- <div>
		<button class="fab" @click="rollSelected()">Roll Selected</button>
		<modal-component
			modalWidth="80%"
			modalHeight="80%"
			v-if="character.splat === EnumSplat.MAGE"
			value="Cast Spell"
			title="Improvised Spellcasting"
		>
			<spell-calculator :character="character" class="col-12" />
		</modal-component>
	</div> -->

	<!-- <teleport v-if="character.splat !== EnumSplat.VAMPIRE" :to="`#${EnumSplat[character.splat].toLowerCase()}-conditions`"> -->
	<!-- </teleport> -->
	<div id="charsheet"
		:class="{
			[`charsheet-${(EnumSplat && EnumSplat[character.splat]).toLowerCase()}`]: true
		}"
	>
		<!-- <fab /> -->

		{{ selectedTraits }}
		<div id="page-1">
			<div id="infoBar" class="bar row">
				<!-- <datalist> </datalist> -->

				<div class="block col-sm-4">
					{{ splat && splat.nameName }}:
					<input v-model="character.name" /><br />
					<span v-if="character.splat === EnumSplat.MORTAL">
						<label for="age">{{ $t("character.age") }}:</label>
						<input
							v-model.number="character.age"
							type="number"
							id="age"
						/><br />
						<label for="player">{{ $t("character.player") }}:</label>
						<input v-model="character.player" id="player" />
					</span>
					<span v-else>
						<label for="player">{{ $t("character.player") }}:</label>
						<input v-model="character.player" id="player" /><br />
						<label for="chronicle">{{ $t("character.chronicle") }}:</label>
						<input v-model="character.chronicle" id="chronicle" />
					</span>
				</div>
				<div class="block col-sm-4">
					<label for="virtueAnchor">{{ splat && splat.virtueAnchorName }}:</label>
					<input
						v-model="character.virtueAnchor"
						list="virtueAnchors"
						id="virtueAnchor"
					/><br />
					<label for="viceAnchor">{{ splat && splat.viceAnchorName }}:</label>
					<input
						v-model="character.viceAnchor"
						list="viceAnchors"
						id="viceAnchor"
					/><br />
					<label for="concept">{{ $t("character.concept") }}:</label>
					<input v-model="character.concept" id="concept" />
				</div>
				<div class="block col-sm-4">
					<span v-if="character.splat === EnumSplat.MORTAL">
						<label for="chronicle">{{ $t("character.chronicle") }}:</label>
						<input v-model="character.chronicle" id="chronicle" /><br>
						<label for="faction">{{ splat && splat.legacyName }}:</label>
						<input v-model="character.faction" id="faction" /><br>
						<label for="group-name">{{ splat && splat.orgName }}:</label>
						<input v-model="character.organization" id="group-name" /><br>
					</span>
					<span v-else>
						<label for="subType">{{ splat && splat.subTypeName }}:</label>
						<!-- <input
							v-model="character.subType"
							list="subTypes"
						/><br /> -->
						<select
							v-model="character.subType"
							id="subType"
						>
							<option v-for="(el, key) in splat.subTypes" :key="key" :value="key">
								{{ el.name }}
							</option>
							<option></option>
						</select><br>
						<label for="legacy">{{ splat && splat.legacyName }}:</label>
						<input v-model="character.legacy" id="legacy" /><br />
					
						<label for="organization">{{ splat && splat.orgName }}:</label>
					<select
						v-model="character.organization"
						id="organization"
					>
						<option v-for="(el, key) in splat.organizations" :key="key" :value="key">
							{{ el.name }}
						</option>
						<option></option>
					</select>
					</span>
				</div>

				<datalist id="organizations">
						<option
							v-for="(el, key) in splat.organizations"
							:key="key"
							:value="key"
						>
							{{ el.name }}
						</option>
					</datalist>

					<datalist id="subTypes">
						<option v-for="(el, key) in splat.subTypes" :key="key" :value="key">
							{{ el.name }}
						</option>
					</datalist>

					<datalist id="virtueAnchors">
						<option
							v-for="el in splat.virtueAnchors"
							:key="el"
							:value="el"
						></option>
					</datalist>

					<datalist id="viceAnchors">
						<option
							v-for="el in splat.viceAnchors"
							:key="el"
							:value="el"
						></option>
					</datalist>
			</div>
			<div class="separator col-12">
				<h2>{{ $t("character.attributes") }}</h2>
			</div>
			<div id="attrBar" class="bar row">
				<div
					id="attr-cats"
					style="text-align: right"
					class="block col-sm-2"
				>
					{{ $t("character.attribute.power") }}<br />
					{{ $t("character.attribute.finesse") }}<br />
					{{ $t("character.attribute.resistance") }}<br />
				</div>
				<div class="attr-proper row col-sm-10">
					<div
						v-for="attrCat in ATTRIBUTES"
						:key="attrCat"
						class="block col-sm-4"
					>
						<span
							style="text-transform: capitalize"
							v-for="attr in attrCat"
							:key="attr"
						>
							<span
								:class="{ selected: selectedTraits[attr] }"
								@click="selectTrait(attr, { attr: true })"
								>{{ $t(`character.attribute.${attr}`) }}</span
							>
							<input
								v-if="!dotsOverFive && attrMax > 5"
								v-model.number="character.baseAttributes[attr]"
								type="number"
								style="width: 35px"
								class="attr-input"
							/>
							<div class="sheet-dots">
								<button
									@click="setAttr(attr, n)"
									v-for="n in dotAttrMax"
									:key="n"
									:class="{
										'sheet-dot': true,
										'sheet-dot-full':
											character.baseAttributes[attr] >= n,
										'sheet-dot-small': dotAttrMax > 5
									}"
								></button>
							</div>
							<br />
						</span>
					</div>
				</div>
			</div>
			<div class="row" style="margin-top:15px">
				<div id="skills" class="col col-sm-4">
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">
						{{ $t("character.skills") }}
					</h2>
					<div
						v-for="(cat, i) in skills"
						:key="cat"
						class="block col col-12"
					>
						<h3 class="separator">
							{{
								$t(`character.cat.${Object.keys(skillCats)[i]}`)
							}}
						</h3>
						<i class="col-12 subtitle"
							>({{ Object.values(skillCats)[i] }} Unskilled)</i
						><br />

						<div
							style="font-style: italic; font-size: 10px; line-height: 10px"
							v-if="character.splat === EnumSplat.MAGE"
						>
							Rote<br />Skill
						</div>
						
						<span
							style="text-transform: capitalize"
							v-for="skill in cat"
							:key="skill"
						>
						
							<!-- <button v-if="character.splat === EnumSplat.MAGE" @click="toggleRoteSkill(skill)" class="sheet-box" :class="{'sheet-dot-full': character.roteSkills.includes(skill)}"></button> -->
							<button
								v-if="character.splat === EnumSplat.MAGE"
								class="sheet-box"
								:class="{
									'sheet-dot-full': character.roteSkills.includes(
										skill
									)
								}"

								@click="character.roteSkills.includes(skill) ? 
									character.roteSkills.splice(character.roteSkills.indexOf(skill)) :
									character.roteSkills.push(skill)
								"
							></button>
							<span
								:class="{
									selected: selectedTraits[skill],
									specialties:
										character.specialties[skill] &&
										character.specialties[skill].length > 0
								}"
								@click="
									selectTrait(skill, {
										skill: true,
										skillCat: i
									})
								"
							>
								{{ $t(`character.skill.${skill}`) }}
							</span>

							<button
								class="dropdown-toggle material-icons"
								@click="specialtyDropDown(skill)"
							>
								<span v-if="specialtyDropSelect === skill"
									>arrow_drop_down</span
								>
								<span v-else>arrow_right</span>
							</button>

							<div class="sheet-dots">
								<button
									@click="setSkill(skill, n)"
									v-for="n in dotAttrMax"
									:key="n"
									class="sheet-dot"
									:class="{
										'sheet-dot-full':
											character.skills[skill] >= n,
										'sheet-dot-small': dotAttrMax > 5
									}"
								></button>
							</div>
							<br />

							<item-list
								v-if="specialtyDropSelect === skill"
								class="col-12"
								:items="character.specialties[skill]"
								:mutable="true"
							/>
						</span>
					</div>
					<br />
				</div>

				<div id="traits" class="col-sm-8">
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">
						{{ $t("character.other_traits") }}
					</h2>
					<div class="row">
						<div class="col col-sm-7">
							<ability-list
								v-if="splat && splat.abilityName"
								:abilities="character.abilities"
								:optionsMutable="!splat.finiteAbilities"
								:abilityName="splat.abilityName"
								:datalist="splat.abilities"
								id="ability"
								class="block"
								:dotRanges="dotRanges"
							/>

							<ability-list
								:abilities="character.merits"
								abilityName="Merits"
								id="merits"
								class="block"
								:dotRanges="dotRanges"
							/>

							<!-- <div id="werewolf-conditions"> </div> -->
							<!-- <item-list
								v-if="character.splat === EnumSplat.WEREWOLF"
								class="col-12"
								name="Conditions"
								:items="character.conditions"
								:mutable="true"
							/> -->
							<br v-if="character.splat === EnumSplat.WEREWOLF">

							<span v-if="character.splat === EnumSplat.WEREWOLF">
								<h3 class="separator col-sm-12">Hunter's Aspect</h3>
								<input class="line w-100" type="text" v-model="character.huntersAspect">
							</span>


							<div id="minorTraits" class="block col col-12">
								<br v-if="character.splat === EnumSplat.WEREWOLF">

								<span
									v-if="
										character.splat !== EnumSplat.WEREWOLF
									"
								>
									{{ $t("character.trait.size") }}:
									<input
										v-model.number="character.size"
										type="number"
									/><br />
									{{ $t("character.trait.speed") }}:
									{{ character.speed }}<br />
									{{ $t("character.trait.defense") }}:
									{{ character.defense }}<br />
									<!-- {{ $t("character.trait.armor") }}: <input v-model="character.armor" /><br> -->
									{{ $t("character.trait.armor") }}:
									{{
										character.armor
											? character.armor.general +
												"/" +
											character.armor.ballistic
											: ""
									}}<br />
									{{ $t("character.trait.initative") }}:
									{{ initative }}<br />
								</span>
								<span style="float: left; margin-right: 5px"
									>{{ $t("character.trait.beats") }}:</span
								>
								<div style="float: left; margin-right: 10px">
									<span v-for="n in 5" :key="n">
										<button
											class="sheet-box"
											@click="setTrait('beats', n)"
											:class="{
												'sheet-dot-full':
													character.beats >= n
											}"
										></button>
									</span>
								</div>
								<span style="clear: both"></span>
								<br />
								{{ $t("character.trait.experience") }}:
								<input
									v-model.number="character.experience"
									type="number"
								/><br />
								<div
									v-if="
										splat &&
											splat.alternateBeatName &&
											!splat.alternateBeatOptional
									"
								>
									<span style="float: left"
										>{{
											splat.alternateBeatName(
												$t("character.trait.beats")
											)
										}}:</span
									>
									<div style="float: left">
										<span v-for="n in 5" :key="n">
											<button
												class="sheet-box"
												@click="
													setTrait(
														'alternateBeats',
														n
													)
												"
												:class="{
													'sheet-dot-full':
														character.alternateBeats >=
														n
												}"
											></button>
										</span>
									</div>
									<span style="clear: both"></span>
									<br />
									{{
										splat.alternateBeatName(
											$t("character.trait.experience")
										)
									}}:
									<input
										v-model.number="
											character.alternateExperience
										"
										type="number"
									/><br />
								</div>
							</div>
						</div>
						<div class="col col-sm-5" style="padding-right: 30px">
							<health-component
								id="health"
								class="col-12"
								style="margin-bottom: 15px"
								:maxHealth="character.maxHealth"
								:woundPenalty="character.woundPenalty"
								:healthTrack="character.healthTrack"
								:name="$t('character.trait.health')"
							>
								<!-- <i class="subtitle" style="margin-bottom: 5px" v-if="character.splat === EnumSplat.WEREWOLF">(EEE)</i> -->
							</health-component>

							<div
								id="willpower"
								class="col-12"
								style="margin-bottom: 15px"
							>
								<h3 class="separator col-sm-12">
									{{ $t("character.trait.willpower") }}
								</h3>
								<div
									class="sheet-dots"
									style="margin-top: -10px"
								>
									<button
										v-for="n in maxWillpower"
										:key="n"
										@click="
											setTrait(
												'spentWillpowerDots',
												maxWillpower - n,
												{
													off: -1
												}
											)
										"
										class="sheet-dot"
										:class="{
											'sheet-dot-full':
												maxWillpower -
													character.spentWillpowerDots >=
												n
										}"
									></button>
								</div>
								<div
									class="sheet-boxes"
									:style="{
										'margin-left':
											character.spentWillpowerDots * -15 +
											'px'
									}"
									style="margin-top: -7px"
								>
									<button
										v-for="n in maxWillpower -
											character.spentWillpowerDots"
										:key="n"
										class="sheet-box"
										@click="setTrait('willpower', n)"
										:class="{
											'sheet-dot-full':
												character.willpower >= n
										}"
									></button>
								</div>
							</div>
							<div
								v-if="splat && splat.powerTraitName"
								class="col-12"
								id="powerTrait"
								style="margin-bottom: 15px"
							>
								<h3
									:class="{
										selected: selectedTraits['power']
									}"
									@click="selectTrait('power', {})"
									class="separator col-sm-12"
								>
									{{ splat.powerTraitName }}
								</h3>
								<div
									class="sheet-dots"
									style="margin-top: -10px"
								>
									<button
										v-for="n in 10"
										:key="n"
										class="sheet-dot"
										@click="
											setTrait('power', n, { min: 1 })
										"
										:class="{
											'sheet-dot-full':
												character.power >= n
										}"
									></button>
								</div>
							</div>
							<div
								v-if="splat && splat.fuelTraitName"
								class="col-12"
								id="fuelTrait"
								style="margin-bottom: 15px"
							>
								<h3 class="separator col-sm-12">
									{{ splat.fuelTraitName }}
								</h3>
								<div
									class="sheet-boxes"
									style="margin-top: -10px"
								>
									<span v-for="n in maxFuel" :key="n">
										<button
											class="sheet-box"
											@click="setTrait('fuel', n)"
											:class="{
												'sheet-dot-full':
													character.fuel >= n
											}"
										></button>
										<br v-if="n % 10 === 0" />
									</span>
								</div>
							</div>

							<!-- <span class="col-12" v-if="splat && splat.integrityTraitName"> -->
							<!-- <health-component    v-if="splat.integrityTrackType === 'healthTrack'" :maxMarkValue="2" :maxHealth="character.maxClarity" :healthTrack="character.clarityTrack" :name="splat.integrityTraitName" class="col-12" id="integrityTrait" /> -->
							<integrity-component
								v-if="splat && splat.integrityTraitName"
								:character="character"
								:splat="splat"
								class="col-12"
								id="integrityTrait"
							/>
							<!-- </span> -->

							<div
								class="col-12"
								v-if="character.splat === EnumSplat.WEREWOLF"
								style="color: black; white-space: nowrap; text-align: left;"
								id="kuruth-triggers"
							>
								<h3 class="separator col-sm-12">
									Kuruth Triggers
								</h3>
								<!-- <div class="row col-12"> -->
								<!-- <div style="color:black;" class="col-12"> -->
								Passive:
								<input
									class="line"
									style="width: 70%"
									v-model="character.kuruthTriggers.passive"
								/><br />
								Common:
								<input
									class="line"
									style="width: 70%"
									v-model="character.kuruthTriggers.common"
								/><br />
								Specific:
								<input
									class="line"
									style="width: 70%"
									v-model="character.kuruthTriggers.specific"
								/>
								<!-- </div> -->
								<!-- </div> -->
							</div>

							<br>

							<item-list
								class="col-12"
								name="Conditions"
								:items="character.conditions"
								:mutable="true"
							/>
							<br>

							<item-list
								class="col-12"
								name="Aspirations"
								:items="character.aspirations"
								:mutable="true"
							/>

							<br v-if="character.splat === EnumSplat.MAGE">

							<item-list
								v-if="character.splat === EnumSplat.MAGE"
								class="col-12"
								name="Obsessions"
								:items="character.obsessions"
								:mutable="true"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="page-2">
			<div id="mage-traits" v-if="character.splat === EnumSplat.MAGE" class="row col-12">
				<div class="col-sm-4">
					<div
						class="col-12"
						id="activeSpells"
						style="margin-bottom: 15px"
					>
						<h4 class="separator col-sm-12">Active Spells</h4>
						<input
							class="line"
							v-for="n in character.power"
							:key="n"
							v-model="character.activeSpells[n - 1]"
						/>
					</div>
					<item-list
						id="yantras"
						class="col-12"
						name="yantras"
						:items="character.yantras"
						:mutable="true"
						style="margin-bottom: 15px"
					/>
					<item-list
						id="tools"
						class="col-12"
						name="magical tools"
						:items="character.magicalTools"
						:mutable="true"
						style="margin-bottom: 15px"
					/>
					<item-list
						id="praxes"
						class="col-12"
						name="praxes"
						:items="character.praxes"
						:mutable="true"
						style="margin-bottom: 15px"
					/>
					<item-list
						id="inuredSpells"
						class="col-12"
						name="inured spells"
						:items="character.inuredSpells"
						:mutable="true"
						style="margin-bottom: 15px"
					/>
				</div>

				<div class="col-sm-8">
					<object-list 
						:items="character.rotes" 
						:itemFactory="Rote" 
						name="Rotes"
					></object-list>
					<item-list
						name="Nimbus"
						class="w-100"
						:items="character.nimbus"
						:mutable="true"	
					></item-list>
					<div class="w-100 row">
						<!-- <div class="col-6"> -->
							<item-list
								name="Arcana Attainments"
								class="col-6"
								:items="character.arcanaAttainments"
								:mutable="true"
							/>
						<!-- </div> -->
						<!-- <div class="col-6"> -->
							<item-list
								name="Legacy Attainments"
								class="col-6"
								:items="character.legacyAttainments"
								:mutable="true"
							/>
						<!-- </div> -->
					</div>
					<!-- <div id="rotes" class="row col-sm-12">
								<h4 class="separator col-sm-12" style="margin-bottom: 15px">Rotes</h4>
									<div class="col-2" >
										<i class="subtitle">Arcanum</i>
									</div>
									<div id="rote-level" class="col-1">
										<i class="subtitle">Level</i>
									</div>
									<div class="col-5">
										<i class="subtitle">Spell</i>
									</div>
									<div class="col-2">
										<i class="subtitle">Creator</i>
									</div>
									<div class="col-2">
										<i class="subtitle">Rote Skill</i>
									</div>
								<div @input="doInputRote(rote,i)" class="row" v-for="(rote,i) in rotes" :key="i">
									<div class="col-2" >
										<input class="line"  v-model="rote.arcanum">
									</div>
									<div id="rote-level" class="col-1">
										<input class="line" v-model.number="rote.level" type="number">
									</div>
									<div class="col-5">
										<input class="line" v-model="rote.spell">
									</div>
									<div class="col-2">
										<input class="line" v-model="rote.creator">
									</div>
									<div class="col-2">
										<input style="text-transform: capitalize;" class="line" v-model="rote.roteSkill">
									</div>
								</div>
							</div> -->
					<br />
				</div>
			</div>

			<div class="werewolf-traits" v-if="character.splat === EnumSplat.WEREWOLF">
				<div id="werewolf-forms" class="row w-100">
					<div
						v-for="form in character.getForms()"
						:key="form"
						style="text-align: left; width: 100%"
						class="col-sm"
					>
						

						<h4
							@click="character.currentForm = form.name.toLowerCase()"
							:class="{
								'form-active':
									character.currentForm.toLowerCase() ===
									form.name.toLowerCase()
							}"
							class="separator col-sm-12"
						>
							{{ form.name }}
						</h4>
						<i class="subtitle">({{ form.desc }})</i>

						<div>
							<span
								v-for="attr in ATTRIBUTES.flat().filter(
									el =>
										[
											'strength',
											'dexterity',
											'stamina',
											'manipulation'
										].includes(el) || form[el + 'Mod'] !== 0
								)"
								:key="attr"
							>
								{{ $t("character.attribute." + attr)
								}}<!--
								-->{{ formatNum(form[attr + "Mod"]) }}:
								<span class="default-font">
									{{
										character.attributes[attr] -
											currentForm[attr + "Mod"] +
											form[attr + "Mod"]
									}} </span
								><br />
							</span>

							<br />

							{{ $t("character.trait.size")
							}}<!--
							-->{{ formatNum(form.sizeMod) }}:
							<input
								v-if="form.name === 'Hishu'"
								v-model.number="sizeMinusForm"
								type="number"
							/>
							<span class="default-font" v-else>{{
								character.size - currentForm.sizeMod + form.sizeMod
							}}</span
							><br />

							{{ $t("character.trait.defense")
							}}<!--
							-->{{ formatNum(formDefenseMod(form)) }}:
							<span class="default-font">
								{{ formDefense(form) }} </span
							><br />

							{{ $t("character.trait.initative")
							}}<!--
							-->{{
								formatNum(
									form.dexterityMod +
										form.composureMod -
										getForm("hishu").dexterityMod -
										getForm("hishu").composureMod
								)
							}}:
							<span class="default-font">
								{{
									initative -
										currentForm.dexterityMod -
										currentForm.composureMod +
										form.dexterityMod +
										form.composureMod
								}} </span
							><br />

							<!-- Armor: <input v-model="character.armor" /><br> -->
							{{ $t("character.trait.speed")
							}}<!--
							-->{{ formatNum(form.speedMod + form.strengthMod + form.dexterityMod) }}:
							<span class="default-font">{{
								character.speed -
									currentForm.strengthMod -
									currentForm.dexterityMod -
									currentForm.speedMod +
									form.strengthMod +
									form.dexterityMod +
									form.speedMod
							}}</span
							><br />

							{{ $t("character.trait.armor") }}:
							<span class="default-font">
								{{
									`${character.armor.general -
										currentForm.armorMod.general +
										form.armorMod.general}/${character.armor
										.ballistic -
										currentForm.armorMod.ballistic +
										form.armorMod.ballistic}`
								}} </span
							><br />

							{{ $t("character.trait.perception")
							}}<!--
							-->{{ formatNum(form.perceptionMod + form.witsMod + form.composureMod) }}:
							<span class="default-font">{{
								perception -
									currentForm.perceptionMod +
									form.perceptionMod
							}}</span>
							<br />

							<span v-if="form.name === 'Gauru'">
								Kuruth Limit:
								<span class="default-font">{{
									character.attributes.stamina -
										currentForm.staminaMod +
										character.power
								}}</span> </span
							><br />

							<div style="line-height: 15px" class="form-traits">
								<span v-for="(trait, i) in form.traits" :key="i">
									<br />
									<i class="subtitle">{{ trait }}</i>
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-sm-4">
						<h2 class="separator col-sm-12" style="margin-bottom: 20px;">Totem</h2>
					</div>
					<div class="col-sm-8">
						<h2 class="separator col-sm-12" style="margin-bottom: 20px;">Gifts and Rites</h2>
						
						
						<!-- <h4 class="separator col-sm-12">Moon Gifts</h4> -->
						
						<div class="row" style="margin-bottom: 10px">
							<!-- <div class="col-6" v-for="(gift, i) in character.moonGifts" :key="i">
								<ability-list
									:abilities="{gift: unref(gift)}"
									:optionsMutable="i !== 0 || !Object.keys(character.getSplat().subTypes).includes(nameToKey(character.subType))"
									:length="1"
								/>
							</div> -->
								<ability-list class="col-12"
									:abilities="character.moonGifts"
									abilityName="Moon Gifts"
									:optionsMutable="true"
									:length="2"
									:horizontal="true"
								/>
						</div>
						<div class="row col-sm-12">
							<div class="col-sm-6">
								<h4 class="separator">Shadow Gifts</h4>
								<item-list
								class="col-12"
								:items="character.shadowGifts"
								:mutable="true"
								/>
							</div>
							<div class="col-sm-6">
								<h4 class="separator">Wolf Gifts</h4>
								<item-list
								class="col-12"
								:items="character.wolfGifts"
								:mutable="true"
								/>
							</div>
						</div>
						<div class="row col-sm-12">
							<h4 class="separator">Rites</h4>
							<item-list
								class="col-12"
								:items="character.rites"
								:mutable="true"
								:cols="2"
							/>
						</div>
					</div>

				</div>
			</div>

			<div id="vampire-traits" v-if="character.splat === EnumSplat.VAMPIRE" class="row col-12">
				E
			</div>

		</div>
							<!-- <object-list :items="character.weapons" name=""></object-list> -->

	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref, toRefs, unref } from "vue";

import { Splat, SPLATS, EnumSplat, Form } from "../definitions/Splat";
import Character, {
	Ability,
	ATTRIBUTES,
	Attributes,
	createCharacter,
	MageCharacter,
	Rote,
	WerewolfCharacter,
	nameToKey,
	SKILLS
} from "../definitions/Character";

import AbilityList from "../components/sheetComponents/AbilityList.vue";
import HealthComponent from "../components/sheetComponents/HealthComponent.vue";
import IntegrityComponent from "../components/sheetComponents/IntegrityComponent.vue";
import ItemList from "../components/sheetComponents/ItemList.vue";
import ObjectList from "../components/sheetComponents/ObjectList.vue";
import DiceRollerComponent from "../components/sheetComponents/diceRoller/DiceRoller.vue";

import ModalComponent from "../components/ModalComponent.vue";
import FloatingActionMenu from "../components/FloatingActionMenu.vue";

import SpellCalculator from "../components/sheetComponents/SpellCalculator.vue";

import { DiceRoller } from "../DiceRoller";
import { Characters } from "@/store";

import _ from "lodash";

// <div class="sheet-dots">
// 	<button @click="setAttr('intelligence', n)" v-for="n in attrMax" :key="n" class="sheet-dot"></button>
// </div>

interface CharacterViewData {
	characters: { [index: string]: Character };
	character: Character;
	ATTRIBUTES: typeof ATTRIBUTES;
	skills: string[][];
	skillCats: { [index: string]: number };
	attributes: Attributes;
}

export default defineComponent({
	name: "CharacterView",
	components: {
		AbilityList,
		HealthComponent,
		IntegrityComponent,
		ItemList,
		ObjectList,
		DiceRoller: DiceRollerComponent,
		ModalComponent,
		SpellCalculator,
		FloatingActionMenu
		// "fab": fab
	},
	computed: {
		id(): string {
			return this.$route.params.id as string;
		},
		splat(): Splat {
			return this.character.splatObj;
		},
		subType() {
			return this.character.subTypeObj;
		},
		organization() {
			return this.character.organizationObj;
		},
		attrMax() {
			// console.log(this.splat);
			return (this as any).character.power > 5
				? ((this as any).character as Character).power
				: 5;
		},
		dotAttrMax() {
			return Math.min(
				(this as any).attrMax,
				(this as any).dotsOverFive ? 10 : 5
			);
		},
		maxWillpower() {
			return (
				(this as any).character.attributes.resolve +
				(this as any).character.attributes.composure
			);
		},
		// defense() {
		// 	return Math.min((this as any).character.attributes.dexterity, (this as any).character.attributes.wits) + ((this as any).character.skills.athletics || 0);
		// },
		initative() {
			return (
				(this as any).character.attributes.dexterity +
				(this as any).character.attributes.composure
			);
		},
		maxFuel() {
			const character: Character = this.character as any;
			return character.power === 0
				? (this as any).character.splat === EnumSplat.VAMPIRE
					? (this as any).attributes.stamina
					: 0
				: character.power >= 5
					? character.power >= 9
						? character.power === 10
							? 75
							: 50
						: 10 + (character.power - 4) * 5
					: 10 + character.power - 1;
		},
		perception() {
			return (
				(this as any).character.attributes.resolve +
				(this as any).character.attributes.composure +
				((this as any).currentForm.perceptionMod || 0)
			);
		},
		// abilities(): {[index: string]: Ability} {
		// 	const character: Character = this.character;
		// 	const obj: {[index: string]: Ability} = {};
		// 	// character.abilityArr.forEach(el => {
		// 	// 	obj[el.name.toLowerCase()] = {level: el.level, name: el.name};
		// 	// });
		// 	return obj;
		// },
		currentForm(): Form {
			return this.character instanceof WerewolfCharacter
				? this.character.currentFormObj().value
				: ({} as Form);
		},
		dotRanges() {
			let obj = {};
			if (this.character.splat === EnumSplat.MAGE) {
				Object.keys(this.splat.abilities).forEach(el => {
					obj[el] = {
						max: 4
					};
				});

				obj[this.subType.inferiorArcanum] = {
					max: 2
				};

				(this.subType.abilities || []).forEach(el => {
					obj[el] = {
						min: 1
					};
				});
			}

			return obj;
		}
	},
	methods: {
		unref,
		nameToKey,
		async rollTest() {
			const results = [] as string[][];

			const maxTarget = 12;
			const maxDice = 15;

			const rollIterations = 5;

			for (let dice = 1; dice <= maxDice; dice++) {
				for (let target = 1; target <= maxTarget; target++) {
					// const succArr = [];
					// for (let i = 0; i < 10; i++) {
					let succs = 0;
					for (let j = 0; j < rollIterations; j++) {
						const suc = await this.roller.roll(dice, {} as any);

						if (suc >= target) {
							succs++;
						}
					}
					// succArr.push(succs/target);
					// }
					if (!results[dice - 1]) results[dice - 1] = [];
					// results[dice-1][target-1] = succArr.reduce((prev, val) => prev+val) / 10;
					results[dice - 1][target - 1] = (
						(succs / rollIterations / target) *
						100
					).toFixed(2);
				}
			}
			return results;
		},
		async rollSelected(opts: any) {
			const vals = Object.values(this.selectedTraits) as any[];
			if (vals.length === 0) return 0;

			const dice = vals.reduce((prev, val) => prev + val);

			const result = await this.roller.roll(dice, opts);

			alert(`Rolled ${dice} dice, got ${result} successes`);
		},
		selectTrait(
			name: string,
			opts: {
				attr?: boolean;
				skill?: boolean;
				skillCat: string;
				ability?: boolean;
			}
		) {
			if (this.selectedTraits[name] !== undefined) {
				delete this.selectedTraits[name];
			} else if (name) {
				if (Object.keys(this.selectedTraits).length === 3) {
					this.selectedTraits = {};
				}

				this.selectedTraits[name] = computed(() => {
					const attributes = this.character.attributes;
					const skills = this.character.skills;
					const abilities = this.character.abilities;
					const merits = this.character.merits;
					const obj = (opts.attr
						? attributes
						: opts.skill
							? skills
							: opts.ability
								? abilities[name]
									? abilities
									: merits
								: this.character) as any;

					const res = (opts.ability ? (obj[name] || {}).level : obj[name]) || 0;
					return (
						res +
						(res === 0 && opts.skill
							? Object.values(this.skillCats)[
									opts.skillCat as any
							]
							: 0)
					);
				}) as any;
			}
		},
		setAttr(attr: string, val: number) {
			const character: Character = (this as any).character;

			// if (!character.attributes)
			// 	(character.attributes as any) = {};

			(character.baseAttributes as any)[attr] =
				(character.attributes as any)[attr] === val && val !== 1
					? val - 1
					: val;
		},
		setSkill(attr: string, val: number) {
			const character: Character = (this as any).character;

			if (!character.skills) character.skills = {};

			// console.log(character.skills);

			character.skills[attr] =
				character.skills[attr] === val ? val - 1 : val;
			// console.log(character.skills);
		},
		setTrait(
			trait: string,
			val: number,
			opts: { off?: number; min?: number }
		) {
			const character: any = (this as any).character;

			// eslint-disable-next-line prefer-const
			let { off, min } = opts || {};

			off = off || 1;

			character[trait] = character[trait] === val ? val - off : val;

			// console.log(character[trait], min);
			character[trait] = Math.max(min || 0, character[trait]);

			if (trait === "beats" || trait === "alternateBeats") {
				if (character[trait] === 5) {
					character[trait] = 0;

					trait === "beats"
						? character["experience"]++
						: character["alternateExperience"]++;
				}
			}
		},
		doInputRote(ability: any, i: number) {
			if (this.character instanceof MageCharacter) {
				if (!this.character.rotes[i]) {
					this.character.rotes[i] = ability;
				}
				// console.log(ability);
				if (
					!ability.arcanum &&
					!ability.spell &&
					!ability.creator &&
					!ability.roteSkill
				) {
					// console.log(ability);
					// eslint-disable-next-line vue/no-mutating-props
					this.character.rotes.splice(i, 1);
				}
			}
		},
		formDefense(form: Form) {
			return (
				(form.defenseCalcMax ? Math.max : Math.min)(
					this.character.attributes.dexterity -
						this.currentForm.dexterityMod +
						form.dexterityMod,
					this.character.attributes.wits -
						this.currentForm.witsMod +
						form.witsMod
				) +
				(this.character.skills.athletics || 0) +
				(this.character.mod("defense") -
					(this.currentForm.defenseMod || 0) +
					(form.defenseMod || 0))
			);
			// return (this as any).character.defense - (this as any).currentForm.dexterityMod + form.dexterityMod;
		},
		formDefenseMod(form: Form) {
			// const hishu = this.getForm('hishu');
			// let sub = 0;

			// const dexterity = this.character.attributes.dexterity - this.currentForm.dexterityMod + form.dexterityMod;
			// const wits = this.character.attributes.wits - this.currentForm.witsMod + form.witsMod;

			// const res = (form.defenseCalcMax ? Math.max : Math.min)(dexterity, wits);

			// if (res == dexterity) {
			// 	sub = form.dexterityMod;
			// } else if (res == wits) {
			// 	sub = form.witsMod;
			// }

			// return this.formDefense(form) - this.formDefense(hishu) -
			// 	sub;
			return form.defenseMod;
		},
		getForm(name: string) {
			return this.character instanceof WerewolfCharacter
				? this.character.getForm(name).value
				: ({} as Form);
		},
		specialtyDropDown(skill: string) {
			if (this.specialtyDropSelect === skill) {
				if (
					this.character.specialties[skill] &&
					this.character.specialties[skill].length === 0
				) {
					delete this.character.specialties[skill];
				}

				this.specialtyDropSelect = null;
			} else {
				if (!this.character.specialties[skill]) {
					this.character.specialties[skill] = [];
				}

				this.specialtyDropSelect = skill;
			}
		},
		formatNum(num: number): string {
			return num !== 0 ? `(${num > 0 ? "+" : ""}${num})` : "";
		},

	},
	data: () => ({
		characters: (null as unknown) as Characters,
		character: (null as unknown) as Character,
		sizeMinusForm: null as any,

		dotsOverFive: false,
		specialtyDropSelect: null as string | null,

		selectedTraits: {} as { [index: string]: Ref<number> },

		EnumSplat,
		ref,
		Rote,

		// random: new Random(),
		roller: new DiceRoller(),

		ATTRIBUTES,
		skills: SKILLS,
		skillCats: { mental: -3, physical: -1, social: -1 } as {
			[index: string]: number;
		},

		// dotRanges: {
		// 	cunning: {
		// 		max: 3,
		// 		min: 1
		// 	}
		// }
	}),
	beforeMount() {
		(window as any).vue = this;
		this.characters = this.$store.state.characters as any;

		// this.character = this.characters[this.id];
		this.character = createCharacter(
			this.characters[this.id] as any
		) as any;
		this.characters[this.id] = this.character;

		this.sizeMinusForm = computed({
			get: () => {
				return this.character.size - this.currentForm.sizeMod;
			},
			set: val => {
				this.character.size = val as any;
			}
		});
	},
	watch: {
		characters: {
			handler(newVal: { [key: string]: Character }, oldVal) {
				// (this as any).characters[(this as any).id] = newVal;

				function deep(obj: any) {
					const newObject = _.clone(obj);

					_.each(obj, (val, key) => {
						if (val && typeof val === "object") {
							if (val.getData) {
								newObject[key] = deep(val.getData());
							} else {
								newObject[key] = deep(val);
							}
							if (key === "merits") {
								console.log(key, newObject[key]);
							}
						}
					});

					return newObject;
				}

				const newObj = {} as any;

				Object.entries(newVal)
					.map(
						entry =>
							[
								entry[0],
								entry[1].getData ? entry[1].getData() : entry[1]
							] as [string, any]
					)
					.forEach(entry => {
						newObj[entry[0]] = entry[1];
					});

				// const newObj = deep(newVal);
				// localStorage.characters = JSON.stringify(newVal);
				(this as any).$store.commit("UPDATE_CHARACTERS", newObj);
			},
			deep: true
		}
		// attrMax: function(newVal, oldVal) {
		// 	if (newVal > 5) {
		// 		$(".sheet-dot").attr("11");
		// 	}
		// }
		// $route: function(newRoute): any {
		// }
	}
});
</script>

<style lang="scss">
@import "../style/vars.scss";

$xs-max: 575.98px;
$sm-min: 576px;
$sm-max: 767.98px;

#charsheet {
	padding: 20px;
}

header {
	margin-top: 0px;
	min-height: 35px;
	text-align: left;
	// background-color: $s-dark;
	// border-bottom: 1px solid;

	width: 100%;

	$spread: -10px;

	-webkit-box-shadow: 0px 6px 17px $spread rgba(0, 0, 0, 0.34);
	box-shadow: 0px 6px 17px $spread rgba(0, 0, 0, 0.34);

	div {
		margin-left: 15px;
		padding-top: 5px;
		margin-bottom: 5px;
		// shadow
	}
}

select {
	// width: 100%;
}

input {
	background-color: transparent;
	border: none;
	color: inherit;
}

input:focus {
	outline: none;
}

.bar {
	white-space: nowrap;
	margin-top: 15px;
	padding-left: 15px;
	padding-right: 15px;
}

.block {
	text-align: left;
	overflow: hidden;

	width: 100%;

	margin-bottom: 15px;

	@media (max-width: $xs-max) {
		margin: auto;
		margin-top: 15px;
		width: 60%;
	}
}

.block.col-sm-2 {
	@media (max-width: $xs-max) {
		display: none;
	}
}

.separator {
	text-transform: uppercase;
	text-align: center;

	margin-top: 0px;
	// margin-bottom: 15px;
}

.block .sheet-dots {
	float: right;
}

button.sheet-dot {
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	border-radius: 50%;
}

button.sheet-dot-full {
	background: $accent !important;
}

.sheet-dot,
.sheet-box {
	$radius: 15px;

	width: $radius;
	height: $radius;

	padding: 0;
	border: solid 1px #000000;
	line-height: 11px;
	background-color: #efefef;

	margin-right: 1px;
}

#skills .sheet-dot {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
}

#skills .sheet-dot-small {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 8px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 5px;

		width: $radius;
		height: $radius;
	}
}

#attrBar .sheet-dot {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
}

#attrBar .sheet-dot-small {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 6px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 5px;

		width: $radius;
		height: $radius;
	}
}

button.sheet-dot-small {
	$radius: 12px;

	width: $radius;
	height: $radius;
}

#minorTraits {
	font-size: 14.2pt;
	white-space: nowrap;
}

.subtitle {
	margin-top: -13px;
	// margin-bottom:-10px;
	display: block;
	text-align: center;

	font-size: 8pt;
	font-family: 'Goudy';

	color: black;
}


#rotes {
	text-align: center;
	#rote-level input {
		width: 220%;
	}
	input {
		width: 100%;
		margin-left: 10px;
	}
}

.attr-input {
	border: 1px solid black;
	border-radius: 10px;
	background-color: #484747;
	color: white;
}

#werewolf-forms {
	padding-left: 30px;
	// background-image: url('../assets/images/werewolf-forms.webp');
	background-repeat: no-repeat;
	background-origin: content-box;
	background-size: contain;
	background-position: center;
}
.dropdown-toggle {
	border: none;

	background-color: transparent;

	height: 100%;
	// padding-bottom: -10px;

	vertical-align: center;
	text-align: center;

	span {
		// : 10px;
		font-size: 14pt;
	}
}

.dropdown-toggle::after {
	display: none !important;
	// padding-top: 10px;
}

.specialties {
	$color: green;

	color: green;
	// fill: black;
	// stroke: red;
	// stroke-width: 3;
	// text-shadow: 2px 0 0 $color, -2px 0 0 $color, 0 2px 0 $color, 0 -2px 0 $color, 1px 1px $color, -1px -1px 0 $color, 1px -1px 0 $color, -1px 1px 0 $color;
}
</style>