<template>
	<list-composer
		title="Application Groups"
		create-button-text="Add Group"
		search-by="Name"
		ph-search-by="Search by Name, Description"
		:has-active="false"
		:has-filter-inactive="false"
	>
		<text-field
			title="Group Name"
			data-index="name"
			:sorter="true"
			:width="250"
		/>
		<text-field
			title="Group Description"
			data-index="description"
			:ellipsis="true"
		/>
		<template #action="{ edit, record }">
			<a-tooltip v-if="can(permissions.maintain)">
				<template #title>Delete</template>

				<a-button
					class="list__action-toggle-active mr-2"
					size="small"
					type="link"
					@click="onDelete(record)"
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
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'
export default {
	name: 'ApplicationGroups',

	inject: ['apiUrl', 'crud', 'can'],

	data() {
		return {
			permissions: {
				maintain: MAINTAIN_PERMISSION,
			},
		}
	},

	methods: {
		onDelete(record) {
			this.$confirm({
				class: 'list__modal-delete',
				icon: 'delete',
				title: `Do you want to delete this Group?`,
				cancelText: 'No',
				okText: 'Delete',
				okType: 'danger',
				onOk: this.onConfirmDelete(record),
			})
		},

		onConfirmDelete(record) {
			return () => {
				this.axios
					.delete(
						`${this.apiUrl}/identities/configuration/appgroups/${record.id}`
					)
					.then(
						() => {
							this.crud.fetchList()
							this.$notification['success']({
								message: 'Item Deleted!',
							})
						},
						(err) => {
							this.$notification['error']({
								message:
									err.response.data.message ||
									'Something went wrong, please try again',
							})
						}
					)
			}
		},
	},
}
</script>

<style></style>
