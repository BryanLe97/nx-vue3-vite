<template>
	<div class="time-picker-input" :class="disabled ? 'disabled' : ''">
		<validation-provider
			v-if="formItem"
			v-slot="slotProps"
			:name="label"
			:rules="rules"
		>
			<a-form-item
				:colon="false"
				has-feedback
				:help="slotProps.errors[0]"
				:label="label"
				:validate-status="resolveState(slotProps)"
			>
				<a-time-picker
					v-model="inputValue"
					:use12-hours="use12Hours"
					:disabled="disabled"
					:placeholder="placeholder"
					:format="formatTime"
					@change="onChange"
				/>
			</a-form-item>
		</validation-provider>

		<template v-else>
			<label v-if="label">{{ label }}</label>

			<div>
				<a-time-picker
					v-model="inputValue"
					use12-hours
					:disabled="disabled"
					:placeholder="placeholder"
					:format="formatTime"
					@change="onChange"
				/>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	name: 'TimePicker',

	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		formatTime: {
			type: String,
			default: 'hh:mm A',
		},
		formItem: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		rules: {
			type: [String, Object],
			default: '',
		},
		use12Hours: {
			type: Boolean,
			default: true,
		},
		value: {
			type: [Object, String],
			default: null,
		},
	},

	data() {
		return {
			inputValue: this.convertValue(this.value),
		}
	},

	watch: {
		value(newVal) {
			this.inputValue = this.convertValue(newVal)
		},
	},

	methods: {
		convertValue(value) {
			const timeValue = this.$moment(value).isValid()
				? this.$moment(value)
				: this.$moment(value, this.formatTime)
			return typeof value == 'string' ? timeValue : value
		},

		resolveState({ errors }) {
			if (errors[0]) return 'error'
			return ''
		},

		onChange(value) {
			if (value) {
				this.$emit('change', value.format(this.formatTime))
			} else {
				this.$emit('change', value)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.time-picker-input {
	.ant-calendar-picker {
		width: 100%;
	}
	&.disabled {
		:deep(.anticon) {
			display: none;
		}
	}
}
</style>
