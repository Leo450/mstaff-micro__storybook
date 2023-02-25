import FormSelectInput from '../../src/components/input/FormSelectInput'

export default {
	title: 'Design System/data-entry/FormSelectInput',
	component: FormSelectInput
}

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { FormSelectInput },
	template: '<FormSelectInput v-model="model" :options="options" v-bind="$props"/>',
	data()
	{
		return {
			model: null,
			options: [
				'Option 1',
				'Option 2',
				'Option 3'
			]
		}
	}
})

export const Default = Template.bind({})
Default.args = {}