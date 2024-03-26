<template>
	<simple-form v-slot="{ handleSubmit }">
		<a-modal
			v-model="visible"
			class="edit-modal"
			:class="className"
			:after-close="afterModalClose"
			destroy-on-close
			:title="title"
			:width="width"
		>
			<a-row v-if="entity" align="top" :gutter="16" type="flex">
				<a-col
					v-for="field in fields"
					:key="field.key"
					:span="field.span"
					:offset="field.offset"
					:style="field.style"
				>
					<component
						:is="field.tag"
						form-item
						:class="checkRequiredFields(field.rules)"
						:name="field.key"
						:value="getValue(field.key)"
						v-bind="_.omit(field, 'style')"
						:disabled="field.disabled || !hasMaintainPermission"
						@change="onChange($event, field.key)"
					/>
				</a-col>

				<a-col
					v-if="hasLastModified"
					class="edit-modal__last-modified pt-2"
					:span="24"
				>
					Last modified by
					{{
						lastModifiedByName
							? `${updatedBy.firstName} ${updatedBy.lastName}`
							: entity.updatedBy
					}}
					on
					{{ moment(entity.updatedAt, 'DD/MM/YYYY HH:mm') }}
				</a-col>
			</a-row>

			<template #footer>
				<slot
					name="actions"
					:cancel="onCancel"
					:isLoading="isLoading"
					:toggleActive="onToggleActiveClick"
					:del="onDeleteClick"
					:submit="() => handleSubmit(submit)"
				>
					<a-button @click="onCancel">Cancel</a-button>

					<template v-if="can(permissions.delete)">
						<a-button
							v-if="hasDeactivateButton"
							ghost
							:type="toggleBtnType"
							@click="onToggleActiveClick"
						>
							{{ toggleBtnText }}
						</a-button>

						<a-button
							v-if="hasDeleteButton"
							ghost
							:type="toggleBtnType"
							@click="onDeleteClick"
						>
							Delete
						</a-button>
					</template>

					<a-button
						v-if="hasMaintainPermission"
						:loading="isLoading"
						type="primary"
						@click="handleSubmit(submit)"
					>
						Save
					</a-button>
				</slot>
			</template>
		</a-modal>
	</simple-form>
</template>

<script>
import {
	DELETE_PERMISSION,
	EDIT_PERMISSION,
	MAINTAIN_PERMISSION,
} from '@/constants/index.js'
import { RequestsTypes } from '@/store/modules/index.js'
import { CheckRequiredFields } from '@/mixins/index.js'

export default {
	name: 'EditModal',

	mixins: [CheckRequiredFields],

	props: {
		fields: {
			type: Array,
			required: true,
		},
		className: {
			type: String,
			default: '',
		},
		configDelete: {
			type: Object,
			default: null,
		},
		customListUrl: {
			type: String,
			default: '',
		},
		customRedirectRoute: {
			type: String,
			default: null,
		},
		customUrl: {
			type: String,
			default: null,
		},
		entityId: {
			type: [Number, String],
			default: '',
		},
		hasDeactivateButton: {
			type: Boolean,
			default: true,
		},
		hasDeleteButton: {
			type: Boolean,
			default: false,
		},
		hasLastModified: {
			type: Boolean,
			default: true,
		},
		//when turn on isFetchEntityById, editModel will not get entity form the list, that fetch new data base on Id for default
		isFetchEntityById: {
			type: Boolean,
			default: true,
		},
		keyReceiveEvent: {
			type: Array,
			default: () => [],
		},
		lastModifiedByName: {
			type: Boolean,
			default: false,
		},
		/**
		 * If EditModal is used within a Resource which has multiple resources,
		 * we extract the correct resource props from the resources object using
		 * reference.
		 */
		reference: {
			type: String,
			default: null,
		},
		title: {
			type: String,
			default: 'Edit',
		},
		visibleCustomModal: {
			type: Boolean,
			default: false,
		},
		width: {
			type: Number,
			default: 520,
		},
	},

	inject: [
		'apiUrl',
		'crud',
		'can',
		'redirectRoute',
		'resourceName',
		'resources',
	],

	data() {
		const resource = this.reference ? this.resources[this.reference] : {}

		return {
			isSuccess: false,
			visible: this.visibleCustomModal,
			permissions: {
				delete: DELETE_PERMISSION,
				edit: EDIT_PERMISSION,
				maintain: MAINTAIN_PERMISSION,
			},
			updatedBy: {
				firstName: '',
				lastName: '',
			},
			...resource,
		}
	},

	computed: {
		entity() {
			if (this.entityId) return this.crud.getEntity(this.entityId)
			return this.crud.getEntity()
		},

		isLoading() {
			const { namespace, REQUESTS_IS_LOADING } = RequestsTypes
			return this.$store.getters[`${namespace}/${REQUESTS_IS_LOADING}`]
		},

		toggleBtnText() {
			return this._.get(this.entity, 'isInactive') ? 'Activate' : 'Deactivate'
		},

		toggleBtnType() {
			return this._.get(this.entity, 'isInactive') ? 'primary' : 'danger'
		},

		hasMaintainPermission() {
			const { edit, maintain } = this.permissions
			return this.can(maintain) || this.can(edit)
		},
	},

	watch: {
		visibleCustomModal(newval) {
			this.visible = newval
		},

		async entity(newVal) {
			this.storeValues(newVal)
			if (this.redirectRoute) this.visible = true

			if (this.lastModifiedByName) {
				const { data } = await this.axios.get(
					`${this.apiUrl}/identities/ad/users/${newVal.updatedBy}`
				)

				this.updatedBy.firstName = data.firstName
				this.updatedBy.lastName = data.lastName
			}
		},
	},

	async mounted() {
		if (!this.entity || this.isFetchEntityById) {
			await this.fetchEntity()
		} else {
			this.storeValues()
		}

		if (this.redirectRoute) this.visible = true
	},

	methods: {
		fetchEntity() {
			this.crud.fetchEntity(this.customUrl)
		},

		getValue(key) {
			if (this._.isNil(key)) return

			if (!key.includes(',')) return this.entity[key]

			const objKeys = key.split(',')
			const value = {}

			objKeys.forEach((key) => (value[key] = this.entity[key]))

			return value
		},

		onChange(value, resourceKey) {
			this.storeValue(value, resourceKey)

			this.keyReceiveEvent.forEach((key) => {
				if (key === resourceKey) {
					this.$emit('change', { [resourceKey]: value })
				}
			})
		},

		storeValue(value, resourceKey) {
			if (!resourceKey.includes(',')) {
				const field = this.fields.find((field) => field.key == resourceKey)
				this.crud.updateEntity('editForm', {
					resourceKey,
					value: field && field.parseValue ? field.parseValue(value) : value,
				})

				return
			}

			const resourceKeys = resourceKey.split(',')

			resourceKeys.forEach((key) =>
				this.crud.updateEntity('editForm', {
					resourceKey: key,
					value: value[key],
				})
			)
		},

		storeValues(entity = this.entity) {
			if (entity) {
				Object.entries(this.entity).forEach(([key, value]) =>
					this.storeValue(value, key)
				)
			}
		},

		async submit() {
			await this.crud.submitEntity('replace', this.customUrl)
			await this.crud.fetchList(this.customListUrl)
			this.visible = false
		},

		async toggleActive() {
			await this.crud
				.submitPartialEntity({
					resourceName: this.resourceName,
					id: this.entity.id,
					customUrl: this.customUrl
						? this.isFetchEntityById
							? `${this.customUrl}`
							: `${this.customUrl}/${this.entity.id}`
						: null,
					data: [
						{
							op: 'replace',
							path: '/IsInactive',
							value: !this.entity.isInactive,
						},
					],
				})
				.then(() => (this.isSuccess = true))

			this.visible = false
		},

		afterModalClose() {
			this.crud.clearEntity('editForm')

			if (this.isSuccess) {
				this.crud.fetchList(this.customListUrl)
			}

			if (this.customRedirectRoute) {
				this.$router.push(this.customRedirectRoute)
				return
			}

			if (!this.redirectRoute) {
				this.$emit('update:visible-custom-modal', false)
				return
			}

			this.$router.push(this.customRedirectRoute || this.redirectRoute)
		},

		onCancel() {
			this.visible = false
		},

		onToggleActiveClick(e, customTitle = null, customIcon = null) {
			let icon, okType, title

			if (this.entity.isInactive) {
				title = 'Do you want to Activate this item?'
				icon = 'eye'
				okType = 'primary'
			} else {
				title = customTitle
					? customTitle
					: 'Do you want to Deactivate this item?'
				icon = customIcon ? customIcon : 'eye-invisible'
				okType = 'danger'
			}

			this.$confirm({
				class: 'list__modal-confirm',
				icon,
				title,
				cancelText: 'No',
				okText: 'Yes',
				okType,
				onOk: this.toggleActive,
			})
		},

		onDeleteClick() {
			let icon,
				okType,
				title,
				content,
				sourceDel = '',
				sourceLabelDel = ''

			if (this.configDelete) {
				sourceDel = this.configDelete.source
					? `"${this.entity[this.configDelete.source]}"`
					: ''
				sourceLabelDel = this.configDelete.sourceLabel || ''
				icon = this.configDelete.icon
			}

			if (this.entity.id) {
				title = `Do you want to Delete ${sourceLabelDel} ${sourceDel}?`
				content = `If you click Yes, you won’t be able to undo this Delete operation. Are you sure you want delete ${sourceLabelDel} ${sourceDel}?`
				okType = 'danger'
			}

			this.$confirm({
				class: 'list__modal-delete',
				icon: icon || 'warning',
				title,
				content,
				cancelText: 'Cancel',
				okText: 'Delete',
				okType,
				onOk: this.onDestroyEntity(),
			})
		},

		onDestroyEntity() {
			const customUrlDel = this.customUrl
				? `${this.customUrl}/${this.entity.id}`
				: null

			return () =>
				this.crud
					.destroyEntity(customUrlDel, this.entity.id)
					.then(() => {
						this.visible = false
						this.isSuccess = true
					})
					.catch((error) => console.log(error))
		},
	},
}
</script>

<style lang="scss" scoped>
.edit-modal {
	&__last-modified {
		color: #92a0b0;
		font-size: 12px;
	}
}
</style>
