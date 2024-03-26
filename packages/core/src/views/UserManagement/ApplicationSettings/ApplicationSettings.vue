<template>
	<list-composer
		title="Application Settings"
		create-button-text="Add External App"
		search-by="Name"
		ph-search-by="Search by Application Name"
		:actions-width="100"
	>
		<template #customFilter>
			<select-input
				:data-source="applicationGroups"
				source="name"
				:style="{ width: '200px' }"
				placeholder="Application Group"
				default-active-first-option
				@change="onAppGroupChange"
			/>
		</template>
		<url-field
			key="Name"
			base-url="/config/settings"
			data-index="name"
			id-prop-name="code"
			title="Application Name"
			:clickable="false"
			:width="175"
			:sorter="true"
		/>
		<tag-field
			key="AppType"
			data-index="appType"
			:color="getAppTypeColor"
			:width="76"
			title="Type"
		/>
		<text-field
			key="ApplicationGroup"
			data-index="applicationGroup"
			title="Application Group"
			:width="175"
			:sorter="true"
		/>
		<text-field
			key="CInumber"
			data-index="cInumber"
			title="CI Number"
			:width="85"
		/>
		<text-field
			key="Description"
			data-index="description"
			title="Description"
			:sorter="true"
			:ellipsis="true"
		/>
		<text-field
			key="LaunchUrl"
			data-index="launchUrl"
			title="Production URL"
			:sorter="true"
			:ellipsis="true"
		/>
		<text-field
			key="TestUrl"
			data-index="testUrl"
			title="Test URL"
			:sorter="true"
			:ellipsis="true"
		/>

		<template #action="{ edit, record }">
			<a-tooltip v-if="can(permissions.maintain)">
				<template #title>{{
					record.isInactive ? 'Activate' : 'Deactivate'
				}}</template>

				<a-button
					class="list__action-toggle-active"
					size="small"
					type="link"
					@click="toggleAppStatus(record)"
				>
					<EyeInvisibleOutlined v-if="record.isInactive" />
					<EyeOutlined v-else />
				</a-button>
			</a-tooltip>

			<a-tooltip v-if="can(permissions.maintain)">
				<template #title>Delete</template>
				<a-button
					class="mx-1"
					size="small"
					type="link"
					:disabled="record.isInactive"
					@click="onDeleteApp(record)"
				>
					<DeleteOutlined />
				</a-button>
			</a-tooltip>

			<a-tooltip v-if="can(permissions.maintain)">
				<template #title>Edit</template>
				<a-button
					size="small"
					type="link"
					:disabled="record.isInactive"
					@click="edit(record)"
				>
					<EditOutlined />
				</a-button>
			</a-tooltip>
		</template>
	</list-composer>
</template>

<script>
import { APP_TYPE_COLOR } from '../../../constants'
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'
export default {
	name: 'ApplicationSettings',

	inject: ['crud', 'apiUrl', 'resourceName', 'can'],

	data() {
		return {
			permissions: {
				maintain: MAINTAIN_PERMISSION,
			},
			applicationGroups: [],
		}
	},

	mounted() {
		this.getApplicationGroup()
	},

	methods: {
		toggleAppStatus(record) {
			let icon, okType, title

			if (record.isInactive) {
				title = 'Do you want to Activate this item?'
				icon = 'eye'
				okType = 'primary'
			} else {
				title = 'Do you want to Deactivate this item?'
				icon = 'eye-invisible'
				okType = 'danger'
			}

			this.$confirm({
				class: 'list__modal-confirm',
				icon,
				title,
				cancelText: 'No',
				okText: 'Yes',
				okType,
				onOk: this.toggleActive(record),
			})
		},

		getAppTypeColor(value) {
			return APP_TYPE_COLOR[value]
		},

		toggleActive(record) {
			return () =>
				this.crud
					.submitPartialEntity({
						resourceName: this.resourceName,
						customUrl: `${this.apiUrl}/identities/configuration/appsettings/${record.code}/${record.externalApplicationId}`,
						data: [
							{
								op: 'replace',
								path: '/IsInactive',
								value: !record.isInactive,
							},
						],
					})
					.then(() => this.crud.fetchList())
		},

		onDeleteApp(record) {
			let icon, okType, title
			title = 'Do you want to Delete this item?'
			icon = 'warning'
			okType = 'danger'
			this.$confirm({
				class: 'list__modal-confirm',
				icon,
				title,
				cancelText: 'No',
				okText: 'Yes',
				okType,
				onOk: this.deleteApp(record),
			})
		},

		deleteApp(record) {
			const customDelUrl = `${this.apiUrl}/identities/configuration/appsettings/${record.externalApplicationId}`
			return () =>
				this.crud
					.destroyEntity(customDelUrl, record.externalApplicationId)
					.then(() => {
						this.visible = false
						this.crud.fetchList()
					})
					.catch((error) => console.log(error))
		},

		async getApplicationGroup() {
			const { data } = await this.axios.get(
				`${this.apiUrl}/identities/configuration/appgroups`
			)
			this.applicationGroups = [{ name: 'All Groups' }, ...data.results]
		},

		onAppGroupChange(value) {
			if (value === 'All Groups') {
				this.crud.deleteFilter('ApplicationGroup')
				this.crud.fetchList()
				return
			}
			this.crud.setFilter('ApplicationGroup', {
				operator: 'Contains',
				value,
			})
			this.crud.fetchList()
		},
	},
}
</script>

<style></style>
