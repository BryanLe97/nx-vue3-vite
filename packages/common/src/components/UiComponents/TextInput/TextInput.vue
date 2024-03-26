<template>
	<div
		class="text-input"
		:class="`${hiddenField ? 'hidden-field' : ''} ${labelAlignClass}`"
	>
		<validation-provider
			v-if="formItem"
			v-slot="slotProps"
			:custom-messages="customMessages"
			:name="customName ? customName : label"
			:rules="rules"
		>
			<a-form-item
				:colon="false"
				has-feedback
				:help="showError && slotProps.errors[0]"
				:label="showLabel ? label : undefined"
				:validate-status="resolveState(slotProps)"
			>
				<a-spin :spinning="loading" size="small">
					<a-input
						v-mask="mask"
						ref="text-input-component"
						:class="className"
						:auto-focus="hiddenField"
						:placeholder="!disabled ? placeholder : ''"
						:disabled="disabled"
						:prefix="prefix"
						:max-length="maxLength"
						:size="inputSize"
						:value="inputValue"
						@pressEnter="onPressEnter"
						@change="onChange"
						@blur="onBlur"
						@focus="onFocus"
						@paste="onPaste"
					>
						<template v-if="suffix" slot="suffix">
							<slot name="custom-suffix"></slot>
							{{ suffix }}
						</template>
					</a-input>
				</a-spin>
			</a-form-item>
		</validation-provider>

		<template v-else>
			<label v-if="label && showLabel">{{ label }}</label>

			<a-spin :spinning="loading" size="small">
				<a-input
					v-mask="mask"
					ref="text-input-component"
					:class="className"
					:auto-focus="hiddenField"
					:placeholder="!disabled ? placeholder : ''"
					:disabled="disabled"
					:prefix="prefix"
					:max-length="maxLength"
					:size="inputSize"
					:value="inputValue"
					@pressEnter="onPressEnter"
					@change="onChange"
					@blur="onBlur"
					@focus="onFocus"
					@paste="onPaste"
				>
					<template slot="suffix">
						<slot name="custom-suffix"></slot>
						{{ suffix }}
					</template>
				</a-input>
			</a-spin>
		</template>
	</div>
</template>

<script>
export default {
	name: 'TextInput',
	inheritAttrs: false,

	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		formItem: {
			type: Boolean,
			default: false,
		},
		hiddenField: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		},
		// Choose from start, end, center, baseline, or stretch
		labelAlign: {
			type: String,
			default: null,
		},
		customName: {
			type: String,
			default: '',
		},
		customMessages: {
			type: Object,
			default: undefined,
		},
		maxLength: {
			type: Number,
			default: null,
		},
		placeholder: {
			type: String,
			default: '',
		},
		rules: {
			type: [Object, String],
			default: '',
		},
		suffix: {
			type: String,
			default: '',
		},
		prefix: {
			type: String,
			default: '',
		},
		value: {
			type: [String, Number],
			default: '',
		},
		parseValue: {
			type: Function,
			default: (value) => value,
		},
		mask: {
			type: String,
			default: null,
		},
		showLabel: {
			type: Boolean,
			default: true,
		},
		className: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		showError: {
			type: Boolean,
			default: true,
		},
		inputSize: {
			type: String,
			default:
				'default' /** following 3 values as the antdv doc: large, default, small */,
		},
	},

	data() {
		return {
			inputValue: this.parseValue(
				this.value ? this.value.toString().trim() : this.value
			),
		}
	},

	computed: {
		labelAlignClass() {
			if (this.labelAlign)
				return `d-flex flex-column align-items-${this.labelAlign}`
			return ''
		},
	},

	watch: {
		value(newVal) {
			this.inputValue = this.parseValue(newVal)
		},
	},

	methods: {
		resolveState({ errors }) {
			const [firstError] = errors

			if (firstError) {
				this.$emit('error', firstError)
				return 'error'
			}

			this.$emit('error', null)

			return ''
		},

		onChange({ target: { value } }) {
			this.inputValue = value
			this.$emit('change', value)
		},

		onPressEnter() {
			this.$emit('enter', this.inputValue)
		},

		onBlur() {
			this.inputValue = this.parseValue(this.inputValue.trim())
			this.$emit('blur', this.inputValue)
		},

		onFocus() {
			this.$emit('focus', true)
		},

		onPaste(event) {
			/**
			 * Handle a case when user paste a value with spaces
			 */
			event.preventDefault()
			if (this.disabled) return

			// Get the input element
			const textInput = this.$refs['text-input-component']
			const inputElement = textInput.$refs.input

			const pastedValue = event.clipboardData.getData('text').trim()
			const currentValue = event.target.value

			// Get the current cursor position
			const startCursorPosition = inputElement.selectionStart
			const endCursorPosition = inputElement.selectionEnd

			// Insert the pasted content at the cursor position
			const value =
				currentValue.slice(0, startCursorPosition) +
				pastedValue +
				currentValue.slice(endCursorPosition)
			inputElement.value = value

			// Update the cursor position after the pasted content
			const newCursorPosition = startCursorPosition + pastedValue.length
			inputElement.setSelectionRange(newCursorPosition, newCursorPosition)

			// Assign value for inputValue
			this.inputValue = value
			this.$emit('change', this.inputValue)
		},
	},
}
</script>

<style lang="scss" scoped>
.text-input {
	&.hidden-field {
		padding: 0 !important;

		:deep(input) {
			opacity: 0;
		}
	}

	.ant-spin-nested-loading {
		:deep(.ant-spin-dot-spin) {
			left: 20px;
		}
	}

	.ant-form-item {
		:deep(.ant-form-item-children) {
			display: block;
		}
	}
}
</style>
