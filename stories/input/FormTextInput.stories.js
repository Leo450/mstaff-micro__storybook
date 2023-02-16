import FormTextInput from '../../src/components/input/FormTextInput'

export default {
	title: 'Form/FormTextInput',
	component: FormTextInput,
	argTypes: {
		state: {
			description: 'Force state',
			control: {
				type: 'select',
				options: {
					none: null,
					valid: 'valid',
					error: 'error'
				}
			}
		},
		label: {},
		legend: {},
		assert: {
			description: 'Array of assert rules',
			controls: {
				type: 'object'
			},
			table: {
				type: {
					summary: 'array'
				}
			}
		},
		multiline: {},
		inlineLabel: {
			description: 'Force label to be inline',
		},
		size: {
			control: {
				type: 'select',
				options: {
					default: null,
					small: 'sm',
					medium: 'md'
				}
			}
		}
	}
}

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { FormTextInput },
	template: '<FormTextInput v-model="model" v-bind="$props"/>',
	data()
	{
		return {
			model: null
		}
	}
})

export const Default = Template.bind({})
Default.args = {
	state: null,
	label: 'My awesome label',
	legend: '',
	assert: ['required'],
	multiline: false,
	inlineLabel: false,
	size: null
}