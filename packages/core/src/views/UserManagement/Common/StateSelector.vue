<template>
	<div class="radio-group">
		<input
			:class="obj.first.isActive ? 'checked' : ''"
			type="radio"
			:name="name"
		/>
		<label
			:for="name + 'one'"
			class="first"
			:disabled="obj.first.isActive"
			@click="click('first', obj.first.isActive)"
		>
			<CloseOutlined />
		</label>

		<input
			:class="obj.second.isActive ? 'checked' : ''"
			type="radio"
			:name="name"
		/>
		<label
			v-if="!isTwoStates"
			@click="click('second')"
			class="second"
			:for="name + 'two'"
		>
			<component :is="obj.second.icon" />
		</label>

		<input
			:class="obj.third.isActive ? 'checked' : ''"
			:check="true"
			type="radio"
			:name="name"
		/>
		<label
			:for="name + 'three'"
			class="last"
			:disabled="obj.third.isActive"
			@click="click('third', obj.third.isActive)"
		>
			<CheckOutlined />
		</label>
	</div>
</template>

<script>
const TYPE_VALUES = {
	first: 'DENIED',
	second: 'RESTORED',
	third: 'GRANTED',
}

export default {
	name: 'StateSelector',

	props: {
		name: {
			type: [Number, String],
			default: '',
		},
		item: {
			type: Object,
			required: true,
		},
		itemIdx: {
			type: Number,
			required: true,
		},
		isTwoStates: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		const obj = {
			first: {
				isActive: null,
				value: null,
			},
			second: {
				isActive: null,
				icon: this.item.isParentRestricted ? 'close' : 'check',
			},
			third: {
				isActive: null,
				value: null,
			},
		}

		return {
			obj,
		}
	},

	mounted() {
		if (this.item.isInherited) {
			this.obj.second.isActive = true
			this.obj.first.isActive = false
			this.obj.third.isActive = false
		} else {
			this.obj.second.isActive = true
			this.obj.first.isActive = this.item.isRestricted
			this.obj.third.isActive = !this.item.isRestricted
		}
	},

	methods: {
		click(type, isActive) {
			const value = isActive
				? null
				: { type: TYPE_VALUES[type], item: this.item, itemIdx: this.itemIdx }

			this.$emit('element-clicked', value)
		},
	},
}
</script>

<style lang="scss" scoped>
$bg: rgba(75, 69, 69, 0.85);
$fg: lighten($bg, 5%);
$borderWidth: 1px;

input[type='radio'] {
	position: absolute;
	visibility: hidden;
	display: none;
}

label {
	color: lighten($bg, 40%);
	display: inline-block;
	cursor: pointer;
	font-weight: bold;
	padding: 1px 8px;

	&.first,
	&.second,
	&.last {
		border: $borderWidth solid $bg;
	}

	&.first {
		border-right: none;
	}

	&.last {
		border-left: none !important;
	}

	&.second {
		background: #eaedf0;

		& > .anticon-check {
			color: #12a272;
		}

		& > .anticon-close {
			color: #f5222d;
		}
	}
}

input.checked + label.second {
	border: $borderWidth solid $fg;
}

input.checked + label.first {
	color: #fff;
	background: #ff7875;
	border: $borderWidth solid #ff7875;
	border-right: $borderWidth solid #ff7875;
}

input.checked + label.last {
	color: #fff;
	background: rgb(51, 202, 102);
	border: $borderWidth solid rgb(51, 202, 102);
}

.radio-group {
	display: inline-block;
	border-radius: 2px;
	overflow: hidden;
}

label[disabled] {
	cursor: not-allowed;
}

div[disabled] {
	pointer-events: none;
	opacity: 0.5;
}
</style>
