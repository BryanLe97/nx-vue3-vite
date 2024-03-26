<template>
	<div class="list-user-roles">
		<div class="d-flex mb-3">
			<h3>Roles</h3>
			<a-button
				v-if="can(MAINTAIN_PERMISSION)"
				class="ml-auto"
				type="primary"
				@click="() => (modalVisible = true)"
				>Assign Role</a-button
			>
		</div>
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="userRoles"
			:row-key="(record) => record.id + record.entityId + record.code + ''"
			:row-selection="rowSelection"
		>
			<div slot="name" slot-scope="text, record">
				<span :class="!record.isActive ? 'inactive' : ''">
					{{ text }}
					{{ record.appName ? '(' + record.appName + ')' : '' }}
				</span>
			</div>
			<div slot="entityLevelName" slot-scope="text, record">
				<div :class="!record.isActive ? 'inactive' : ''">
					<u-m-badge :type="record.entityLevel" :text="text" />
				</div>
			</div>
			<a
				slot="action"
				slot-scope="text, record"
				:class="!record.isActive ? 'inactive' : ''"
			>
				<a-tooltip v-if="can(MAINTAIN_PERMISSION)">
					<template #title>{{
						!record.isActive ? 'Activate' : 'Deactivate'
					}}</template>
					<a-button
						class="list__action-toggle-active"
						:icon="!record.isActive ? 'eye-invisible' : 'eye'"
						size="small"
						type="link"
						@click="
							toggleRole(record, () =>
								getUserRoles(false).then(() => {
									record.isActive = !record.isActive
									onSelectRole(record)
								})
							)
						"
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

		<!-- Modal -->
		<a-modal
			v-model="modalVisible"
			title="Assign Role"
			centered
			:mask-closable="false"
			:after-close="() => (roleAssignObj.role = JSON.stringify(roles[0]))"
			@ok="() => (modalVisible = false)"
		>
			<template slot="footer">
				<a-button key="back" @click="() => (modalVisible = false)"
					>Cancel</a-button
				>
				<a-button
					key="submit"
					type="primary"
					:loading="isSubmitting"
					:disabled="
						!roleAssignObj.role ||
						!roleAssignObj.entityLevelCode ||
						!roleAssignObj.entityId
					"
					@click="assignRole"
					>Assign</a-button
				>
			</template>

			<a-row :gutter="24" type="flex">
				<a-col :md="24" class="mb-3">
					<select-input
						label="Application"
						:data-source="applications"
						source="app"
						source-label="appName"
						default-active-first-option
						@change="onApplicationChange"
					/>
				</a-col>
				<a-col :md="24" class="mb-3">
					<label>Role</label>
					<a-select
						:value="roleAssignObj.role"
						style="width: 100%"
						@change="(val) => onRoleAssignChange('role', val)"
					>
						<a-select-option
							v-for="role in roles"
							:key="role.id"
							:value="JSON.stringify(role)"
						>
							{{ role.name }}
							{{ role.appName ? '(' + role.appName + ')' : '' }}
						</a-select-option>
					</a-select>
				</a-col>
				<a-col :md="10">
					<label>Entity Level</label>

					<a-select
						:value="roleAssignObj.entityLevelCode"
						style="width: 100%"
						@change="(val) => onRoleAssignChange('entityLevelCode', val)"
					>
						<a-select-option
							v-for="entity in entities"
							:key="entity.entityLevelCode"
							:value="entity.entityLevelCode"
							>{{ entity.entityLevel }}</a-select-option
						>
					</a-select>
				</a-col>
				<a-col :md="14">
					<label>Site</label>

					<a-select
						:value="roleAssignObj.entityId"
						style="width: 100%"
						@change="(val) => onRoleAssignChange('entityId', val)"
					>
						<a-select-option
							v-for="site in sites"
							:key="site.entityId"
							:value="site.entityId"
							>{{ site.entityLevelName }}</a-select-option
						>
					</a-select>
				</a-col>
			</a-row>
		</a-modal>
		<!-- End Modal -->
	</div>
</template>

<script>
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'
import UMBadge from '../../Common/UMBadge'
const apiUrl = import.meta.env.VITE_API_URL

const USER_ROLES_ENDPOINT_URL = `${apiUrl}/identities/users/$userId/roles/?entityContext=0`
const ROLES_ENDPOINT_URL = `${apiUrl}/identities/roles/?entityContext=0`
const ENTITY_LEVELS_ENDPOINT_URL = `${apiUrl}/identities/common/entities/levels`
const SITES_ENDPOINT_URL = `${apiUrl}/identities/applications/contexts?entityLevel=$entityLevel&app=$app`
const ASSIGN_ROLE_ENDPOINT_URL = `${apiUrl}/identities/users/$userId/rights/?entityContext=$entityId`
const APPLICATIONS_ENDPOINT_URL = `${apiUrl}/identities/applications/contexts?entityLevel=company`

export default {
	name: 'UserRolesTable',
	inject: ['can'],

	components: {
		UMBadge,
	},

	props: {
		toggleRole: {
			type: Function,
			required: true,
		},
		selectedRoleId: {
			type: [Number, String],
			default: '',
		},
	},

	data() {
		const columns = [
			{
				title: 'Role Name',
				dataIndex: 'name',
				key: 'name',
				scopedSlots: { customRender: 'name' },
			},
			{
				title: 'Entity Levels',
				dataIndex: 'entityLevelName',
				key: 'entityLevelName',
				scopedSlots: { customRender: 'entityLevelName' },
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

		return {
			columns,
			userRoles: [],
			modalVisible: false,
			rowSelection,
			userId: '',

			/** Modal options */
			roles: [],
			entities: [],
			sites: [],
			applications: [],

			roleAssignObj: {
				role: {},
				entityLevelCode: '',
				entityId: null,
			},

			isSubmitting: false,
			MAINTAIN_PERMISSION,
		}
	},

	mounted() {
		this.userId = this.$route.params.id

		this.getApplications()

		this.getUserRoles()
		this.loadModalOptions()
	},

	methods: {
		onSelectRole(row) {
			this.rowSelection.selectedRowKeys = [
				row.id + row.entityId + row.code + '',
			]

			this.$emit('role-selected', JSON.stringify(row))
		},

		showErrorMsg(err) {
			this.$notification['error']({
				message:
					this._.get(err, 'response.data.message') || 'Errors encountered',
			})
		},

		getApplications() {
			this.axios.get(APPLICATIONS_ENDPOINT_URL).then((res) => {
				this.applications = res.data || []
			})
		},

		onApplicationChange(value) {
			this.loadModalOptions(value)
		},

		getUserRoles(isSelectDefaultFirstItem = true) {
			return new Promise((resolve, reject) => {
				const selectDefaultFirstItem = () => {
					try {
						this.rowSelection.selectedRowKeys = [
							this.userRoles[0].id +
								this.userRoles[0].entityId +
								this.userRoles[0].code +
								'',
						]

						this.$emit('role-selected', JSON.stringify(this.userRoles[0]))
					} catch (e) {}
				}

				this.rolesLoading = true

				this.axios
					.get(USER_ROLES_ENDPOINT_URL.replace('$userId', this.userId))
					.then(
						(res) => {
							this.userRoles =
								res.data && res.data.results ? res.data.results : []

							this.userRoles = this.userRoles.sort((item1, item2) => {
								return item2.isActive - item1.isActive
							})

							/**
							 * If Something gets updated in the role details side => re-select the selected row, If not, select first item as default after fetching the list.
							 */
							if (this.selectedRoleId) {
								const exist = this.userRoles.find(
									(item) =>
										item.id + item.entityId + item.code + '' ===
										this.selectedRoleId
								)

								if (exist) {
									this.rowSelection.selectedRowKeys = [this.selectedRoleId]
								} else {
									selectDefaultFirstItem()
								}
							} else {
								isSelectDefaultFirstItem && selectDefaultFirstItem()
							}

							resolve()
						},
						(err) => reject()
					)
					.finally(() => {
						this.rolesLoading = false
					})
			})
		},

		assignRole() {
			const { code } = JSON.parse(this.roleAssignObj.role)
			const data = {
				type: 'enable',
				roleCode: code,
			}

			this.isSubmitting = true

			this.axios
				.put(
					ASSIGN_ROLE_ENDPOINT_URL.replace('$userId', this.userId).replace(
						'$entityId',
						this.roleAssignObj.entityId
					),
					data
				)
				.then(() => {
					this.getUserRoles()
					this.modalVisible = false

					this.$notification['success']({
						message: 'Success!',
					})
				})
				.catch((err) => this.showErrorMsg(err))
				.finally(() => (this.isSubmitting = false))
		},

		loadModalOptions(application = '') {
			Promise.all([
				this.axios.get(
					application
						? ROLES_ENDPOINT_URL + `&app=` + application
						: ROLES_ENDPOINT_URL
				),
				this.axios.get(ENTITY_LEVELS_ENDPOINT_URL),
			]).then((res) => {
				const [rolesRes, entityRes] = res

				this.roles = (rolesRes && rolesRes.data && rolesRes.data.results) || []

				this.roles = this.roles.sort((item1, item2) => {
					return item1.name[0].toLowerCase() > item2.name[0].toLowerCase()
						? 1
						: -1
				})

				this.entities = (entityRes && entityRes.data) || []

				this.roleAssignObj.role = JSON.stringify(this.roles[0])
				this.roleAssignObj.entityLevelCode = this.entities[0].entityLevelCode

				if (this.roleAssignObj.role && this.roleAssignObj.entityLevelCode) {
					this.loadSiteOptions()
				}
			})
		},

		loadSiteOptions() {
			const { app } = JSON.parse(this.roleAssignObj.role)

			this.axios
				.get(
					SITES_ENDPOINT_URL.replace(
						'$entityLevel',
						this.roleAssignObj.entityLevelCode
					).replace('$app', app)
				)
				.then((res) => {
					this.sites = (res && res.data) || []

					this.roleAssignObj.entityId =
						(this.sites[0] && this.sites[0].entityId) || null
				})
		},

		onRoleAssignChange(type, value) {
			this.roleAssignObj[type] = value

			if (type !== 'entityId') {
				this.loadSiteOptions()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
$activeColor: #0062ff;

.list-user-roles {
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

	:deep(thead tr > th, tbody > tr > td) {
		border: 1px solid #cdd3db;
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

		overflow-y: auto;
	}
}
</style>
