<template>
	<div class="add-employee">
		<bread-crumb :items="itemsMenu" />
		<div class="px-2">
			<a-row class="header mb-2 px-5" :gutter="16" type="flex">
				<a-col class="d-flex align-items-center flex-wrap p-0" :span="20">
					<ArrowLeftOutlined class="arrow-left mr-3" @click="onBack()" />
					<span class="mr-3 header-title">Create User</span>
				</a-col>
			</a-row>
		</div>
		<a-tabs class="kh-tabs" default-active-key="1">
			<a-tab-pane key="1" class="p-5" tab="General Information">
				<general-info />
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import GeneralInfo from '../EmployeeGeneralInfo'

export default {
	name: 'CreateEmployee',

	components: {
		GeneralInfo,
	},

	data() {
		return {
			itemsMenu: [
				{
					key: 'configuration',
					title: 'Configuration',
					path: '',
				},
				{
					key: 'employee',
					title: 'Employee',
					path: '/config/employee',
				},
			],
			GeneralInfo,
		}
	},

	methods: {
		onBack() {
			this.$router.push('/config/employees')
		},
	},
}
</script>

<style lang="scss" scoped>
.add-employee {
	background-color: white;

	& > .kh-tabs {
		margin-bottom: 0;

		& > :deep(.ant-tabs-content) {
			background: #f6f6fa;

			& > .ant-tabs-tabpane {
				background: #f6f6fa;
			}
		}
	}
	.header {
		min-height: 32px;
		.header-title {
			font-style: normal;
			font-weight: 500;
			font-size: 20px;
			line-height: 28px;
		}
	}

	.arrow-left {
		font-size: 18px;
	}
	.card {
		background: #ffffff;
		border: 1px solid #eaedf0;
	}
}
</style>
