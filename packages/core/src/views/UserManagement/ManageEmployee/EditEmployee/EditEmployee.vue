<template>
	<div class="edit-employee">
		<bread-crumb :items="itemsMenu" />

		<div class="px-2">
			<a-row class="header mb-2 px-5" :gutter="16" type="flex">
				<a-col class="d-flex align-items-center flex-wrap p-0" :span="20">
					<ArrowLeftOutlined class="arrow-left mr-3" @click="onBack()" />
					<span class="mr-3 header-title text-capitalize">{{ fullName }}</span>
				</a-col>
			</a-row>
		</div>

		<a-tabs class="kh-tabs" default-active-key="1">
			<a-tab-pane key="1" class="p-5" tab="General Information">
				<general-info v-if="userInfo" :entity="userInfo" />
			</a-tab-pane>

			<a-tab-pane key="2" class="p-5" tab="Roles & Permissions">
				<a-row :gutter="24" type="flex">
					<a-col class="roles-table pr-3" :md="24" :lg="10">
						<user-roles-table
							:key="keyListRole"
							:selected-role-id="selectedRoleId"
							:toggle-role="toggleRole"
							@role-selected="onRoleSelected"
						/>
					</a-col>

					<a-col
						v-if="roleDetails.id"
						class="user-role-details pt-3"
						:md="24"
						:lg="14"
					>
						<div class="d-flex">
							<h3>{{ roleDetails.name }}</h3>

							<div v-if="can(MAINTAIN_PERMISSION)" class="ml-auto">
								<a-popconfirm
									placement="bottomRight"
									ok-text="Yes"
									ok-type="danger"
									cancel-text="No"
									@confirm="deleteRole(roleDetails)"
								>
									<template slot="title">
										<p>Are you sure you want to delete this role?</p>
									</template>

									<a-button type="danger" :loading="isDeleting" ghost
										>Delete</a-button
									>
								</a-popconfirm>

								<a-switch
									checked-children="Active"
									un-checked-children="Inactive"
									class="ml-3"
									:checked="roleDetails.isActive"
									@change="toggleRole(roleDetails, roleToggleCallback)"
								/>
							</div>
						</div>

						<a-row :gutter="24" class="entity-details mt-3" type="flex">
							<a-col :md="6">
								Entity Level
								<p>{{ roleDetails.entityLevel }}</p>
							</a-col>

							<a-col :md="6">
								Site
								<br />
								<u-m-badge
									:key="roleDetails.entityLevel"
									:type="roleDetails.entityLevel"
									:text="roleDetails.entityLevelName"
								/>
							</a-col>
						</a-row>

						<hr />

						<section class="permissions">
							<h4 class="mt-3">
								Permissions
								<LoadingOutlined v-if="permissionsLoading" slot="indicator" />
							</h4>

							<div class="wrapper">
								<div v-for="(p, i) in permissions" :key="p.key">
									<div class="d-flex permission-wrapper">
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
											style="cursor: pointer; margin-top: 2px"
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
											:disabled="p.disabled || !can(MAINTAIN_PERMISSION)"
											:item="p"
											:name="p.id"
											:item-idx="i"
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
											class="operator my-3"
										>
											<div class="d-flex">
												<span>{{ o.name }}</span>

												<state-selector
													class="ml-auto"
													:disabled="
														o.disabled ||
														p.isRestricted ||
														!can(MAINTAIN_PERMISSION)
													"
													:item="{
														...o,
														permissionCode: p.code,
														permissionIdx: i,
													}"
													:item-idx="j"
													:name="o.id"
													@element-clicked="onUserOperationChange"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</a-col>
				</a-row>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'

import GeneralInfo from '../EmployeeGeneralInfo'
import StateSelector from '../../Common/StateSelector'
import UserRolesTable from './UserRolesTable'
import UMBadge from '../../Common/UMBadge'

const values = {
	DENIED: 'disable',
	RESTORED: 'restore',
	GRANTED: 'enable',
}

export default {
	name: 'EditEmployee',

	inject: ['resourceProps', 'can'],

	components: {
		GeneralInfo,
		StateSelector,
		UserRolesTable,
		UMBadge,
	},

	data() {
		const [entitiesResource, editInfoResource] = this.resourceProps

		return {
			MAINTAIN_PERMISSION,
			keyListRole: 'key1',
			selectedRoleId: null,

			isSubmitting: false,

			itemsMenu: [
				{
					key: 'configuration',
					title: 'Configuration',
					path: '',
				},
				{
					key: 'employee',
					title: 'Employee',
					path: '/config/employees',
				},
			],

			entitiesResource,
			editInfoResource,
			roles: [],
			permissions: [],
			userId: '',
			selectedRoleCode: '',

			/**
			 * Declaring with default value {} here won't work.
			 * GeneralInfo component won't toggle rendering with new value of userInfo
			 */
			userInfo: '',
			permissionsLoading: false,
			entity: {},

			/**
			 * This object is for managing the expanding state of operation
			 */
			expandingObj: {},

			GeneralInfo,
			roleDetails: {},

			isDeleting: false,
		}
	},

	computed: {
		fullName() {
			const firstName = this.userInfo.firstName
				? this.userInfo.firstName[0].toUpperCase() +
				  this.userInfo.firstName.slice(1)
				: ''

			const lastName = this.userInfo.lastName
				? this.userInfo.lastName[0].toUpperCase() +
				  this.userInfo.lastName.slice(1)
				: ''

			return firstName + ' ' + lastName
		},
	},

	mounted() {
		this.userId = this.$route.params.id

		this.editInfoResource.crud.fetchEntity().then((res) => {
			this.userInfo = res.data
		})
	},

	methods: {
		/** Force role list to update the list, then re-select the selected row */
		roleToggleCallback() {
			{
				this.roleDetails.isActive = !this.roleDetails.isActive

				this.selectedRoleId =
					this.roleDetails.id +
					this.roleDetails.entityId +
					this.roleDetails.code +
					''
				this.keyListRole = Date.now() + ''
			}
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

			this.submit(data).then(
				() => {
					this.getPermissions(permissionItemIdx, operationItemIdx).then(() =>
						toggleDisabling(false)
					)
				},
				(err) => {
					this.showErrorMsg(err)
				}
			)
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

		onBack() {
			this.$router.push(this.editInfoResource.redirectRoute)
		},

		onRoleSelected(roleDetails) {
			this.roleDetails = JSON.parse(roleDetails)

			this.permissions = []

			this.getPermissions().then(() => {
				this.permissions.forEach((p) => {
					this.expandingObj[p.code] = {}
					this.expandingObj[p.code]['isExpanded'] = false
				})
				this.permissions = [...this.permissions]
			})
		},

		getPermissions(permissionItemIdx, operationItemIdx) {
			return new Promise((resolve, reject) => {
				const userPermissionsRequestUrl = `${this.entitiesResource.apiUrl}/identities/users/${this.userId}/roles/?role=${this.roleDetails.code}&entityContext=${this.roleDetails.entityId}`

				this.permissionsLoading = true

				this.axios
					.get(userPermissionsRequestUrl)
					.then(
						(userPermissionsRes) => {
							this.permissions =
								(userPermissionsRes &&
									userPermissionsRes.data &&
									userPermissionsRes.data.results &&
									userPermissionsRes.data.results[0].permissions) ||
								[]

							this.permissions.length > 0 &&
								this.assignKeys(permissionItemIdx, operationItemIdx)

							resolve()
						},
						(err) => {
							this.showErrorMsg(err)

							reject()
						}
					)
					.finally(() => {
						this.permissionsLoading = false
					})
			})
		},

		/**
		 * Needed for UI updating
		 */
		assignKeys(permissionItemIdx, operationItemIdx) {
			const getKey = (item) => {
				return item.id + item.code + Date.now() + ''
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

		submit(data) {
			return this.axios.put(
				`${this.entitiesResource.apiUrl}/identities/users/${this.userId}/rights`,
				data,
				{ params: { entityContext: this.roleDetails.entityId } }
			)
		},

		/**
		 * callback for the senarios:
		 * 1. Toggle role status in role list, callback getRoles
		 * 2. After toggling role status in role details, force
		 * the role list to be updated, then re-select the selected row
		 */
		toggleRole(role, callback, type) {
			//TODO: set a loading flag

			const url = `${this.entitiesResource.apiUrl}/identities/users/${this.userId}/rights/`

			this.axios
				.put(
					url,
					{
						roleCode: role.code,
						type: type ? type : role.isActive ? 'disable' : 'enable',
					},
					{ params: { entityContext: role.entityId } }
				)
				.then(() => {
					callback && callback()
				})
				.catch((err) => this.showErrorMsg(err))
		},

		deleteRole(role) {
			const callbackFn = () => {
				this.roleDetails = {}
				this.keyListRole = Date.now() + ''
			}

			//TODO: set a loading flag

			this.toggleRole(role, callbackFn, 'delete')
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
	},
}
</script>

<style lang="scss" scoped>
$activeColor: #0062ff;
$inactiveColor: #d9d9db;

.edit-employee {
	background-color: white;

	.font-italic {
		font-style: italic;
	}

	& > .kh-tabs {
		margin-bottom: 0;
		& > :deep(.ant-tabs-content) {
			background: #f6f6fa;
			& > :deep(.ant-tabs-tabpane) {
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

	span.required {
		color: #f5222d;
	}

	.ant-form-item {
		width: 100%;
	}

	.entity-spinner {
		color: #dfdfdf;
	}
}

hr {
	border-color: #c5c5c5;
	opacity: 0.2;
}

.user-role-details {
	background-color: #fff;
	height: calc(100vh - 242px);

	h4,
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
			height: calc(100vh - 428px);
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
			margin-top: 6px;
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
</style>
