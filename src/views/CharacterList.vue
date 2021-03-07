<template>
	<div>
		<header class="col-12">
			<div>My Characters</div>
		</header>
		<ul class="col-12" id="list">
			<router-link :key="key" v-for="(el, key) in characters"  :to="'/character/'+key"><li class="list-item">
			
				<div>{{el.name}}</div>
			
			</li></router-link>

		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "CharacterList",
	components: {
	},
	data() {
		return {
			characters: {}
		};
	},
	mounted() {
		if (localStorage && localStorage.characters) {
			this.characters = JSON.parse(localStorage.characters);
		}
		// delete (this as any).characters["a"];

	},
	watch: {
		characters: function(newVal, oldVal) {
			// console.log(JSON.stringify(newVal));
			localStorage.characters = JSON.stringify(newVal);
			// console.log(localStorage.characters);
		}
	}
});
</script>

<style lang="scss" scoped>

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

	li {
		display: block;

		margin-bottom: 10px;

		border-radius: 5px;

		text-align: left;


		height: 50px;
		background-color: $accent;


		div {
			margin-left: 10px;
			padding-top: 6px;
			color: $text-light;
		}
	}
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