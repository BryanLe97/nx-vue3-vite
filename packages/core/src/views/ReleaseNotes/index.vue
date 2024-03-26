<template>
	<div class="body">
		<portal to="sider-items">
			<div class="kh-application p-4">
				<p class="m-0 text-uppercase">release notes</p>
				<h5 class="mb-0 text-capitalize">release notes</h5>
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
						<a-menu-item :key="item.key" @click="clickItem($event)">
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
export default {
	name: 'ReleaseNotes',

	data() {
		return {
			apiUrl: import.meta.env.VITE_API_URL,
			collapsed: false,
			dataMenu: [
				{
					title: 'Back to Main Menu',
					path: '/',
					key: 'home',
					icon: 'AppstoreOutlined',
					child: [],
				},
				{
					title: 'Changelog',
					path: '/release-notes/changelog',
					key: 'changelog',
					icon: 'FileOutlined',
					child: [],
				},
			],
			selectedKeys: [],
			openKeys: [],
			rootSubmenuKeys: [],
		}
	},

	metaInfo: {
		title: 'Release Notes',
	},

	beforeRouteEnter(to, from, next) {
		if (to.name == 'ReleaseNotes') {
			next({ name: 'ListChangelog' })
		}

		next()
	},

	created() {
		this.updateMenu()
	},

	methods: {
		updateMenu: function () {
			if (!this.$route.matched[1]) return

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

	.ant-menu-inline {
		max-height: 80vh;
		overflow-x: hidden;
		overflow-y: overlay;
		scrollbar-width: thin;
		scrollbar-color: #babac0;

		&::-webkit-scrollbar {
			background-color: transparent;
		}
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
		text-transform: uppercase;
		white-space: nowrap;
	}

	h5 {
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
		text-transform: capitalize;
		white-space: nowrap;
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
