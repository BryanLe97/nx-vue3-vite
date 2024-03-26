<template>
	<div class="page-header neutral-1">
		<a-page-header :title="title" :sub-title="subTitle" @back="back">
			<template v-if="hasTag">
				<template slot="tags">
					<slot name="tag-content"></slot>
				</template>
			</template>
		</a-page-header>
	</div>
</template>

<script>
export default {
	name: 'PageHeader',

	props: {
		title: {
			type: String,
			default: '',
		},
		subTitle: {
			type: String,
			default: '',
		},
		back: {
			type: Function,
			required: true,
		},
		hasTag: {
			type: [Boolean, Number],
			default: false,
		},
	},
}
</script>

<style lang="scss" scoped>
.page-header {
	:deep(.ant-page-header-heading-title) {
		font-weight: 500;
		color: #272d35;
		text-transform: capitalize;
	}
	:deep(.ant-page-header-heading-sub-title) {
		margin-top: 6px;
		margin-bottom: 6px;
	}
}
</style>
