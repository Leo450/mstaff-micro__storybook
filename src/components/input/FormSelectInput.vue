<template>
	<div class="FormInput__root" :class="_classes">
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
			<Multiselect
				ref="multiselect"
				class="FormSelectInput__input"
				v-bind="$attrs"
				v-on="$listeners"
				@open="onOpen"
				@close="onClose"
				@input="idle = false"
				:showLabels="false"
				:label="optionLabel"
				:placeholder="placeholder || null"
			>
				<template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
					<slot :name="name" v-bind="data"></slot>
				</template>
				<template #caret>
					<div class="multiselect__select">
						<i class="fal fa-angle-down"></i>
					</div>
				</template>
				<template #maxElements>
					<span class="multiselect__option__content">
						Maximum d'options sélectionnées. Supprimez d'abord une option pour en sélectionner une autre.
					</span>
				</template>
				<template #noResult>
					<span class="multiselect__option__content">
						Aucun élément trouvé. Essayez de modifier la recherche.
					</span>
				</template>
				<template #noOptions>
					<span class="multiselect__option__content">
						Aucun élément.
					</span>
				</template>
				<template #tag="{ option }">
					<span class="multiselect__tag">
						<slot name="tagLabel" :option="option">
							<span v-b-tooltip :title="optionLabel ? option[optionLabel] : option" v-if="(optionLabel ? option[optionLabel] : option).length > 30">
								{{ (optionLabel ? option[optionLabel] : option) | truncate(30) }}
							</span>
							<template v-else>
								{{ (optionLabel ? option[optionLabel] : option) }}
							</template>
						</slot>
						<i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)"></i>
					</span>
				</template>
			</Multiselect>
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
	import Multiselect from 'vue-multiselect'

	export default {
		props: {
			classes: {
				type: Object,
				default: _ => ({})
			},
			state: {
				type: String,
				required: false
			},
			label: {
				type: String,
				required: false
			},
			placeholder: {
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
			inlineLabel: {
				type: Boolean
			},
			hideTags: {
				type: Boolean
			},
			optionLabel: {
				type: String
			},
			size: {
				type: String
			},
			inline: {
				type: Boolean
			},
			filter: {
				type: Boolean
			},
			noState: {
				type: Boolean
			}
		},
		components: { Multiselect },
		computed: {
			_classes()
			{
				const classes = { ...this.classes }
				classes['FormSelectInput__root'] = true
				classes['FormInput--' + this._state] = !this.noState && !!this._state
				classes['FormInput--has-value'] = this._hasValue
				classes['FormInput--hide-value'] = this.hideTags
				classes['FormInput--focused'] = this.focused
				classes['FormInput--inline-label'] = this.inlineLabel || (this.$attrs.type === 'date')
				classes['FormSelectInput--multiple'] = this.$attrs.multiple !== undefined
				classes['FormSelectInput--size-' + this.size] = !!this.size
				classes['FormSelectInput--inline'] = this.inline
				classes['FormSelectInput--filter'] = this.filter
				return classes
			},
			_state()
			{
				if (this.state) return this.state
				return this.idle ? 'idle' : (this._isValid ? 'valid' : 'error')
			},
			_hasValue()
			{
				if (this.$attrs.multiple !== undefined) {
					return this.$attrs.value && this.$attrs.value.length
				}
				return !!this.$attrs.value
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
		data()
		{
			return {
				focused: false,
				idle: true
			}
		},
		methods: {
			onOpen()
			{
				this.focused = true

				// Force content wrapper height
				this.refreshDropdown()
			},
			onClose()
			{
				this.focused = false
				this.idle = false
			},
			remove(option)
			{
				const index = this.$attrs.value.findIndex(e => e === option)
				if (index === -1) return
				this.$attrs.value.splice(index, 1)
				this.$emit('input', this.$attrs.value)
			},
			refreshDropdown()
			{
				this.$nextTick(_ => {
					const $content_wrapper = this.$refs.multiselect.$el.querySelector('.multiselect__content-wrapper')
					const $content = $content_wrapper.querySelector('.multiselect__content')
					const contentHeight = parseInt($content.offsetHeight)
					const contentWrapperMaxHeight = parseInt($content_wrapper.style.maxHeight)
					$content_wrapper.style.height = (contentHeight > contentWrapperMaxHeight ? contentWrapperMaxHeight : contentHeight) + 'px'
				})
			},
			bindScroll()
			{
				const $content_wrapper = this.$refs.multiselect.$el.querySelector('.multiselect__content-wrapper')
				$content_wrapper.addEventListener('scroll', event => {
					if ($content_wrapper.scrollTop >= ($content_wrapper.scrollHeight - $content_wrapper.offsetHeight)) {
						this.$emit('scroll-end')
					}
				})
			}
		},
		mounted()
		{
			this.bindScroll()

			this.$emit('is-valid', this._isValid)
		}
	}
</script>

<style lang="scss">
	@import "~@/styles/components/FormInput.scss";

	.FormSelectInput__root {

		.FormSelectInput__input {
			min-height: auto;
			display: flex;
			flex-direction: row-reverse;

			// Dropdown arrow
			.multiselect__select {
				position: static;
				top: auto;
				right: auto;
				width: auto;
				height: auto;
				display: flex;
				align-items: center;
				padding: 0 14px;
				font-size: 1.5em;

				&:before {
					display: none;
				}
			}

			.multiselect__tags {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-height: 60px;
				padding: 0;
				border: none;
				border-radius: 0;
				background: transparent;
				transition: all .1s ease;

				.multiselect__input, .multiselect__single {
					display: block;
					min-height: auto;
					padding: 14px;
					margin: 0;
					line-height: inherit;
					border-radius: 0;
					background: transparent;
				}

				.multiselect__input {
					transition: all .1s ease;
				}

				.multiselect__single {}

				.multiselect__placeholder {
					margin: 0;
					padding: 0 0 0 8px;
					color: $grey-10;
				}

				.multiselect__tags-wrap {
					flex-grow: 1;
					display: flex;
					align-items: center;
					padding: 14px;
					margin-bottom: -8px;
					flex-wrap: wrap;

					.multiselect__tag {
						padding: 4px 24px 4px 8px;
						margin: 0 8px 8px 0;
						background: $grey-0;
						color: $black;
						border-radius: 999px;
						line-height: inherit;

						.multiselect__tag-icon {
							width: auto;
							margin: 0;
							padding: 0 8px;
							border-right: 0;
							line-height: 2em;
							font-weight: inherit;

							&:after {
								color: $grey-10;
								font-size: 1.5em;
								transition: color .1s ease;
							}

							&:hover {
								background: transparent;

								&:after {
									color: $black;
								}
							}

							&:focus {
								background: transparent;
							}
						}
					}
				}
			}

			.multiselect__content-wrapper {
				top: 100%;
				border: none;
				box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);

				.multiselect__content {
					max-width: 100%;
				}

				.multiselect__option {
					min-height: auto;
					padding: 16px;
					transition: background-color .1s ease;
					overflow: hidden;
					text-overflow: ellipsis;

					&.multiselect__option--highlight {
						background-color: $grey-0;
						color: $black;
					}

					&.multiselect__option--selected {
						background-color: $green-0;
						font-weight: inherit;

						&.multiselect__option--highlight {
							background-color: $green-5;
						}
					}
				}
			}

		}

		&.FormSelectInput--multiple.FormInput--has-value.FormInput--focused {
			.FormSelectInput__input {
				.multiselect__tags {
					.multiselect__input {
						padding-top: 0;
					}
					.multiselect__tags-wrap {
						padding-bottom: 10px;
					}
				}
			}
		}

		&.FormSelectInput--multiple.FormInput--hide-value {
			.FormSelectInput__input {
				.multiselect__tags {
					.multiselect__tags-wrap {
						display: none;
					}
				}
			}
		}

		&.FormSelectInput--inline {
			.FormSelectInput__input {
				.multiselect__tags {
					min-width: 150px;
				}
			}
		}

		&.FormSelectInput--size-sm {
			.FormSelectInput__input {

				.multiselect__tags {
					min-height: 32px;

					.multiselect__input, .multiselect__single {
						padding: 6px 14px;
					}

					.multiselect__single {
						line-height: 18px;
					}

					.multiselect__tags-wrap {
						padding: 8px;
					}
				}

				.multiselect__content-wrapper {
					.multiselect__option {
						padding: 8px 16px;
					}
				}

			}
		}

		&.FormSelectInput--size-md {
			.FormSelectInput__input {

				.multiselect__tags {
					min-height: 36px;

					.multiselect__input, .multiselect__single {
						padding: 10px 14px;
					}

					.multiselect__single {
						line-height: 20px;
					}

					.multiselect__tags-wrap {
						padding: 10px;
					}
				}

				.multiselect__content-wrapper {
					.multiselect__option {
						padding: 10px 16px;
					}
				}

			}
		}

		&.FormSelectInput--filter {
			.FormInput__wrapper {
				border-radius: 16px;

				.FormSelectInput__input {

					.multiselect__select {
						position: relative;
						width: 40px;
						padding: 4px 8px;

						i {
							position: relative;
							margin: 0 auto;

							&:before {
								content: '';
								position: absolute;
								left: 50%;
								top: 50%;
								transform: translateX(-50%) translateY(-50%);
								border-color: #414987 transparent transparent;
								border-style: solid;
								border-width: 5px 5px 0;
							}
						}
					}

					.multiselect__tags {

						.multiselect__single {
							font-size: 0.9em;
						}

						.multiselect__placeholder {
							font-size: 0.9em;
							padding-left: 14px;
							color: #50588e;
						}

						.multiselect__tags-wrap {
							.multiselect__tag {
								padding-top: 2px;
								padding-bottom: 2px;
								font-size: 14px;

								.multiselect__tag-icon {
									line-height: 1.75em;
								}
							}
						}

					}

					.multiselect__content-wrapper {
						.multiselect__option {
							padding: 10px;
							font-size: 14px;
						}
					}
				}
			}

			&:not(.FormInput--valid) {
				.FormInput__wrapper {
					.FormInput__fieldset {
						border-color: #ced4da;
					}
				}
			}
		}

	}


</style>