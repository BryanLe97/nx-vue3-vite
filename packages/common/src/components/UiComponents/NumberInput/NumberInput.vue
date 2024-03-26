<template>
	<div class="number-input" :class="isHideArrow ? 'is-hide-arrow' : ''">
		<validation-provider
			v-if="formItem"
			v-slot="slotProps"
			:name="customName ? customName : label"
			:rules="rules"
		>
			<a-form-item
				has-feedback
				:colon="false"
				:help="slotProps.errors[0]"
				:label="showLabel ? label : undefined"
				:validate-status="resolveState(slotProps)"
			>
				<a-input-number
					ref="inputNumber"
					v-model="inputValue"
					:style="customStyle"
					:disabled="disabled"
					:max="max"
					:min="min"
					:placeholder="placeholder"
					:formatter="getType.formatter"
					:parser="getType.parser"
					:step="step"
					@change="onChange"
				/>
				<div v-if="suffix" class="suffix-number-input">{{ suffix }}</div>
			</a-form-item>
		</validation-provider>

		<template v-else>
			<label v-if="label">{{ label }}</label>
			<a-input-number
				ref="inputNumber"
				v-model="inputValue"
				:style="customStyle"
				:disabled="disabled"
				:max="max"
				:min="min"
				:placeholder="placeholder"
				:formatter="getType.formatter"
				:parser="getType.parser"
				:step="step"
				@change="onChange"
			/>
			<div v-if="suffix" class="suffix-number-input">{{ suffix }}</div>
		</template>
	</div>
</template>

<script>
function defaultDecimalParser(value) {
	let appearTimes = 0

	return value.replace(/\D/g, (match) => {
		return match === '.' && ++appearTimes === 1 ? match : ''
	})
}

export default {
	name: 'NumberInput',
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
		label: {
			type: String,
			default: '',
		},
		customName: {
			type: String,
			default: '',
		},
		max: {
			type: Number,
			default: Infinity,
		},
		min: {
			type: Number,
			default: -Infinity,
		},
		placeholder: {
			type: String,
			default: '',
		},
		rules: {
			type: [Object, String],
			default: '',
		},
		step: {
			type: Number,
			default: 1,
		},
		suffix: {
			type: String,
			default: '',
		},
		value: {
			type: [String, Number],
			default: '',
		},
		type: {
			type: String,
			default: 'number',
		},
		isHideArrow: {
			type: Boolean,
			default: false,
		},
		isBlank: {
			type: Boolean,
			default: false,
		},
		showLabel: {
			type: Boolean,
			default: true,
		},
		formatter: {
			type: Function,
			default: (value) => value,
		},
		parser: {
			type: Function,
			default: (value) => value.replace(/[^0-9]/g, ''),
		},
		interLength: {
			type: Number,
			default: 15,
		},
		decimalLength: {
			type: Number,
			default: 2,
		},
		customStyle: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			inputValue: this.value,
		}
	},
	computed: {
		getType() {
			switch (this.type) {
				case 'currency':
					return {
						formatter: (value) => {
							if (!value || (this.isBlank && value == 0)) return
							return '$ ' + this.defaultFormatter(value)
						},
						parser: (value) => this.decimalParser(value),
					}
				case 'percent':
					return {
						formatter: (value) => {
							if (!value || (this.isBlank && value == 0)) return
							return this.defaultFormatter(value) + ' %'
						},
						parser: (value) => this.decimalParser(value),
					}
				case 'decimal':
					return {
						formatter: (value) => {
							if (!value || (this.isBlank && value == 0)) return
							return this.defaultFormatter(value)
						},
						parser: (value) => this.decimalParser(value),
					}
				default:
					return {
						formatter: (value) => this.formatter(value),
						parser: (value) => this.parser(value),
					}
			}
		},
	},
	watch: {
		value(newVal) {
			this.inputValue = newVal
		},
	},
	methods: {
		decimalParser(value) {
			if (value === '-') return value
			let parsedValue = defaultDecimalParser(value) //remove special characters

			const [integerPart, decimalPart] = String(parsedValue).split('.') // split the int and the dec
			const limitedIntegerPart = integerPart.slice(0, this.interLength) // limit integer part to inter length characters
			const limitedDecimalPart = decimalPart
				? decimalPart.slice(0, this.decimalLength)
				: null // limit decimal part to decimal length characters if present

			parsedValue =
				limitedIntegerPart +
				(limitedDecimalPart
					? `.${limitedDecimalPart}`
					: parsedValue.includes('.')
					? '.'
					: '')

			return (value.includes('-') ? '-' : '') + parsedValue // join the int and the dec together
		},

		defaultFormatter(value) {
			const [integerPart, decimalPart] = String(value).split('.') // split the int and the dec
			const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			const formattedDecimal = decimalPart ? '.' + decimalPart : ''

			return (
				formattedInteger +
				(formattedDecimal ? formattedDecimal : value.includes('.') ? '.' : '')
			)
		},

		resolveState({ errors }) {
			if (errors[0]) return 'error'
			return ''
		},

		onChange(value) {
			this.$emit('change', parseFloat(value))
		},
	},
}
</script>

<style lang="scss" scoped>
.number-input {
	:deep(input) {
		font-size: 14px;
	}
}

.suffix-number-input {
	color: #afb9c5;
	position: absolute;
	top: 50%;
	right: 12px;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	line-height: 0;
}
.is-hide-arrow {
	:deep(.ant-input-number-handler-wrap) {
		display: none !important;
	}
}
</style>
