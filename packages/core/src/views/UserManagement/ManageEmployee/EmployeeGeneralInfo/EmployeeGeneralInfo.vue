<template>
	<a-form :form="form" @submit="onSubmit">
		<a-row :gutter="24" type="flex">
			<a-col :md="24" :lg="6">
				<h5 class="h6">User Settings</h5>
			</a-col>

			<a-col :md="24" :lg="18">
				<div class="card p-4">
					<a-row :gutter="24" type="flex">
						<a-col class="mb-3" :xs="12">
							<a-form-item label="Username/LAN ID">
								<a-auto-complete
									v-decorator="[
										'userName',
										{
											rules: [
												{ required: true, message: errorMsg.userNameRequired },
												{
													pattern: /^[a-zA-Z0-9-._@+]*$/,
													message: errorMsg.userNameInvalid,
												},
												{
													max: 255,
													message: errorMsg.userNameTooLong,
												},
											],
											initialValue: entity.userName,
										},
									]"
									:disabled="!isCreatingNewEmployee"
									option-label-prop="title"
									@select="onSelect"
									@search="onSearch"
								>
									<template #dataSource>
										<a-select-option v-if="dataSource.length > 0" key="label">
											<div class="d-flex">
												<div style="width: 50%">Account Name</div>
												<div style="width: 50%">Email</div>
											</div>
										</a-select-option>

										<a-select-option
											v-for="option in dataSource"
											:key="option.samAccountName"
											:value="option.samAccountName"
											:title="option.samAccountName"
										>
											<div class="d-flex">
												<div style="width: 50%" class="text-ellipsis">
													{{ option.samAccountName }}
												</div>
												<div style="width: 50%" class="text-ellipsis">
													{{ option.email }}
												</div>
											</div>
										</a-select-option>
									</template>
								</a-auto-complete>
							</a-form-item>
						</a-col>

						<a-col class="mb-3" :xs="12">
							<a-form-item label="Job Title">
								<a-input
									v-decorator="['jobTitle', { initialValue: entity.jobTitle }]"
									:disabled="!can(MAINTAIN_PERMISSION)"
									@change="
										storeValue(
											$event.target.value,
											'jobTitle',
											convertFirstLetterToUppercase
										)
									"
								/>
							</a-form-item>
						</a-col>

						<a-col class="mb-3" :xs="12">
							<a-form-item label="First Name">
								<a-input
									v-decorator="[
										'firstName',
										{
											rules: [
												{ required: true, message: errorMsg.firstNameRequired },
											],
											initialValue: entity.firstName,
										},
									]"
									:disabled="!can(MAINTAIN_PERMISSION)"
									@change="
										storeValue(
											$event.target.value,
											'firstName',
											convertFirstLetterToUppercase
										)
									"
								/>
							</a-form-item>
						</a-col>

						<a-col class="mb-3" :xs="12">
							<a-form-item label="Last Name">
								<a-input
									v-decorator="[
										'lastName',
										{
											rules: [
												{ required: true, message: errorMsg.lastNameRequired },
											],
											initialValue: entity.lastName,
										},
									]"
									:disabled="!can(MAINTAIN_PERMISSION)"
									@change="
										storeValue(
											$event.target.value,
											'lastName',
											convertFirstLetterToUppercase
										)
									"
								/>
							</a-form-item>
						</a-col>
					</a-row>

					<a-row :gutter="24" type="flex">
						<a-col :xs="12">
							<a-form-item label="Phone">
								<a-input
									:disabled="!can(MAINTAIN_PERMISSION)"
									:value="entity.phoneNumber"
									@change="storeValue($event.target.value, 'phoneNumber')"
								/>
							</a-form-item>
						</a-col>

						<a-col :xs="12">
							<a-form-item label="Email">
								<a-input
									v-decorator="[
										'email',
										{
											rules: [
												{
													type: 'email',
													message: errorMsg.emailInvalid,
												},
												{ required: true, message: errorMsg.emailRequired },
											],
											initialValue: entity.email,
										},
									]"
									:disabled="!can(MAINTAIN_PERMISSION)"
									@change="storeValue($event.target.value, 'email')"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</div>
			</a-col>
		</a-row>

		<a-divider />

		<a-row
			v-if="can(MAINTAIN_PERMISSION)"
			:gutter="0"
			justify="end"
			type="flex"
		>
			<a-button
				:loading="isRefreshing || isSubmitting"
				icon="reload"
				@click="onLookUp(entity.userName, true)"
				>Sync from AD</a-button
			>

			<a-button class="ml-2" @click="onBack">Cancel</a-button>

			<a-button
				v-if="!isCreatingNewEmployee"
				class="ml-2"
				ghost
				:loading="statusUpdating"
				:type="entity.isActive ? 'danger' : 'primary'"
				@click="toggleUserStatus(entity)"
				>{{ entity.isActive ? 'Deactivate' : 'Activate' }}</a-button
			>

			<a-button
				:loading="isSubmitting"
				class="ml-2"
				type="primary"
				html-type="submit"
				>Save</a-button
			>
		</a-row>
	</a-form>
</template>

<script>
import { MAINTAIN_PERMISSION } from '@kraftheinz/common'

export default {
	name: 'EmployeeGeneralInfo',

	inject: ['crud', 'data', 'apiUrl', 'can'],

	data() {
		const errorMsg = {
			firstNameRequired: 'First name is required.',
			userNameRequired: 'Username is required.',
			lastNameRequired: 'Last name is required.',
			phoneRequired: 'Phone number is required.',
			emailRequired: 'Email is required.',
			emailInvalid: 'The input is not valid E-mail!',
			phoneInvalid: 'The input is not valid Phone Number!',
			userNameInvalid:
				'Username should not contain spaces or special characters (Except - _ . @ +)',
			userNameTooLong: 'Username should not be longer than 255 characters',
		}

		return {
			errorMsg,
			isSubmitting: false,
			form: this.$form.createForm(this, { name: 'userInfo' }),
			entity: {},
			isCreatingNewEmployee: null,
			usernameTimeout: null,
			statusUpdating: false,
			isRefreshing: false,
			MAINTAIN_PERMISSION,
			dataSource: [],
		}
	},

	mounted() {
		this.isCreatingNewEmployee = !this.$route.params.id

		this.entity = { ...this.data }

		this.storeValues(this.entity)
	},

	methods: {
		storeValues(entity) {
			const fields = Object.keys(entity)
			fields.forEach((key) => this.storeValue(entity[key], key))
		},

		storeValue(value, resourceKey, fn) {
			const newVal = (fn && fn(value)) || value

			this.entity = {
				...this.entity,
				[resourceKey]: newVal,
			}

			this.crud.updateEntity(
				this.isCreatingNewEmployee ? 'createForm' : 'editForm',
				{
					resourceKey,
					value: newVal,
				}
			)
		},

		onUsernameChange(userName) {
			this.entity = {}
			clearTimeout(this.usernameTimeout)

			if (userName) {
				this.usernameTimeout = setTimeout(() => {
					this.onLookUp(userName)
				}, 500)
			}
		},

		onLookUp(userName, isRefresh = false) {
			this.isRefreshing = isRefresh

			const user = this.dataSource.filter(
				(user) => user.samAccountName === userName
			)[0]

			this.entity = {
				...user,
				userName,
				jobTitle: user.title,
				isActive: user.isActive,
			}

			const { email, firstName, lastName, phoneNumber, title } = this.entity

			this.form.setFieldsValue({
				id: 1,
				email,
				firstName,
				lastName,
				phoneNumber,
				jobTitle: title,
			})

			if (isRefresh) {
				this.storeValues({
					email,
					firstName,
					lastName,
					phoneNumber,
					jobTitle: title,
				})
				this.update()
			}
		},

		convertFirstLetterToUppercase(text) {
			return text && text.length > 0
				? text[0].toUpperCase() + text.slice(1)
				: text
		},

		update() {
			this.isSubmitting = true

			this.crud
				.submitEntity('replace')
				.then()
				.finally(() => {
					this.isSubmitting = false
				})
		},

		create() {
			this.storeValue(true, 'isActive')
			this.isSubmitting = true

			this.axios
				.post(`${this.apiUrl}/identities/users`, this.entity)
				.then(
					(res) => {
						this.$router
							.push(`/config/employees/${res.data.userId}`)
							.then(() => {
								this.$notification['success']({
									message: 'User Created!',
								})
							})
					},
					(err) => this.showErrorMsg(err)
				)
				.finally(() => {
					this.isSubmitting = false
				})
		},

		showErrorMsg(err) {
			this.$notification['error']({
				message:
					this._.get(err, 'response.data.message') || 'Errors encountered!',
			})
		},

		onSubmit(e) {
			e.preventDefault()

			this.form.validateFields((err) => {
				if (!err) {
					if (this.isCreatingNewEmployee) {
						this.create()
					} else {
						this.update()
					}
				}
			})
		},

		onBack() {
			this.$router.push('/config/employees')
		},

		toggleUserStatus(record, customTitle = null, type = null) {
			let icon, okType, title

			if (!record.isActive) {
				title = 'Do you want to set this user to Activate?'
				icon = 'eye'
				okType = 'primary'
			} else {
				title = customTitle
					? customTitle
					: 'Do you want to set this user to Deactivate?'
				icon = type ? type : 'eye-invisible'
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

		toggleActive(record) {
			this.statusUpdating = true

			return () =>
				this.crud
					.submitPartialEntity({
						resourceName: 'identities.users',
						id: record.id,
						data: [
							{
								op: 'replace',
								path: '/IsInactive',
								value: record.isActive,
							},
						],
					})
					.then(() => {
						this.entity.isActive = !this.entity.isActive
					})
					.finally(() => (this.statusUpdating = false))
		},

		onSearch(e) {
			this.axios
				.get(
					`${this.apiUrl}/identities/ad/users${e !== '' ? '?keyword=' + e : ''}`
				)
				.then(
					(res) => {
						this.dataSource = res.data
					},
					(err) => this.showErrorMsg(err)
				)
				.finally(() => {
					this.isSubmitting = false
				})
		},

		onSelect(e) {
			this.onUsernameChange(e)
		},
	},
}
</script>

<style lang="scss" scoped>
.card {
	background: #fff;
}

:deep(.ant-form-item-label) {
	line-height: 20px;
}
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
