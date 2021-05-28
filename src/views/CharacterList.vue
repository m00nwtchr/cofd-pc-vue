<template>
	<div>
		<header class="col-12">
			<div>My Characters</div>
		</header>
		<ul class="col-12" id="list">
			<router-link :key="key" v-for="(el, key) in characters"  :to="'/character/'+key"><li class="list-item">
			
				<div>
					<span class="name">{{el.name}}</span><br>
					<span style="text-transform: capitalize;" class="desc">
						<span v-if="el.concept">{{ el.concept }}<br></span>
						{{ `${$t(`splat.${EnumSplat[el.splat].toLowerCase()}.name`,EnumSplat[el.splat].toLowerCase())}, ${el.organization ||""} ${el.legacy ||""} ${el.subType ||""}` }}
					</span>
				</div>
			
			</li></router-link>

		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EnumSplat } from "../definitions/Splat";

console.log(EnumSplat);

export default defineComponent({
	name: "CharacterList",
	components: {
	},
	data() {
		return {
			EnumSplat
		};
	},
	computed: {
		characters() {
			return this.$store.state.characters;
		}
	}
});
</script>

<style lang="scss" scoped>
@import "../style/vars.scss";

header {
	margin-top: 0px;
	min-height: 35px;
	text-align: left;
	// background-color: $s-dark;
	// border-bottom: 1px solid;

	width: 100%;

	$spread: -10px;

	-webkit-box-shadow: 0px 6px 17px $spread rgba(0,0,0,0.34); 
	box-shadow: 0px 6px 17px $spread rgba(0,0,0,0.34);
	
	div {
		margin-left: 15px;
		padding-top: 5px;
		margin-bottom: 5px;
		// shadow
	}
}

#list {
	margin-top: 25px;

	list-style-type: none;

	line-height: 16px;

	li {
		display: block;

		margin-bottom: 10px;

		border-radius: 5px;

		text-align: left;


		height: 60px;
		background-color: $accent;

		border: 2px solid gray;

		div {
			margin-left: 10px;
			padding-top: 6px;
			color: $text-light;
		}
	}
}

.name {
	font-weight: bold;
}

.desc {
	font-size: 10pt;
}

a {
	text-decoration: none;
	color: inherit;
}

a:hover {
	text-decoration: none;
	color: inherit;
}

</style>