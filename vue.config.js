module.exports = {
	// output: {
	publicPath: "",
	// },
	css: {
		loaderOptions: {
			sass: {
				prependData: "@import \"@/style/vars.scss\";",
			},
		},
	},
};