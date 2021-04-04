module.exports = {
	// output: {
	publicPath: "",

	// },
	css: {
		loaderOptions: {
			sass: {
				// prependData: "@import \"@/style/vars.scss\";",
			},
		},
	},

	pluginOptions: {
		i18n: {
			locale: "en",
			fallbackLocale: "en",
			localeDir: "locales",
			enableLegacy: false,
			runtimeOnly: false,
			compositionOnly: false,
			fullInstall: true
		}
	}
};
