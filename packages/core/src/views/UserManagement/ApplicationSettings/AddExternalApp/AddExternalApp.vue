<template>
	<simple-form v-slot="{ handleSubmit }">
		<a-modal
			v-model="visible"
			ok-text="Add"
			title="Add Application"
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
							v-if="imageUrl"
							class="upload-pic"
							:style="{
								backgroundImage: 'url(' + encodeURI(apiUrl + imageUrl) + ')',
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
						label="Image"
						rules="required"
						:input-image-url="imageUrl"
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
								@change="storeValue(`region`, $event)"
							/>
						</a-col>
						<a-col :span="4">
							<span> Type </span>
							<a-tag color="orange" class="mt-2"> External </a-tag>
						</a-col>
						<a-col
							v-for="language in languages"
							:key="language.languageCode"
							:span="24"
						>
							<text-input
								:label="`Name in ${language.nameInEnglish}`"
								form-item
								:rules="
									language.languageCode === defaultNameLangCode
										? 'required'
										: ''
								"
								@change="onNameChange(language.languageCode, $event)"
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
								@change="onDefaultLangNameChange"
							/>
						</a-col>
						<a-col :span="24">
							<text-area
								label="Description"
								:rows="6"
								form-item
								@change="storeValue(`description`, $event)"
							/>
						</a-col>
						<a-col :span="12">
							<text-input
								label="CI Number"
								form-item
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
								@change="storeValue(`applicationGroupId`, $event)"
							/>
						</a-col>
						<a-col :span="24">
							<text-input
								label="Production URL"
								form-item
								@change="storeValue(`launchUrl`, $event)"
							/>
						</a-col>
						<a-col :span="24">
							<text-input
								label="Test URL"
								form-item
								@change="storeValue(`testUrl`, $event)"
							/>
						</a-col>
						<a-col :span="24">
							<switch-input
								key="copyResultsFlag"
								label="Coming Soon"
								@change="storeValue('isComingSoon', $event)"
							/>
						</a-col>
					</a-row>
				</a-col>
			</a-row>

			<template #footer>
				<a-button @click="cancel">Cancel</a-button>
				<a-button
					:loading="isSubmitting"
					type="primary"
					@click="handleSubmit(submit)"
				>
					Add
				</a-button>
			</template>
		</a-modal>
	</simple-form>
</template>

<script>
import { ErrorHandlerMixin } from '@kraftheinz/common'

export default {
	name: 'AddExternalApp',

	inject: ['crud', 'apiUrl'],

	mixins: [ErrorHandlerMixin],

	data() {
		return {
			visible: false,
			loading: false,
			isSubmitting: false,
			createForm: {},
			imageUrl: '',
			languages: [],
			appName: [],
			defaultNameLangCode: 'en',
			actionUrl: this.apiUrl + '/files/images',
		}
	},

	created() {
		this.getListLanguage()
	},

	mounted() {
		this.visible = true
		this.storeValue('codeLangDefault', this.defaultNameLangCode)
	},

	methods: {
		afterModalClose() {
			this.$router.push('/config/settings')
		},

		cancel() {
			this.visible = false
		},

		handleChange(info) {
			this.imageUrl = info.path
			this.storeValue('image', info.path)
		},

		onRegionChange(value) {
			this.storeValue('image', value)
		},

		storeValue(resourceKey, value) {
			const createForm = this.createForm

			this.createForm = {
				...createForm,
				[resourceKey]: value,
			}

			this.crud.updateEntity('createForm', { resourceKey, value })
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

		onNameChange(code, value) {
			const existedName = this.appName.find((app) => app.languageCode === code)

			if (existedName) {
				this.appName.map((app) => {
					if (app.languageCode === code) app.name = value
				})
			} else {
				this.appName.push({ languageCode: code, name: value })
			}

			this.storeValue('appName', this.appName)
		},

		onDefaultLangNameChange(value) {
			this.defaultNameLangCode = value
			this.storeValue('codeLangDefault', value)
		},

		submit() {
			this.isSubmitting = true
			this.crud
				.submitEntity('create')
				.then(() => {
					this.isSubmitting = true
					this.createForm = {}
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
