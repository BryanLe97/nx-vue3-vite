<template>
	<div class="body">
		<portal to="sider-items">
			<div class="kh-application p-4">
				<p class="m-0">Configuration</p>
				<h5 class="mb-0">Application Settings</h5>
			</div>

			<a-menu
				:default-open-keys="openKeys"
				mode="inline"
				theme="light"
				:inline-collapsed="collapsed"
				:selected-keys="selectedKeys"
			>
				<template v-for="item in dataMenu">
					<template v-if="item.child.length === 0">
						<a-menu-item
							v-if="
								item.key === 'home' ||
								item.key === 'comments' ||
								$can(permissions.view, item.page)
							"
							:key="item.key"
							@click="clickItem($event)"
						>
							<router-link :to="item.path">
								<component :is="item.icon" />
								<span>{{ item.title }}</span>
							</router-link>

							<component :is="item.icon" />

							<span>{{ item.title }}</span>
						</a-menu-item>
					</template>

					<template v-if="item.child.length > 0">
						<a-sub-menu :key="item.key">
							<span slot="title">
								<component :is="item.icon" />
								<span>{{ item.title }}</span>
							</span>

							<a-menu-item
								v-for="itemChild in item.child"
								:key="itemChild.key"
								@click="clickItem($event)"
							>
								<router-link :to="itemChild.path">
									{{ itemChild.title }}
								</router-link>
							</a-menu-item>
						</a-sub-menu>
					</template>
				</template>
			</a-menu>
		</portal>
		<router-view />
	</div>
</template>

<script>
import {
	VIEW_PERMISSION,
	IDENTITY_USER,
	IDENTITY_ROLE,
	IDENTITY_APP_SETTINGS,
	IDENTITY_APP_GROUPS,
	PermissionCheckMixin,
} from '@kraftheinz/common'

export default {
	name: 'Configuration',
	mixins: [PermissionCheckMixin],

	data() {
		return {
			collapsed: false,
			permissions: {
				view: VIEW_PERMISSION,
			},
			dataMenu: [
				{
					title: 'Back to Main Menu',
					path: '/',
					key: 'home',
					icon: 'AppstoreOutlined',
					child: [],
				},
				{
					title: 'Manage Users',
					path: '/config/employees',
					key: 'employees',
					page: IDENTITY_USER,
					icon: 'UserOutlined',
					child: [],
				},
				{
					title: 'Manage Roles',
					path: '/config/roles',
					key: 'roles',
					page: IDENTITY_ROLE,
					icon: 'SafetyCertificateOutlined',
					child: [],
				},
				{
					title: 'Application Settings',
					path: '/config/settings',
					key: 'settings',
					page: IDENTITY_APP_SETTINGS,
					icon: 'ToolOutlined',
					child: [],
				},
				{
					title: 'Application Groups',
					path: '/config/application-groups',
					key: 'groups',
					page: IDENTITY_APP_GROUPS,
					icon: 'folder-open',
					child: [],
				},
				{
					title: 'General Comments',
					path: '/config/general-comments',
					key: 'comments',
					icon: 'form',
					child: [],
				},
				{
					title: 'Reports',
					path: '',
					key: 'reports',
					icon: 'file-text',
					child: [
						{
							title: 'Role & Permission',
							path: '/config/role-permission',
							key: 'role-permission',
							child: [],
						},
						{
							title: 'Site Visitor Count',
							path: '/config/site-visitors',
							key: 'site-visitors',
							child: [],
						},
					],
				},
			],
			selectedKeys: [],
			openKeys: [],
			rootSubmenuKeys: [],
		}
	},

	metaInfo: {
		title: 'Configuration',
	},

	beforeRouteEnter(to, from, next) {
		if (to.name == 'Configuration') {
			next({ name: 'ListEmployee' })
		}

		next()
	},

	created() {
		this.updateMenu()
	},

	methods: {
		updateMenu: function () {
			let path = this.$route.matched[1].path

			this.openKeys =
				typeof this.$route.matched[1].meta == 'string'
					? [this.$route.matched[1].meta]
					: null

			let title = path.substring(path.lastIndexOf('/') + 1)
			this.selectedKeys = [title]
		},

		clickItem: function (e) {
			this.selectedKeys = [e.key]
		},
	},
}
</script>
<style lang="scss" scoped>
.sidebar-container {
	.ant-menu,
	.ant-menu-submenu > :deep(.ant-menu) {
		border: none;
	}

	.ant-menu-submenu {
		& > :deep(.ant-menu-inline.ant-menu-sub) {
			position: relative;
		}
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
		height: 56px;
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
	// background-image: url("../assets/specifications.png");
	* {
		width: 100%;
		overflow: hidden;
		transition: width 0.2s;
	}
}
</style>
