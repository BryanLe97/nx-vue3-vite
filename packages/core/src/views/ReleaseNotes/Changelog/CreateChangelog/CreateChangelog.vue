<template>
	<div class="create-changelog">
		<bread-crumb :items="itemsMenu" />
		<div
			class="header px-5 pt-3 pb-2 mb-0 d-flex justify-content-between align-items-center"
		>
			<div class="d-flex align-items-center flex-wrap w-100">
				<ArrowLeftOutlined
					class="arrow-left pr-3"
					type="arrow-left"
					@click="onBack()"
				/>
				<h5 class="pr-3 m-0 h5">Add changelog</h5>
			</div>
		</div>
		<div class="p-5">
			<simple-form v-slot="{ handleSubmit }">
				<a-row :gutter="24" type="flex">
					<a-col :lg="24">
						<a-card :style="{ height: '100%' }">
							<a-row :gutter="24" type="flex">
								<a-col :span="8">
									<text-input
										key="versionNumber"
										form-item
										rules="required"
										label="Version"
										placeholder="Please enter version number"
										@change="storeValue('versionNumber', $event)"
									/>
								</a-col>
								<a-col :span="8">
									<text-input
										key="tag"
										form-item
										rules="required"
										label="Update"
										placeholder="Please enter application name"
										@change="storeValue('tag', $event)"
									/>
								</a-col>
								<a-col :span="8">
									<date-picker
										key="releaseDate"
										form-item
										format="DD/MM/YYYY"
										rules="required"
										label="Release Date"
										@change="storeValue('releaseDate', $event)"
									/>
								</a-col>
								<a-col :span="24">
									<quill-editor @change="editorChange($event)" />
								</a-col>
							</a-row>
						</a-card>
					</a-col>

					<a-col :span="24">
						<a-divider />
					</a-col>

					<a-col :span="24">
						<a-row justify="end" type="flex">
							<a-button @click="onBack()">Cancel</a-button>

							<a-button
								class="ml-2"
								type="primary"
								:loading="isSubmitting"
								@click="handleSubmit(submit)"
							>
								Create</a-button
							>
						</a-row>
					</a-col>
				</a-row>
			</simple-form>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CreateChangelog',
	inject: ['crud'],

	data() {
		return {
			isSubmitting: false,
			createForm: {},
			itemsMenu: [
				{
					key: 'release-notes',
					title: 'Release Notes',
					path: '',
				},
				{
					key: 'changelog',
					title: 'Changelog',
					path: '/release-notes/changelog',
				},
				{
					key: 'create-changelog',
					title: 'Add Changelog',
					path: '/release-notes/changelog/create',
				},
			],
		}
	},

	methods: {
		storeValue(resourceKey, value) {
			this.createForm = {
				...this.createForm,
				[resourceKey]: value,
			}
			this.crud.updateEntity('createForm', {
				resourceKey,
				value,
			})
		},

		onBack() {
			this.$router.push(`/release-notes/changelog`)
		},

		async submit() {
			this.isSubmitting = true
			try {
				await this.crud.submitEntity('create').then(() => {
					this.isSubmitting = false
					this.onBack()
				})
			} finally {
				this.isSubmitting = false
			}
		},

		editorChange({ html }) {
			this.storeValue('description', html)
		},
	},
}
</script>

<style lang="scss" scoped>
.create-changelog {
	:deep(quill-editor) {
		.ql-container {
			min-height: 450px;
		}
	}
}
</style>
