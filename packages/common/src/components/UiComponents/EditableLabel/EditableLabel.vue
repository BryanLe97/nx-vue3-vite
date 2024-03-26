<template>
	<div
		v-click-outside="onBlur"
		:class="[
			'editable-label',
			className,
			{ editable: !disabled },
			{ 'has-suffix': suffixInput },
			{ disabled },
		]"
		@click="onClick"
	>
		<template v-if="focused">
			<a-tooltip :overlay-class-name="error ? 'has-error' : ''">
				<template v-if="error && errorType === 'tooltip'" #title>
					{{ error }}
				</template>

				<text-input
					v-if="inputType === 'text'"
					ref="text-input"
					class="editable-label--text-input"
					:form-item="formItem"
					:label="label"
					:show-label="showLabel"
					:placeholder="placeholder"
					:value="inputValue"
					:max-length="maxLength"
					:suffix="suffixInput"
					:prefix="prefixInput"
					:rules="rules"
					:show-error="errorType !== 'tooltip'"
					:loading="loading"
					:disabled="disabled"
					@change="onChange"
					@error="onError"
					@blur="onOutFocus"
				/>

				<select-input
					v-if="inputType === 'select'"
					ref="select-input"
					class="editable-label--select-input"
					allow-clear
					:custom-search="customSearch"
					:form-item="formItem"
					:mode="mode"
					:label="label"
					:show-label="showLabel"
					:placeholder="placeholder"
					:data-source="dataSource"
					:search-debounce-time="searchDebounceTime"
					:source="source"
					:source-description="sourceDescription"
					:source-label="sourceLabel"
					:value="inputValue"
					:option-filter="optionFilter"
					:filter-type="filterType"
					:default-active-first-option="defaultActiveFirstOption"
					:rules="rules"
					:show-error="errorType !== 'tooltip'"
					:loading="loading"
					:disabled="disabled"
					@change="onChange"
					@error="onError"
					@search="onSearch"
				/>
			</a-tooltip>
		</template>

		<div v-else class="editable-label__content text-ellipsis">
			<slot name="prefix" />

			<span v-if="text === 'empty' || (showEmptyValue && inputValue === null)">
				{{ text }}
			</span>

			<a-tooltip v-else :title="hasTooltip && text">
				<div class="text-ellipsis">{{ text }}</div>
			</a-tooltip>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral'

import { FILTERS_CONTAINS } from '@/constants/index.js'

export default {
	name: 'EditableLabel',

	props: {
		customSearch: {
			type: Boolean,
			default: false,
		},
		className: {
			type: String,
			default: '',
		},
		dataSource: {
			type: Array,
			default: null,
		},
		defaultActiveFirstOption: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		errorType: {
			type: String,
			default: 'default',
		},
		filterType: {
			type: String,
			default: FILTERS_CONTAINS,
		},
		focusedOn: {
			type: Boolean,
			default: false,
		},
		formItem: {
			type: Boolean,
			default: false,
		},
		hasEnter: {
			type: Boolean,
			default: false,
		},
		hasTooltip: {
			type: Boolean,
			default: false,
		},
		inputType: {
			type: String,
			default: 'text',
			validator: (type) => {
				const inputTypes = ['text', 'select']
				return inputTypes.includes(type)
			},
		},
		label: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		maxLength: {
			type: Number,
			default: null,
		},
		mode: {
			type: String,
			default: 'default',
		},
		numberFormat: {
			type: String,
			default: '',
		},
		optionFilter: {
			type: Function,
			default: undefined,
		},
		placeholder: {
			type: String,
			default: '',
		},
		prefixInput: {
			type: String,
			default: '',
		},
		rules: {
			type: [Object, String],
			default: '',
		},
		searchDebounceTime: {
			type: Number,
			default: 600,
		},
		showEmptyValue: {
			type: Boolean,
			default: false,
		},
		showLabel: {
			type: Boolean,
			default: false,
		},
		source: {
			type: String,
			default: '',
		},
		sourceDescription: {
			type: String,
			default: '',
		},
		sourceLabel: {
			type: [String, Function],
			default: '',
		},
		suffixInput: {
			type: String,
			default: '',
		},
		value: {
			type: [String, Number],
			default: '',
		},
	},

	data() {
		let inputValue = this.value

		if (this.inputType === 'select') {
			const value = this.dataSource.find(
				(option) => option[this.source] === inputValue
			)

			if (value) inputValue = value[this.source]
		}

		return {
			error: null,
			focused: this.focusedOn,
			isSelectChanged: false,
			inputValue,
			searchValue: null,
		}
	},

	computed: {
		text() {
			let value
			const { inputValue, numberFormat, showEmptyValue } = this

			switch (this.inputType) {
				case 'select':
					value = this.dataSource.find(
						(option) => option[this.source] == inputValue
					)

					if (!value) return 'empty'

					return value[this.sourceLabel]

				default:
					if (showEmptyValue && inputValue == 0) return 0
					if (!inputValue) return 'empty'
					if (numberFormat)
						return numeral(
							numberFormat.includes('%') ? inputValue / 100 : inputValue
						).format(numberFormat)

					return inputValue
			}
		},
	},

	watch: {
		focused(newVal) {
			if (!newVal) return
			switch (this.inputType) {
				case 'select':
					this.$nextTick(() => {
						const selectInput =
							this.$refs['select-input'].$el.querySelector('.ant-select')
						selectInput.click()
					})
					break
				default:
					this.$nextTick(() => {
						const textInput =
							this.$refs['text-input'].$el.querySelector('.ant-input')
						textInput.select()
					})
			}
		},

		focusedOn(newVal) {
			if (!this.error) {
				this.focused = newVal
			}
		},

		value(newVal) {
			this.inputValue = newVal
		},
	},

	mounted() {
		if (this.hasEnter) {
			this.$el.addEventListener('keydown', this.onEnter)
		}
	},

	beforeDestroy() {
		this.$el.removeEventListener('keydown', this.onEnter)
	},

	methods: {
		onOutFocus(value) {
			if (!this.error) {
				this.focused = false
				this.$emit('blur', value)
			}
		},

		onChange(value) {
			this.inputValue = value
			this.$emit('change', value)

			if (this.inputType === 'select') {
				this.isSelectChanged = true
			}
		},

		onClick() {
			if (!this.disabled) {
				this.focused = true
			}
		},

		onBlur() {
			if (!this.focusedOn && !this.error && !this.isSelectChanged) {
				this.focused = false
			}

			this.isSelectChanged = false
		},

		onError(error) {
			this.error = error
		},

		onEnter(event) {
			const { key } = event

			if (key === 'Enter') {
				this.$emit(
					'enter',
					this.inputType === 'select' ? this.searchValue : this.inputValue
				)
			}
		},

		onSearch(value) {
			this.searchValue = value
			this.$emit('search', this.searchValue)
		},
	},
}
</script>

<style lang="scss" scoped>
.editable-label {
	&.editable {
		cursor: pointer;
	}
	&.disabled {
		cursor: not-allowed;
	}
	&--text-input {
		animation: show-input 0.3s;
		:deep(.ant-form-item-control) {
			line-height: 20px;
			.ant-input {
				height: 20px;
			}
		}
	}
	&--select-input {
		:deep(.ant-form-item-control) {
			height: 20px;
			line-height: 0;
			.ant-form-item-children {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				.ant-select-selection {
					height: 20px;
					.ant-select-selection__rendered {
						line-height: 0;
						.ant-select-selection-selected-value {
							line-height: 20px;
						}
						.ant-select-search__field__wrap {
							height: 18px;
						}
					}
				}
			}
		}
	}
	&.has-suffix {
		:deep(.ant-input-suffix) {
			top: 12px;
		}
		:deep(.has-error) {
			.ant-input {
				padding-right: 42px;
				box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
			}
			.ant-input-affix-wrapper {
				.ant-input {
					padding-right: 42px;
				}
				.ant-input-suffix {
					right: -10px;
				}
			}
		}
		:deep(.ant-form-item-children-icon) {
			right: 14px;
		}
	}
	span {
		opacity: 0;
	}
	&__content {
		display: flex;
		align-items: center;
	}
}
@keyframes show-input {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>

<style lang="scss">
.ant-tooltip {
	&.has-error {
		.ant-tooltip-inner {
			background-color: rgba(245, 34, 45, 0.85);
		}
		.ant-tooltip-arrow {
			&::before {
				background-color: rgba(245, 34, 45, 0.85);
			}
		}
	}
}
</style>
