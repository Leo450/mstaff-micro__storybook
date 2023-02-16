const path = require("path")

module.exports = ({ config }) => {
	config.module.rules.push({
		test: /\.scss$/,
		use: [
			require.resolve("vue-style-loader"),
			require.resolve("css-loader"),
			require.resolve("sass-loader"),
		],
	})

	config.resolve.alias = {
		...config.resolve.alias,
		'@': path.resolve(__dirname, "../src/"),
		vue$: 'vue/dist/vue.esm.js'
	}

	return config;
};