<template>
	<a-layout id="kh-home-layout">
		<resource name="identities.common.portal.languages" :api-url="apiUrl" />
		<resource name="identities.common.portal.regions" :api-url="apiUrl" />
		<a-layout-content :style="{ background: '#fff', minHeight: '280px' }">
			<div class="kh-home-body">
				<h3 class="mb-4">
					{{ $t('app_portal.welcome_back') }}, {{ userInfo.firstName }}
					{{ $i18n.locale === 'ja' ? 'さん' : '' }}
				</h3>

				<div class="d-flex flex-wrap justify-content-end">
					<div class="d-flex align-items-center my-2">
						<span class="mx-2">{{ $t('app_portal.country') }}</span>

						<select-input
							style="width: 150px"
							reference="identities.common.portal.regions"
							:custom-query="`all=true&language=${filterObj.language}`"
							source="regionCode"
							source-label="regionName"
							:value="userInfo.countryCode"
							@change="onRegionChange"
						/>

						<span class="mx-2">{{ $t('app_portal.language') }}</span>

						<select-input
							style="width: 150px"
							reference="identities.common.portal.languages"
							source="languageCode"
							source-label="languageName"
							:value="defaultLangCode"
							@change="onLangChange"
						/>
					</div>
					<div class="d-flex my-2">
						<a-button type="primary" class="mx-2" @click="onClickComment">
							{{ $t('app_portal.general_comments') }}
						</a-button>

						<create-general-comments
							:visible.sync="visible"
							:user-info="userInfo"
						/>

						<a-button
							v-if="isPermissionConfig"
							type="primary"
							@click="openConfig('/config')"
						>
							<SettingOutlined />
							{{ $t('app_portal.configuration') }}
						</a-button>
					</div>
				</div>
				<div
					class="d-flex flex-wrap justify-content-between align-items-center w-100 mt-2"
				>
					<p class="mb-0">{{ $t('app_portal.select_application') }}:</p>
					<div class="d-flex align-items-center justify-content-end">
						<a-input-search
							v-model="appSearchTerm"
							:placeholder="$t('app_portal.search_application')"
							class="ml-2"
							style="width: 200px"
							@change="onSearch"
						/>
					</div>
				</div>

				<a-tabs class="kh-home-tabs" :active-key="tab" @change="onTabChange">
					<a-tab-pane
						v-for="(category, index) in Object.keys(appList)"
						:key="index"
						:tab="category.toUpperCase()"
					>
						<div class="tabs-content tab-all d-flex flex-wrap">
							<application-card
								v-for="app in appList[category]"
								:key="app.code"
								:app="app"
								@bookmark="onBookmarkChange($event, app)"
							/>
							<div
								v-if="appList[category].length === 0"
								class="d-flex flex-column w-100 align-items-center pt-4"
							>
								<InboxOutlined style="font-size: 40px" />
								<span class="pt-2">{{ $t('app_portal.no_applications') }}</span>
							</div>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
			<router-view />
		</a-layout-content>
	</a-layout>
</template>

<script>
import {
	AuthTypes,
	VIEW_PERMISSION,
	IDENTITY_ROLE,
	IDENTITY_USER,
	IDENTITY_APP_SETTINGS,
	IDENTITY_APP_GROUPS,
} from '@kraftheinz/common'

import ApplicationCard from '@/components/ApplicationCard'
import CreateGeneralComments from './UserManagement/GeneralComments/CreateGeneralComments'

const env = import.meta.env.VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL

export default {
	name: 'Home',

	components: {
		ApplicationCard,
		CreateGeneralComments,
	},

	metaInfo: {
		title: 'Home',
	},

	data() {
		return {
			apiUrl,
			list: [],
			appSearchTerm: '',
			// version: "",
			tab: 0,
			appGroups: [],
			visible: false,
			filterObj: {},
		}
	},

	computed: {
		appList() {
			const appList = this.list.map((item) => {
				const found =
					item.title.toLowerCase().includes(this.appSearchTerm.toLowerCase()) ||
					item.name.toLowerCase().includes(this.appSearchTerm.toLowerCase())

				let hasPermission = true,
					isShownOnCurrentEnv = true,
					isInactive = item.isInactive
				if (item.code == 'lv' || item.code == 'stcl') {
					item.env = ['dev', 'staging']
				}
				if (item.applicationId) {
					if (item.env) {
						isShownOnCurrentEnv = item.env.includes(env)
					} else {
						hasPermission = Object.keys(this.operations).some(
							(operation) => operation.split('.')[0] == item.code
						)
					}
				}

				return {
					...item,
					hidden: !found,
					disabled: !hasPermission || !isShownOnCurrentEnv || isInactive,
				}
			})

			const categorizedList = {}

			this.appGroups.forEach((category) => {
				if (category == this.$t('app_portal.my_favourites')) {
					categorizedList[category] = appList.filter((app) => app.appFavId)
					return
				}

				if (category == this.$t('app_portal.all')) {
					categorizedList[category] = appList
					return
				}

				categorizedList[category] = appList.filter(
					(app) => app.title == category
				)
			})

			return categorizedList
		},

		operations() {
			const { namespace, AUTH_GET_OPERATIONS } = AuthTypes
			return this.$store.getters[`${namespace}/${AUTH_GET_OPERATIONS}`]
		},

		userInfo() {
			const { namespace, AUTH_GET_USER } = AuthTypes
			return this.$store.getters[`${namespace}/${AUTH_GET_USER}`]
		},

		isPermissionConfig() {
			return (
				this.$can(VIEW_PERMISSION, IDENTITY_USER) ||
				this.$can(VIEW_PERMISSION, IDENTITY_ROLE) ||
				this.$can(VIEW_PERMISSION, IDENTITY_APP_SETTINGS) ||
				this.$can(VIEW_PERMISSION, IDENTITY_APP_GROUPS)
			)
		},

		defaultLangCode() {
			const langCode = localStorage.getItem('langCode')
			return langCode && langCode != 'null' ? langCode : 'en'
		},
	},

	watch: {
		userInfo(newVal) {
			this.onRegionChange(newVal.countryCode)
		},
	},

	created() {
		this.filterObj = {
			language: this.defaultLangCode,
			region: this.userInfo.countryCode,
		}
		this.$i18n.locale = this.defaultLangCode
		this.getAppList()
		this.getAppGroups()
		this.getListLang()
		// this.fetchVersion();
	},

	methods: {
		getAppList() {
			if (this.userInfo.id) {
				return this.axios
					.get(`${apiUrl}/identities/portal/${this.userInfo.id}`, {
						params: this.filterObj,
					})
					.then((res) => {
						this.list = [...res.data.results]
					})
			}
		},

		getAppGroups() {
			this.axios
				.get(`${this.apiUrl}/identities/portal/appgroups`, {
					params: { language: this.filterObj.language },
				})
				.then((res) => {
					this.appGroups = [
						this.$t('app_portal.my_favourites'),
						this.$t('app_portal.all'),
						...res.data.results.map((group) => group.name),
					]
				})
		},

		getListLang() {
			this.axios
				.get(`${this.apiUrl}/identities/common/portal/languages`)
				.then((res) => {
					this.listLang = res.data.results
				})
		},

		onBookmarkChange(value, app) {
			for (let i in this.list) {
				if (this.list[i].code == app.code) {
					this.list[i].userId = value
					break
				}
			}

			this.updateBookmark(value, app)
		},

		onClickComment() {
			this.visible = true
		},

		onRegionChange(value) {
			if (value !== 'all') this.filterObj.region = value
			else delete this.filterObj.region
			this.getAppList()
		},

		onLangChange(value) {
			this.filterObj.language = value
			this.$i18n.locale = value
			localStorage.setItem('langCode', value)
			this.getAppList()
			this.getAppGroups()
		},

		async updateBookmark(value, app) {
			if (value == 1) {
				await this.axios
					.post(`${this.apiUrl}/identities/portal/bookmark`, {
						UserId: this.userInfo.id,
						ExternalApplicationId: app.externalApplicationId,
						ApplicationId: app.applicationId,
						AppFavId: app.appFavId,
					})
					.then(() => {
						this.getAppList()
					})
			} else {
				await this.axios
					.delete(`${this.apiUrl}/identities/portal/bookmark/${app.appFavId}`)
					.then(() => {
						this.getAppList()
					})
			}
		},

		// async fetchVersion() {
		//   try {
		//     const { data } = await this.axios.get(
		//       `${apiUrl}/identities/release-notes`,
		//       {
		//         params: {
		//           page: 1,
		//           pageSize: 1,
		//         },
		//       }
		//     );

		//     this.version = data.results[0].versionNumber;
		//   } catch (err) {
		//     console.error(err);
		//   }
		// },

		onTabChange(key) {
			this.tab = key
		},

		onSearch() {
			this.tab = 1
		},

		openConfig(url) {
			this.$router.push(url)
		},

		showDesc(app) {
			this.$info({
				title: `${app.name}`,
				content: app.description ? `${app.description}` : 'No Description',
			})
		},
	},
}
</script>

<style lang="scss" scoped>
#kh-home-layout {
	height: 100%;

	.kh-home-body {
		padding: 40px 64px;

		h3 {
			font-weight: 600;
			font-size: 30px;
			line-height: 38px;
			color: #001d4d;
		}

		.kh-home-tabs {
			margin-top: 12px;
			overflow: visible;

			:deep(.ant-tabs-nav-wrap) {
				.ant-tabs-nav {
					.ant-tabs-tab {
						font-weight: bold;
						text-transform: uppercase;
						&:not(.ant-tabs-tab-active) {
							color: #92a0b0;
						}
					}
				}
			}

			.tabs-content {
				margin: 0 -12px;
			}
		}
	}
}
</style>
