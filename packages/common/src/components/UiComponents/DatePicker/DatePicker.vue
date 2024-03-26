<template>
	<div class="date-picker-input" :class="disabled ? 'disabled' : ''">
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
				:label="showLabel ? label : undefined"
				:validate-status="resolveState(slotProps)"
			>
				<a-date-picker
					v-model="inputValue"
					:disabled="disabled"
					:disabled-date="disabledDate"
					:disabled-time="disabledTime"
					:placeholder="placeholder"
					:format="formatDate"
					:show-time="showTime"
					:mode="mode"
					:open="open"
					@change="onChange"
					@openChange="onOpenChange"
					@panelChange="onPanelChange"
					@ok="onOk"
				/>
			</a-form-item>
		</validation-provider>

		<template v-else>
			<label v-if="label && showLabel">{{ label }}</label>

			<a-date-picker
				v-model="inputValue"
				:disabled="disabled"
				:disabled-date="disabledDate"
				:disabled-time="disabledTime"
				:placeholder="placeholder"
				:format="formatDate"
				:show-time="showTime"
				:mode="mode"
				:open="open"
				@change="onChange"
				@openChange="onOpenChange"
				@panelChange="onPanelChange"
				@ok="onOk"
			/>
		</template>
	</div>
</template>

<script>
export default {
	name: 'DatePicker',

	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		disabledDate: {
			type: Function,
			default: () => false,
		},
		disabledTime: {
			type: Function,
			default: () => false,
		},
		formatDate: {
			type: String,
			default: 'DD/MM/YYYY',
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
		value: {
			type: [Object, String],
			default: null,
		},
		showTime: {
			type: [Boolean, Object],
			default: false,
		},
		showLabel: {
			type: Boolean,
			default: true,
		},
		yearOnly: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			inputValue: this.convertValue(this.value),
			mode: this.yearOnly ? 'year' : 'date',
			open: this.handleOpen,
		}
	},

	watch: {
		value(newVal) {
			this.inputValue = this.convertValue(newVal)
		},
		handleOpen(newVal) {
			this.open = newVal
		},
	},

	methods: {
		convertValue(value) {
			return typeof value == 'string' ? this.$moment(value) : value
		},

		resolveState({ errors }) {
			if (errors[0]) return 'error'
			return ''
		},

		onChange(value) {
			if (value) {
				var dateFormat = 'YYYY-MM-DD'
				if (this.showTime) {
					dateFormat = 'YYYY-MM-DD HH:mm:ss'
				} else if (this.yearOnly) {
					dateFormat = 'YYYY'
				}
				this.$emit('change', value.format(dateFormat))
			} else {
				this.$emit('change', value)
			}
		},

		onOpenChange(status) {
			this.open = status
			this.$emit('update:handle-open', status)
		},

		onPanelChange(value, mode) {
			if (!this.yearOnly) {
				this.mode = mode
				return
			}
			this.inputValue = value
			this.onChange(value)
			this.open = false
		},

		onOk() {
			this.$emit('ok')
		},
	},
}
</script>

<style lang="scss" scoped>
.date-picker-input {
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
