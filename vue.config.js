module.exports = {
	// output: {
	publicPath: "/cofd-pc/",
	// },
	css: {
		loaderOptions: {
			sass: {
				prependData: "@import \"@/style/vars.scss\";",
			},
		},
	},
};