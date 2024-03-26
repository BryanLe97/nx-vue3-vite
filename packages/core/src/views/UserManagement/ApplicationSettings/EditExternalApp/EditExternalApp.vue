<template>
	<simple-form v-slot="{ handleSubmit }">
		<a-modal
			v-model="visible"
			ok-text="Save"
			title="Edit Application"
			:width="832"
			:after-close="afterModalClose"
			:ok="submit"
		>
			<a-row :gutter="32" type="flex" justify="center">
				<a-col :span="10" class="d-flex justify-content-start flex-column">
					<span class="neutral-10--text pb-1">Image</span>
					<a-card
						align="middle"
						:body-style="{ height: '100%' }"
						:style="{ position: 'relative', minHeight: '246px' }"
					>
						<div
							v-if="image"
							class="upload-pic"
							:style="{
								backgroundImage: 'url(' + image + ')',
							}"
						></div>
						<div
							v-else
							:style="{ height: '100%' }"
							class="d-flex align-items-center justify-content-center"
						>
							No image
						</div>
					</a-card>
					<upload-input
						list-type="picture-card"
						class="d-flex justify-content-center button-upload"
						type="path"
						form-item
						:input-image-url="image"
						label="Image"
						rules="required"
						:action="actionUrl"
						@change="handleChange"
					>
						<a-button type="primary" ghost>
							<span>Upload Image</span>
						</a-button>
					</upload-input>
				</a-col>
				<a-col :span="14">
					<a-row :gutter="16" type="flex" justify="space-between">
						<a-col :span="20">
							<select-input
								label="Country"
								reference="identities.common.portal.regions"
								source="regionCode"
								source-label="regionName"
								form-item
								rules="required"
								mode="multiple"
								:value="entity.region"
								@change="storeValue(`region`, $event)"
							/>
						</a-col>
						<a-col :span="4">
							<span> Type </span>
							<a-tag :color="APP_TYPE_COLOR[entity.appType]" class="mt-2">
								{{ entity.appType }}
							</a-tag>
						</a-col>
						<a-col
							v-for="name in entity.appName"
							:key="name.languageCode"
							:span="24"
						>
							<text-input
								:label="parseLabelName(name.languageCode)"
								form-item
								:value="name.name"
								:rules="
									name.languageCode === defaultNameLangCode ? 'required' : ''
								"
								:disabled="
									entity.appType === 'Internal' && name.languageCode === 'en'
								"
								@change="onNameChange(name.languageCode, $event)"
							/>
						</a-col>
						<a-col :span="24">
							<radio-group-input
								label="Default Name"
								:data-source="languages"
								source="languageCode"
								source-label="nameInEnglish"
								form-item
								:value="defaultNameLangCode"
								:disabled="entity.appType === 'Internal'"
								@change="onDefaultLangNameChange"
							/>
						</a-col>
						<a-col :span="24">
							<text-area
								label="Description"
								:rows="6"
								form-item
								:value="entity.description"
								@change="storeValue(`description`, $event)"
							/>
						</a-col>
						<a-col :span="12">
							<text-input
								label="CI Number"
								form-item
								:value="entity.ciNumber"
								@change="storeValue(`ciNumber`, $event)"
							/>
						</a-col>
						<a-col :span="12">
							<select-input
								label="Application Group"
								reference="identities.common.app-group-list"
								source="id"
								source-label="name"
								form-item
								rules="required"
								:value="entity.applicationGroupId"
								@change="storeValue(`applicationGroupId`, $event)"
							/>
						</a-col>
						<a-col v-if="entity.appType === `External`" :span="24">
							<text-input
								label="Production URL"
								form-item
								:value="entity.launchUrl"
								@change="storeValue(`launchUrl`, $event)"
							/>
						</a-col>
						<a-col v-if="entity.appType === `External`" :span="24">
							<text-input
								label="Test URL"
								form-item
								:value="entity.testUrl"
								@change="storeValue(`testUrl`, $event)"
							/>
						</a-col>
						<a-col v-if="entity.appType === `External`" :span="24">
							<switch-input
								key="copyResultsFlag"
								label="Coming Soon"
								:value="entity.isComingSoon"
								@change="storeValue('isComingSoon', $event)"
							/>
						</a-col>
					</a-row>
				</a-col>
			</a-row>

			<template #footer>
				<a-button
					v-if="entity.appType === `External`"
					:type="!entity.isInactive ? `danger` : `primary`"
					ghost
					@click="toggleAppStatus(entity)"
				>
					{{ !entity.isInactive ? `Deactivate` : `Activate` }}
				</a-button>
				<a-button
					v-if="entity.appType === `External`"
					type="danger"
					ghost
					@click="onDeleteApp"
				>
					Delete
				</a-button>
				<a-button @click="cancel">Cancel</a-button>
				<a-button
					:loading="isSubmitting"
					type="primary"
					@click="handleSubmit(submit)"
				>
					Save
				</a-button>
			</template>
		</a-modal>
	</simple-form>
</template>

<script>
import { ErrorHandlerMixin } from '@kraftheinz/common'

import { APP_TYPE_COLOR } from '@/constants'

export default {
	name: 'EditExternalApp',

	inject: ['crud', 'apiUrl', 'resourceName'],

	mixins: [ErrorHandlerMixin],

	data() {
		return {
			visible: false,
			loading: false,
			isSubmitting: false,
			editForm: {},
			imageUrl: '',
			actionUrl: this.apiUrl + '/files/images',
			isToggled: false,
			APP_TYPE_COLOR,
			defaultNameLangCode: '',
			languages: [],
			appName: [],
		}
	},

	computed: {
		entity() {
			return this.crud.getEntity()
		},

		//prefix apiUrl of imageUrl is duplicated on PROD, so use computed image to delete duplicate
		image() {
			if (!this.imageUrl) {
				return ''
			}
			let url = this.imageUrl
			let count = this.countDuplicateString(this.imageUrl, this.apiUrl)
			while (count > 1) {
				url = url.replace(this.apiUrl, '')
				count--
			}
			return url
		},
	},

	watch: {
		entity(newVal) {
			if (newVal.image === null) {
				this.imageUrl = null
			} else this.imageUrl = this.apiUrl + newVal.image
		},
	},

	created() {
		this.getListLanguage()
	},

	async mounted() {
		await this.crud.fetchEntity()
		this.defaultNameLangCode = this.entity.codeLangDefault
		this.appName = this.entity.appName
		this.storeValues(this.entity)
		this.visible = true
	},

	methods: {
		afterModalClose() {
			this.$router.push('/config/settings')
			if (this.isToggled) {
				this.crud.fetchList()
			}
		},

		cancel() {
			this.visible = false
		},

		countDuplicateString(inputString, countString) {
			let lastIndex = 0
			let count = 0
			while (lastIndex != -1) {
				lastIndex = inputString.indexOf(countString, lastIndex)

				if (lastIndex != -1) {
					count++
					lastIndex += countString.length
				}
			}
			return count
		},

		handleChange(info) {
			this.imageUrl = this.apiUrl + info.path
			this.storeValue('image', info.path)
		},

		parseLabelName(langCode) {
			const appName = this.languages.find(
				(language) => language.languageCode === langCode
			)
			if (appName) return `Name in ${appName.nameInEnglish}`
			return ''
		},

		onNameChange(code, value) {
			this.appName.map((app) => {
				if (app.languageCode === code) app.name = value
			})

			this.storeValue('appName', this.appName)
		},

		onDefaultLangNameChange(value) {
			this.defaultNameLangCode = value
			this.storeValue('codeLangDefault', value)
		},

		async getListLanguage() {
			try {
				const { data } = await this.axios.get(
					`${this.apiUrl}/identities/common/portal/languages`
				)
				if (data) {
					this.languages = data.results
				}
			} catch (err) {
				this.displayErrorNotification(err)
			}
		},

		storeValue(resourceKey, value) {
			const editForm = this.editForm

			this.editForm = {
				...editForm,
				[resourceKey]: value,
			}

			this.crud.updateEntity('editForm', { resourceKey, value })
		},

		storeValues(entity) {
			if (entity) {
				Object.entries(this.entity).forEach(([key, value]) =>
					this.storeValue(key, value)
				)
			}
		},

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
					.then(() => {
						this.isToggled = true
					})
		},

		onDeleteApp() {
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
				onOk: this.deleteApp(this.entity),
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

		submit() {
			this.isSubmitting = true
			this.crud
				.submitEntity('replace')
				.then(() => {
					this.isSubmitting = true
					this.editForm = {}
					this.cancel()
					this.crud.fetchList()
				})
				.catch((err) => {
					console.log(err)
					this.isSubmitting = false
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.button-upload {
	padding-top: 10px;
	max-height: 40px;
	width: 100%;
	:deep(.avatar-uploader) {
		padding: 0;
		height: fit-content;
	}
	:deep(.ant-upload) {
		padding: 0;
		&.ant-upload-select-picture-card {
			border: none;
			background-color: #fff;
			height: auto;
			margin: 0;
		}
	}
}
.upload-pic {
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
	position: absolute;
	width: calc(100% - 24px);
	height: calc(100% - 24px);
	top: 12px;
	left: 12px;
}
</style>
