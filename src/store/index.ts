import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";

import VuexPersistence, { AsyncStorage } from "vuex-persist";
import localForage from "localforage";
import Character from "@/definitions/Character";

const vuexPersist = new VuexPersistence({
	// storage: localForage as AsyncStorage
});

export type Characters = { [key: string]: Character };

export interface State {
	characters: Characters;
}

const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
	plugins: [
		// createLogger(),
		vuexPersist.plugin
	],
	state: {
		characters: {}
	},
	mutations: {
		UPDATE_CHARACTERS(state, val) {
			state.characters = val;
		}
	},
	getters: {
		export(state) {
			const url = `data:application/json;base64,${btoa(JSON.stringify(state.characters,null,"\t"))}`;
			return url;
		}
	},
	actions: {
	},
	modules: {
	}
});

export function useStore() {
	return baseUseStore(key);
}