const path = require('path')

module.exports = {
	'stories': [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)'
	],
	'addons': [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions'
	],
	'framework': '@storybook/vue',
	webpackFinal: async (config, { configType }) => {
		config.output.publicPath = '/storybook'
		return config
	},
	managerWebpack: async (config) => {
		config.output.publicPath = '/storybook'
		return config
	}
}