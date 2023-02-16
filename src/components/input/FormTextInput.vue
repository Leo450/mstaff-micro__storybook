<template>
	<div class="FormInput__root FormTextInput__root" :class="_classes">
		<div class="FormInput__wrapper">
			<label class="FormInput__label" v-if="label">
				{{ label }}
			</label>
			<fieldset class="FormInput__fieldset">
				<legend v-if="label">
					<span>
						{{ label }}
					</span>
				</legend>
			</fieldset>
			<!-- Passing all attributes from parent with v-bind="$attrs" and propagating all events to parents with v-on="$listeners" -->
			<b-input
				v-if="!multiline"
				ref="FormTextInput__input"
				class="FormTextInput__input"
				v-bind="{ ...$attrs, placeholder: null }"
				v-on="$listeners"
				@focus="focused = true"
				@blur="focused = false; idle = false"
				@input="autofilled = false; idle = false"
				@transitionstart="onAutofill"
			/>
			<b-textarea
				v-else
				class="FormTextInput__input"
				v-bind="{ ...$attrs, placeholder: null }"
				v-on="$listeners"
				@focus="focused = true"
				@blur="focused = false; idle = false"
				@input="idle = false"
			></b-textarea>
		</div>
		<p class="FormInput__legend" v-if="legend && (idle || _isValid)">
			{{ legend }}
		</p>
		<div class="FormInput__errors" v-if="!_isValid && !idle">
			<p v-for="error in _errors">
				{{ error }}
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			state: {
				type: String,
				required: false
			},
			label: {
				type: String,
				required: false
			},
			legend: {
				type: String,
				required: false
			},
			assert: {
				required: false
			},
			multiline: {
				type: Boolean
			},
			inlineLabel: {
				type: Boolean
			},
			size: {
				type: String
			}
		},
		computed: {
			_classes()
			{
				const classes = {}
				classes['FormInput--' + this._state] = !!this._state
				classes['FormInput--has-value'] = this._hasValue
				classes['FormInput--focused'] = this.focused
				classes['FormInput--inline-label'] = this.inlineLabel || (this.$attrs.type === 'date')
				classes['FormInput--autofilled'] = this.autofilled
				classes['FormTextInput--multiline'] = this.multiline
				classes['FormTextInput--type-date'] = this.$attrs.type === 'date'
				classes['FormTextInput--size-' + this.size] = !!this.size
				return classes
			},
			_state()
			{
				if (this.state) return this.state
				return this.idle ? 'idle' : (this._isValid ? 'valid' : 'error')
			},
			_hasValue()
			{
				return this.$attrs.value && this.$attrs.value.length
			},
			_isValid()
			{
				return this._errors.length === 0
			},
			_errors()
			{
				return this._formInputAssert(this.$attrs.value, this.assert)
			}
		},
		watch: {
			_isValid(newVal)
			{
				this.$emit('is-valid', newVal)
			}
		},
		methods: {
			onAutofill()
			{
				this.autofilled = true
			}
		},
		data()
		{
			return {
				focused: false,
				autofilled: false,
				idle: true
			}
		},
		mounted()
		{
			this.$emit('is-valid', this._isValid)
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/components/FormInput";

	.FormTextInput__root {

		.FormTextInput__input {
			height: auto;
			padding: 18px 0;
			border: none;
			border-radius: 0;
			font: inherit;
			transition: all .1s ease;

			&:focus {
				outline: none;
				box-shadow: none;
			}
		}

		&.FormInput--focused, &.FormInput--autofilled, &.FormInput--has-value, &.FormTextInput--type-date {
			.FormTextInput__input {
				padding: 18px 14px;
			}
		}

		&.FormTextInput--multiline {

			.FormTextInput__input {
				padding: 0 14px 18px 14px;
				margin-top: 18px;
			}

			.FormInput__label {
				top: 1.5em;
			}

			.FormTextInput__input {
				resize: none;
			}

		}

		&.FormTextInput--size-sm {

			.FormTextInput__input {
				padding-top: 4px;
				padding-bottom: 4px;
			}

			&.FormTextInput--multiline {
				.FormTextInput__input {
					margin-top: 4px;
				}
			}

		}

		&.FormTextInput--size-md {

			.FormTextInput__input {
				padding-top: 8px;
				padding-bottom: 8px;
			}

			&.FormTextInput--multiline {
				.FormTextInput__input {
					margin-top: 8px;
				}
			}

		}

	}

	@keyframes autofillDetector {}
	input:-webkit-autofill {
		animation-name: autofillDetector;
	}
</style>