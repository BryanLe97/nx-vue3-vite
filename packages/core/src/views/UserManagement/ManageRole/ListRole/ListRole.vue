<template>
	<div class="list-roles">
		<div class="d-flex mb-3">
			<h3>Roles</h3>
			<div class="ml-auto">
				<a-select
					:loading="applicationsLoading"
					style="width: 200px"
					default-value
					@change="onSelectApplication"
				>
					<a-select-option value>All Applications</a-select-option>
					<a-select-option
						v-for="app in applications"
						:key="app.entityId"
						:value="app.app"
						>{{ app.appName }}</a-select-option
					>
				</a-select>
				<a-button
					v-if="can(MAINTAIN_PERMISSION)"
					class="ml-3"
					type="primary"
					@click="addNewRole()"
					>Add New Role</a-button
				>
			</div>
		</div>

		<div class="table-wrapper">
			<a-table
				:columns="columns"
				:data-source="roles"
				row-key="id"
				bordered
				:loading="rolesLoading"
				:row-selection="rowSelection"
				:pagination="false"
				:scroll="{ x: true, y: 'calc(100vh - 350px)' }"
			>
				<div slot="name" slot-scope="text, record">
					<span :class="!record.isActive ? 'inactive' : ''">{{ text }}</span>
				</div>
				<div slot="appName" slot-scope="text, record">
					<span :class="!record.isActive ? 'inactive' : ''">{{ text }}</span>
				</div>
				<a
					slot="action"
					slot-scope="text, record"
					:class="!record.isActive ? 'inactive' : ''"
				>
					<a-tooltip v-if="can(MAINTAIN_PERMISSION)">
						<template #title>
							{{ !record.isActive ? 'Activate' : 'Deactivate' }}
						</template>
						<a-button
							class="list__action-toggle-active"
							:icon="!record.isActive ? 'eye-invisible' : 'eye'"
							size="small"
							type="link"
							@click="toggleRole(record, () => getRoles(false))"
						/>
					</a-tooltip>
					<a-tooltip :destroy-tooltip-on-hide="true">
						<template #title>View</template>

						<a-button
							icon="right-circle"
							size="small"
							type="link"
							@click="onSelectRole(record)"
						/>
					</a-tooltip>
				</a>
			</a-table>
		</div>

		<!-- Modal -->
		<a-modal
			v-model="modalVisible"
			title="Add New Role"
			centered
			:mask-closable="true"
			:on-ok="onSubmit"
		>
			<template slot="footer">
				<a-button key="back" @click="() => (modalVisible = false)"
					>Cancel</a-button
				>
				<a-button
					key="submit"
					type="primary"
					:loading="isSubmitting"
					@click="onSubmit"
					>Add</a-button
				>
			</template>
			<a-form :form="form" @submit="onSubmit">
				<a-row :gutter="24" type="flex">
					<a-col :md="24">
						<a-form-item label="Role Name">
							<a-input
								v-decorator="[
									'roleName',
									{
										rules: [
											{ required: true, message: errorMsg.roleNameRequired },
										],
										initialValue: '',
									},
								]"
								@change="($event) => (roleData.name = $event.target.value)"
							/>
						</a-form-item>
					</a-col>

					<a-col :md="24">
						<label>Application</label>

						<a-select
							:loading="applicationsLoading"
							class="mt-1"
							style="width: 100%"
							:value="roleData.entityContext"
							@change="(val) => (roleData.entityContext = val)"
						>
							<a-select-option
								v-for="app in applications"
								:key="app.entityId"
								:value="app.entityId"
								>{{ app.appName }}</a-select-option
							>
						</a-select>
					</a-col>
				</a-row>
			</a-form>
		</a-modal>
		<!-- End Modal -->
	</div>
</template>

<script>
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'
const apiUrl = import.meta.env.VITE_API_URL

const APPLICATIONS_ENDPOINT_URL = `${apiUrl}/identities/applications/contexts?entityLevel=company`
const ROLES_ENDPOINT_URL = `${apiUrl}/identities/roles?entityContext=0`
const ADD_ROLE_ENDPOINT_URL = `${apiUrl}/identities/roles/?entityContext=$entityContext`

export default {
	name: 'ListRole',

	inject: ['toggleRole', 'selectedRoleId', 'can'],

	data() {
		const columns = [
			{
				title: 'Role Name',
				dataIndex: 'name',
				key: 'name',
				scopedSlots: { customRender: 'name' },
			},
			{
				title: 'Application',
				dataIndex: 'appName',
				key: 'appName',
				scopedSlots: { customRender: 'appName' },
			},
			{
				title: 'Action',
				dataIndex: 'action',
				key: 'action',
				scopedSlots: { customRender: 'action' },
				align: 'center',
			},
		]

		const rowSelection = {
			selectedRowKeys: [],
			type: 'radio',
		}

		const errorMsg = {
			roleNameRequired: 'Role name is required.',
		}

		return {
			columns,

			roles: [],
			rolesLoading: false,

			modalVisible: false,

			applications: [],
			applicationsLoading: false,

			selectedApp: '',
			rowSelection,

			errorMsg,
			form: this.$form.createForm(this, { name: 'roleInfo' }),
			isSubmitting: false,

			roleData: {
				entityContext: '',
				name: '',
			},

			timeout: null,
			MAINTAIN_PERMISSION,
		}
	},

	mounted() {
		this.getApplications()
		this.getRoles()
	},

	methods: {
		addNewRole() {
			this.roleData = {
				entityContext: '',
				name: '',
			}
			this.form.resetFields()
			this.modalVisible = true
		},

		getApplications() {
			this.applicationsLoading = true

			this.axios
				.get(APPLICATIONS_ENDPOINT_URL)
				.then((res) => {
					this.applications = res.data || []

					this.roleData.entityContext = this.applications[0].entityId
				})
				.finally(() => (this.applicationsLoading = false))
		},

		onSelectApplication(app) {
			this.selectedApp = app
			this.getRoles()
		},

		onSelectRole(row) {
			this.rowSelection.selectedRowKeys = [row.id]

			this.$emit('role-selected', JSON.stringify(row))
		},

		getRoles(isSelectDefaultFirstItem = true) {
			const selectDefaultFirstItem = () => {
				this.rowSelection.selectedRowKeys = [this.roles[0].id]

				this.$emit('role-selected', JSON.stringify(this.roles[0]))
			}

			this.rolesLoading = true

			this.axios
				.get(ROLES_ENDPOINT_URL, {
					params: { app: this.selectedApp },
				})
				.then((res) => {
					this.roles = res.data && res.data.results ? res.data.results : []

					this.roles = this.roles.sort((item1, item2) => {
						return item2.isActive - item1.isActive
					})

					/**
					 * If Something gets updated in the role details side => re-select the selected row; if not, select first item as default after fetching the list.
					 */
					if (this.selectedRoleId) {
						this.rowSelection.selectedRowKeys = [this.selectedRoleId]
					} else {
						isSelectDefaultFirstItem && selectDefaultFirstItem()
					}
				})
				.finally(() => (this.rolesLoading = false))
		},

		onSubmit(e) {
			e.preventDefault()

			this.form.validateFields((err) => {
				if (!err) {
					this.isSubmitting = true

					const { entityContext, name } = this.roleData

					this.axios
						.post(
							ADD_ROLE_ENDPOINT_URL.replace('$entityContext', entityContext),
							{ name: name[0].toUpperCase() + name.slice(1) }
						)
						.then(() => {
							this.getRoles(false)
							this.modalVisible = false
						})
						.catch((err) => this.showErrorMsg(err))
						.finally(() => (this.isSubmitting = false))
				}
			})
		},

		showErrorMsg(err) {
			this.$notification['error']({
				message: err.response.data.message || 'Errors encountered!',
			})
		},
	},
}
</script>

<style lang="scss" scoped>
$activeColor: #0062ff;

.list-roles {
	:deep(.ant-table-row-selected) {
		& > td {
			background-color: #7cacf8 !important;
			color: #fff !important;
			font-weight: bold;

			.ant-btn-link,
			a {
				color: #fff !important;
				font-weight: bold;
			}

			.inactive,
			.inactive > .ant-btn-link {
				color: inherit;
			}
		}
	}

	:deep(tbody > tr > td:first-child, thead tr > th:first-child) {
		display: none;
	}

	:deep(tbody > tr > td:nth-child(2), thead tr > th:nth-child(2)) {
		width: 50%;
	}

	:deep(tbody > tr > td:last-child, thead tr > th:last-child) {
		width: 15%;
	}

	:deep(a) {
		color: #272d35;
	}

	:deep(.inactive, .inactive > .ant-btn-link) {
		color: #afb9c5;
	}

	.table-wrapper {
		height: calc(100vh - 270px);

		:deep(.ant-table-bordered .ant-table-thead > tr > th) {
			border: none;
			border-right: 1px solid #cdd3db;
		}
		:deep(.ant-table td) {
			white-space: nowrap;
		}

		:deep(.ant-table-hide-scrollbar) {
			margin-bottom: 0 !important;
			overflow: hidden !important;
			padding-right: 8px;
			background: #eaedf0;
			border: 1px solid #cdd3db;

			.ant-table-thead {
				tr {
					th {
						&:last-child {
							border-right-color: transparent !important;
						}
					}
				}
			}
		}
	}
}
</style>
