<template>
	<div class="manage-roles">
		<bread-crumb custom-padding="pt-3 pl-5" :items="itemsMenu" />
		<h2 class="pl-5 pt-3 pb-4">Manage Roles</h2>
		<a-row :gutter="24" class="p-4" type="flex">
			<a-col class="roles" :md="24" :lg="10">
				<list-role
					:key="keyListRole"
					:toggle-role="toggleRole"
					:selected-role-id="selectedRoleId"
					@role-selected="onRoleSelected"
				/>
			</a-col>
			<a-col
				v-if="roleDetails.code"
				class="role-details pt-3"
				:md="24"
				:lg="14"
			>
				<div class="d-flex">
					<h3>{{ roleDetails.name }}</h3>

					<div
						v-if="
							!roleDetails.isLock && $can(MAINTAIN_PERMISSION, IDENTITY_ROLE)
						"
						class="ml-auto"
					>
						<a-popconfirm
							placement="bottomRight"
							ok-text="Yes"
							ok-type="danger"
							cancel-text="No"
							@confirm="deleteRole(roleDetails.code)"
						>
							<template slot="title">
								<p>Are you sure you want to delete this role?</p>
							</template>
							<a-button type="danger" ghost>Delete</a-button>
						</a-popconfirm>

						<a-switch
							:checked="roleDetails.isActive"
							class="ml-3"
							@change="toggleRole(roleDetails, roleToggleCallback)"
						/>
					</div>
				</div>

				<a-row :gutter="24" class="entity-details mt-3" type="flex">
					<a-col :md="6">
						Application
						<p>{{ roleDetails.appName }}</p>
					</a-col>
				</a-row>

				<a-tabs>
					<a-tab-pane key="1" tab="Permissions">
						<section class="permissions">
							<h4 class="mt-3">
								<LoadingOutlined v-if="permissionsLoading" slot="indicator" />
							</h4>
							<div class="wrapper">
								<div v-for="(p, i) in permissions" :key="p.key">
									<div class="d-flex permission-wrapper align-items-center">
										<RightOutlined
											v-if="
												expandingObj[p.code] &&
												!expandingObj[p.code]['isExpanded'] &&
												p.operations &&
												p.operations.length > 0
											"
											style="cursor: pointer"
											@click="toggleOperationSection(p.code)"
										/>
										<div
											style="cursor: pointer"
											@click="toggleOperationSection(p.code)"
										>
											<DownOutlined
												v-if="
													expandingObj[p.code] &&
													expandingObj[p.code]['isExpanded'] &&
													p.operations &&
													p.operations.length > 0
												"
											/>
											<span style="font-weight: bold">{{ p.name }}</span>
										</div>
										<state-selector
											class="ml-auto"
											:disabled="
												p.disabled || !$can(MAINTAIN_PERMISSION, IDENTITY_ROLE)
											"
											:item="p"
											:name="p.id"
											:item-idx="i"
											:is-two-states="true"
											@element-clicked="onUserPermissionChange"
										/>
									</div>

									<div
										v-if="
											expandingObj[p.code] && expandingObj[p.code]['isExpanded']
										"
										class="operator-wrapper"
									>
										<div
											v-for="(o, j) in p.operations"
											:key="o.key"
											class="operator"
										>
											<div class="d-flex">
												<span>{{ o.name }}</span>
												<state-selector
													:is-two-states="true"
													class="ml-auto"
													:disabled="
														o.disabled ||
														p.isRestricted ||
														!$can(MAINTAIN_PERMISSION, IDENTITY_ROLE)
													"
													:item="{
														...o,
														permissionCode: p.code,
														permissionIdx: i,
													}"
													:name="o.id"
													:item-idx="j"
													@element-clicked="onUserOperationChange"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</a-tab-pane>
					<a-tab-pane key="2" tab="Overrides">
						<section>
							<resource
								name="identities.common.overrided-permissions"
								:api-url="apiUrl"
							>
								<overrided-permissions :role-id="roleDetails.id" />
							</resource>
						</section>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { MAINTAIN_PERMISSION, IDENTITY_ROLE } from '@kraftheinz/common'
import ListRole from './ListRole'
import StateSelector from '../Common/StateSelector'

import OverridedPermissions from './ListRole/OverridedPermissions.vue'

const apiUrl = import.meta.env.VITE_API_URL

const ROLE_PERMISSIONS_ENDPOINT_URL = `${apiUrl}/identities/roles/?entityContext=0`
const RIGHTS_ENDPOINT_URL = `${apiUrl}/identities/rights?entityContext=0`
const ROLE_DELETE_ENDPOINT_URL = `${apiUrl}/identities/roles/$roleCode`
const ROLE_UPDATE_ENDPOINT_URL = `${apiUrl}/identities/roles/$roleCode`

const values = {
	DENIED: 'disable',
	GRANTED: 'enable',
}

export default {
	components: {
		ListRole,
		StateSelector,
		OverridedPermissions,
	},

	data() {
		return {
			apiUrl,
			itemsMenu: [
				{
					key: 'configuration',
					title: 'Configuration',
					path: '',
				},
				{
					key: 'managerole',
					title: 'Manage Roles',
					path: '/config/roles',
				},
			],

			/**
			 * This object is for managing the expanding state of operation
			 */
			expandingObj: {},

			permissions: [],
			roleDetails: {},

			permissionsLoading: false,
			keyListRole: 'key1',
			selectedRoleId: null,
			MAINTAIN_PERMISSION,
			IDENTITY_ROLE,
		}
	},

	mounted() {},

	methods: {
		onRoleSelected(roleDetails) {
			this.roleDetails = JSON.parse(roleDetails)

			this.permissions = []
			this.getPermissions(this.roleDetails.code).then(() => {
				this.permissions.forEach((p) => {
					this.expandingObj[p.code] = {}
					this.expandingObj[p.code]['isExpanded'] = false
				})

				this.permissions = [...this.permissions]
			})
		},

		getPermissions(role, permissionItemIdx, operationItemIdx) {
			return new Promise((resolve, reject) => {
				this.permissionsLoading = true

				this.axios
					.get(ROLE_PERMISSIONS_ENDPOINT_URL, { params: { role } })
					.then((res) => {
						try {
							this.permissions = res.data.results[0].permissions

							this.permissions.length > 0 &&
								this.assignKeys(permissionItemIdx, operationItemIdx)
							resolve()
						} catch (e) {
							this.showErrorMsg()

							reject()
						}
					})
					.finally(() => (this.permissionsLoading = false))
			})
		},

		showErrorMsg(err) {
			this.$notification['error']({
				message:
					(err.response && err.response.data && err.response.data.message) ||
					'Errors encountered!',
			})
		},

		toggleOperationSection(code) {
			this.expandingObj[code].isExpanded = !this.expandingObj[code].isExpanded
			this.expandingObj = { ...this.expandingObj }
		},

		onUserPermissionChange(objValue) {
			if (!objValue) return

			const type = values[objValue.type]

			const data = {
				roleCode: this.roleDetails.code,
				type,
				permissionCode: objValue.item.code,
			}

			this.handlePermissionsAndOperations(data, objValue.itemIdx)
		},

		onUserOperationChange(objValue) {
			if (!objValue) return

			const type = values[objValue.type]

			const data = {
				roleCode: this.roleDetails.code,
				type,
				permissionCode: objValue.item.permissionCode,
				operationCode: objValue.item.code,
			}

			this.handlePermissionsAndOperations(
				data,
				objValue.item.permissionIdx,
				objValue.itemIdx
			)
		},

		handlePermissionsAndOperations(data, permissionItemIdx, operationItemIdx) {
			const isHandlingOperation = operationItemIdx >= 0

			const toggleDisabling = (val) => {
				if (isHandlingOperation) {
					this.permissions[permissionItemIdx].operations[operationItemIdx] = {
						...this.permissions[permissionItemIdx].operations[operationItemIdx],
						disabled: val,
					}
				} else {
					this.permissions[permissionItemIdx] = {
						...this.permissions[permissionItemIdx],
						disabled: val,
					}
				}

				this.permissions = [...this.permissions]
			}

			toggleDisabling(true)

			this.permissionsLoading = true

			this.updateRole(data)
				.then(
					() => {
						this.getPermissions(
							this.roleDetails.code,
							permissionItemIdx,
							operationItemIdx
						)
					},
					(err) => {
						this.showErrorMsg(err)
					}
				)
				.finally(() => {
					toggleDisabling(false)
					this.permissionsLoading = false
				})
		},

		updateRole(data) {
			return this.axios.put(RIGHTS_ENDPOINT_URL, data)
		},

		deleteRole(roleCode) {
			this.axios
				.delete(ROLE_DELETE_ENDPOINT_URL.replace('$roleCode', roleCode))
				.then(() => {
					this.keyListRole = Date.now() + ''
				})
				.catch((err) => this.showErrorMsg(err))
		},

		/**
		 * callback for the senarios:
		 * 1. Toggle role status in role list, callback getRoles
		 * 2. After toggling role status in role details, force
		 * the role list to be updated, then re-select the selected row
		 */
		toggleRole(role, callback) {
			this.axios
				.put(ROLE_UPDATE_ENDPOINT_URL.replace('$roleCode', role.code), {
					name: role.name,
					description: role.description,
					isInactive: role.isActive,
					weight: role.weight,
				})
				.then(() => callback && callback())
				.catch((err) => this.showErrorMsg(err))
		},

		/**
		 * Needed for UI updating
		 */
		assignKeys(permissionItemIdx, operationItemIdx) {
			const getKey = (item) => {
				return (
					item.id + item.code + item.isActive + item.isLock + item.isRestricted
				)
			}

			this.permissions.forEach((p) => {
				p.key = getKey(p)

				p.operations.forEach((o) => {
					o.key = getKey(o)
				})
			})

			try {
				const permission = this.permissions[permissionItemIdx]

				this.permissions[permissionItemIdx] = {
					...this.permissions[permissionItemIdx],
					key: getKey(permission),
				}

				const operation =
					this.permissions[permissionItemIdx].operations[operationItemIdx]

				this.permissions[permissionItemIdx].operations[operationItemIdx] = {
					...this.permissions[permissionItemIdx].operations[operationItemIdx],
					key: getKey(operation),
				}
			} catch (e) {}
		},

		/** Force role list to update the list, then re-select the selected row */
		roleToggleCallback() {
			{
				this.roleDetails.isActive = !this.roleDetails.isActive

				this.selectedRoleId = this.roleDetails.id
				this.keyListRole = Date.now() + ''
			}
		},
	},
}
</script>

<style lang="scss" scoped>
$activeColor: #0062ff;

hr {
	border-color: #c5c5c5;
	opacity: 0.2;
}

h2 {
	font-size: 20px;
	font-weight: 700;
	background-color: #fff;
}

.role-details {
	background-color: #fff;
	height: calc(100vh - 221px);

	h3 {
		color: $activeColor;
	}

	.entity-details {
		p {
			font-weight: bold;
		}
	}

	section.permissions {
		.wrapper {
			height: calc(100vh - 409px);
			overflow: auto;

			& > div {
				margin-bottom: 1rem;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		h4 {
			color: #272d35;
		}

		i.anticon-right,
		i.anticon-down {
			margin-right: 5px;
		}

		.permission-wrapper {
			background-color: #f9fafb;
			padding: 0.5rem;
		}

		.operator-wrapper {
			& > .operator {
				background-color: #f9fafb;
				padding-top: 8px;
				padding-left: 10px;
				padding-bottom: 8px;

				margin: 1rem 8px 1rem 1.5rem;
			}
		}
	}
}

.manage-roles {
	@media (max-width: 768px) {
		.ant-row-flex > .ant-col-md-24:first-child {
			padding-right: 0 !important;
			padding-left: 0 !important;
			margin-bottom: 1rem;
		}
	}
}
</style>
