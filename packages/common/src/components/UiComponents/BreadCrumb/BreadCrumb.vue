<template>
	<div :class="'breadcrumb-container ' + customPadding">
		<a-breadcrumb>
			<a-breadcrumb-item v-for="item in items" :key="item.title">
				<template v-if="item.path && item.path.length > 0">
					<router-link :to="item.path">{{ item.title }}</router-link>
				</template>
				<template v-else>
					<span>{{ item.title }}</span>
				</template>
			</a-breadcrumb-item>
		</a-breadcrumb>
	</div>
</template>
<script>
export default {
	name: 'BreadCrumb',

	props: {
		items: {
			type: Array,
			required: true,
		},
		customPadding: {
			type: String,
			default: 'pt-3 pb-2',
		},
	},
}
</script>

<style lang="scss" scoped>
.breadcrumb-container {
	padding: 0 32px;
	background: white;
	.ant-breadcrumb {
		:deep(.ant-breadcrumb-link) {
			text-transform: capitalize;
			cursor: pointer;
		}
	}
}
</style>
