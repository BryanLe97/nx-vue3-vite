<template>
	<a-layout-sider
		id="sider-items"
		class="sidebar-container"
		collapsed-width="56"
		width="248"
		collapsible
		:trigger="null"
		:value="isCollapsed"
	>
		<div class="sidebar-header px-4 py-3">
			<div class="h-100 d-flex align-items-center justify-content-between">
				<div class="logo-container">
					<img src="../assets/logo.png" />
				</div>
				<MenuUnfoldOutlined
					v-if="(isCollapsed = 'menu-unfold')"
					class="trigger"
					@click="onTriggerChange"
				/>
				<MenuFoldOutlined v-else class="trigger" @click="onTriggerChange" />
			</div>

			<div
				class="mt-2 neutral-8--text"
				:style="{ display: isCollapsed ? 'none' : 'block' }"
			>
				(ver {{ version }})
			</div>
		</div>
	</a-layout-sider>
</template>

<script>
export default {
	name: 'Sider',

	props: {
		version: {
			type: String,
			default: '',
		},

		isCollapsed: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			collapsed: false,
		}
	},

	methods: {
		onTriggerChange() {
			this.collapsed = !this.isCollapsed
			this.$emit('triggerChange', this.collapsed)
		},
	},
}
</script>

<style lang="scss" scoped>
.sidebar-container {
	:deep(.ant-menu) {
		padding-right: 1px;
	}

	.ant-menu,
	.ant-menu-submenu > :deep(.ant-menu) {
		border: none;
	}

	.ant-menu-submenu :deep(.ant-menu-inline.ant-menu-sub) {
		position: relative;
	}

	&.ant-layout-sider-collapsed {
		.sidebar-header {
			justify-content: center;

			.logo-container {
				width: 0;
			}
		}

		.kh-application * {
			width: 0;
		}
	}

	.sidebar-header {
		box-shadow: inset 0px -1px 0px #eaedf0, inset -1px 0px 0px #eaedf0;
		background-color: #ffffff;
		justify-content: space-around;
		background: #f9fafb;

		.logo-container {
			width: auto;
			overflow: hidden;
			transition: width 0.2s;
		}
	}

	/* Temp css */
	p {
		font-weight: bold;
		font-size: 14px;
		color: #99c0ff;
	}

	h5 {
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
	}

	/* end temp css */
}

.trigger {
	font-size: 18px;
	cursor: pointer;
	transition: color 0.3s;

	&:hover {
		color: #1890ff;
	}
}

.logo {
	height: 32px;
	background: rgba(255, 255, 255, 0.2);
}

.kh-application {
	height: 97px;

	* {
		width: 100%;
		overflow: hidden;
		transition: width 0.2s;
	}
}
</style>
