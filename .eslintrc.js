module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"extends": [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		// "plugin:vue/essential",
		"plugin:@typescript-eslint/eslint-recommended",
		"@vue/typescript/recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"parser": "@typescript-eslint/parser",
		"vueFeatures": {
			"interpolationAsNonHTML": true
		}
	},
	"plugins": [
		"vue",
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};