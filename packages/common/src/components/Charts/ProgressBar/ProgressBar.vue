<template>
	<div>
		<div class="d-flex align-items-center justify-content-between">
			<div>{{ name }}</div>
			<div class="neutral-10--text">{{ formatData(data) + suffix }}</div>
		</div>
		<div :id="name" class="pt-1"></div>
	</div>
</template>

<script>
import { Progress } from '@antv/g2plot'

import numeral from 'numeral'

export default {
	name: 'ProgressBar',

	props: {
		name: {
			type: String,
			default: '',
		},
		data: {
			type: Number,
			default: null,
		},
		suffix: {
			type: String,
			default: '%',
		},
		format: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: '#30BF78',
		},
	},

	data() {
		return {
			progress: undefined,
		}
	},

	computed: {
		config() {
			return {
				height: 30,
				percent: this.data / 100,
				barWidthRatio: 0.7,
				color: this.color,
			}
		},
	},

	watch: {
		config(newVal) {
			this.progress.update(newVal)
		},
	},

	mounted() {
		this.progress = new Progress(this.name, this.config)

		this.progress.render()
	},

	methods: {
		formatData(number) {
			if (this.format) return numeral(number).format(this.format)
			return number
		},
	},
}
</script>

<style lang="scss" scoped></style>
