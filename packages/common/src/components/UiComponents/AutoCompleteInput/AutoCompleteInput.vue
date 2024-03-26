<template>
	<div class="auto-complete-input">
		<validation-provider
			v-if="formItem"
			v-slot="slotProps"
			:name="label"
			:rules="rules"
		>
			<a-form-item
				:colon="false"
				has-feedback
				:help="slotProps.errors[0]"
				:label="label"
				:validate-status="resolveState(slotProps)"
			>
				<a-auto-complete
					v-model="inputValue"
					class="w-100"
					:placeholder="disabled ? '' : placeholder"
					option-label-prop="title"
					:disabled="disabled"
					@select="onSelect"
					@search="onSearch"
					@change="onChange"
					@dropdownVisibleChange="onDropdownVisibleChange"
				>
					<template slot="dataSource">
						<a-select-option
							v-for="option in options"
							:key="option[source]"
							:value="option[source]"
							:title="generateLabel(option)"
						>
							<div v-if="cols">
								<a-row :gutter="16">
									<a-col :span="6" class="divider-right">{{
										generateLabel(option)
									}}</a-col>

									<a-col
										v-for="(col, index) in cols"
										:key="col.name"
										:span="col.span"
										class="text-ellipsis"
										:class="index !== cols.length - 1 ? 'divider-right' : ''"
									>
										{{ option[col.name] }}
									</a-col>
								</a-row>
							</div>

							<template v-else>{{ generateLabel(option) }}</template>
						</a-select-option>

						<a-select-option v-if="lazy && !isComplete" key="infinite">
							<infinite-loading @infinite="onInfinite" />
						</a-select-option>
					</template>

					<a-input>
						<template #suffix>
							<a-icon
								v-if="!disabled && !loading && hasIconDown"
								type="down"
								:rotate="rotateIcon"
								class="certain-category-icon"
							/>

							<a-icon v-if="loading || isLoading" type="loading" />
						</template>
					</a-input>
				</a-auto-complete>
			</a-form-item>
		</validation-provider>

		<template v-else>
			<label v-if="label">{{ label }}</label>

			<a-auto-complete
				v-model="inputValue"
				class="w-100"
				:placeholder="disabled ? '' : placeholder"
				:disabled="disabled"
				@select="onSelect"
				@search="onSearch"
				@change="onChange"
				@dropdownVisibleChange="onDropdownVisibleChange"
			>
				<template slot="dataSource">
					<a-select-option
						v-for="option in options"
						:key="option[source]"
						:value="option[source]"
						:title="generateLabel(option)"
					>
						<div v-if="cols">
							<a-row :gutter="16">
								<a-col :span="6" class="divider-right">{{
									generateLabel(option)
								}}</a-col>

								<a-col
									v-for="(col, index) in cols"
									:key="col.name"
									:span="col.span"
									class="text-ellipsis"
									:class="index !== cols.length - 1 ? 'divider-right' : ''"
								>
									{{ option[col.name] }}
								</a-col>
							</a-row>
						</div>
						<template v-else>{{ generateLabel(option) }}</template>
					</a-select-option>
				</template>

				<a-input>
					<a-icon
						v-if="!disabled && !loading && hasIconDown"
						slot="suffix"
						type="down"
						:rotate="rotateIcon"
						class="certain-category-icon"
					/>
					<a-icon v-if="loading || isLoading" slot="suffix" type="loading" />
				</a-input>
			</a-auto-complete>
		</template>
	</div>
</template>

<script>
import _ from 'lodash'

import { FILTERS_STARTS_WITH } from '@/constants/index.js'
import createCrudProps from '@/utils/crud.bindings'

export default {
	name: 'AutoCompleteInput',

	props: {
		label: {
			type: String,
			default: '',
		},
		reference: {
			type: String,
			default: null,
		},
		searchBy: {
			type: String,
			default: '',
		},
		filterType: {
			type: String,
			default: FILTERS_STARTS_WITH,
		},
		dataSource: {
			type: Array,
			default: null,
		},
		source: {
			type: String,
			required: true,
		},
		sourceLabel: {
			type: [String, Function],
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		allInValue: {
			type: Boolean,
			default: false,
		},
		formItem: {
			type: Boolean,
			default: false,
		},
		rules: {
			type: [Object, String],
			default: '',
		},
		value: {
			type: [Number, String, Array],
			default: '',
		},
		hasPagination: {
			type: Boolean,
			default: false,
		},
		deleteFilter: {
			type: String,
			default: null,
		},
		lazy: {
			type: Boolean,
			default: false,
		},
		/** cols is list column label
		 * @field name (String): field name of a column
		 * @field span (Number): column width
		 * Ex: [{name: 'code', span: 8}, {name: 'description', span: 16}]
		 */
		cols: {
			type: Array,
			default: null,
		},
		customSearch: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		optionFilter: {
			type: Function,
			default: undefined,
		},
		apiNotGetPaging: {
			type: Boolean,
			default: false,
		},
		customUrl: {
			type: String,
			default: '',
		},
		customQuery: {
			type: String,
			default: '',
		},
		onlyCustomQuery: {
			type: Boolean,
			default: false,
		},
		hasIconDown: {
			type: Boolean,
			default: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		const data = {
			isComplete: false,
			searchTimeout: null,
			inputValue:
				this.value || this.value === 0 ? this.value.toString() : this.value,
			rotateIcon: 0,
			isLoading: true,
		}

		if (this.reference) {
			const crudProps = createCrudProps({
				resourceName: this.reference,
				resourceIdName: this.source,
				router: this.$router,
				store: this.$store,
			})

			Object.assign(data, crudProps)
		}

		return data
	},

	computed: {
		options() {
			if (this.reference) {
				let options = this.crud.getList()

				if (this.optionFilter) {
					return this.convertValueOptionToString(
						options.filter(this.optionFilter)
					)
				}

				return this.convertValueOptionToString(options)
			}

			if (this.optionFilter) {
				return this.convertValueOptionToString(
					this.dataSource.filter(this.optionFilter)
				)
			}

			return this.convertValueOptionToString(this.dataSource)
		},
	},

	watch: {
		value(newVal) {
			this.inputValue = newVal || newVal === 0 ? newVal.toString() : newVal
		},

		customQuery() {
			this.isLoading = true
			this.fetchList()
			this.isLoading = false
		},
	},

	async created() {
		this.isLoading = true

		if (this.searchBy && !this.dataSource) {
			this.crud.deleteFilter(this.searchBy)
		}

		this.isLoading = false
	},

	methods: {
		fetchList(refresh = true) {
			if (this.apiNotGetPaging) {
				this.crud.deletePagination()
			}

			if (this.deleteFilter) {
				this.crud.deleteFilter(this.deleteFilter)
			}

			return this.crud.fetchList(
				this.customUrl,
				refresh,
				true,
				this.customQuery,
				this.onlyCustomQuery
			)
		},

		convertValueOptionToString(array) {
			return array.map((item) => {
				item[this.source] = item[this.source].toString()
				return item
			})
		},

		onSearch: _.debounce(async function (value) {
			if (this.dataSource || this.customSearch) {
				this.$emit('search', value)
				return
			}

			if (!value) {
				if (this.reference) {
					this.crud.clearList()
				}
				return
			}

			if (this.reference) {
				if (this.searchBy.length === 0) return

				this.isLoading = true

				this.$emit('searchValueChange', value)

				const val = {
					operator: this.filterType,
					value,
				}

				if (this.deleteFilter) {
					this.crud.deleteFilter(this.deleteFilter)
				}

				this.crud.setFilter(this.searchBy, val)

				if (this.hasPagination) {
					this.crud.setPagination({ page: 1, pageSize: 10 })
				}

				await this.fetchList()
				this.isLoading = false
			}
		}, 500),

		onSelect(value) {
			this.handleEmitValue(value, 'select')
		},

		onChange: _.debounce(function (value) {
			this.handleEmitValue(value, 'change')
		}, 1000),

		handleEmitValue(value, type) {
			if (!this.allInValue) {
				this.$emit(type, value)
				return
			}

			const obj = this.options.find((item) => item[this.source] === value)

			this.$emit(type, obj)
		},

		resolveState({ errors }) {
			if (errors[0]) return 'error'
			return ''
		},

		generateLabel(option) {
			if (!this.sourceLabel) return option[this.source]
			if (typeof this.sourceLabel === 'string') return option[this.sourceLabel]

			return this.sourceLabel(option)
		},

		async onInfinite($state) {
			const { page, pageSize } = this.crud.getPagination()

			this.crud.setPagination({ page: page + 1, pageSize })

			const res = await this.crud.fetchList(undefined, false)

			if (res.data.length) {
				$state.loaded()
			} else {
				$state.complete()
				this.isComplete = true
			}
		},

		onBlur() {
			this.$emit('blur', '')
		},

		onDropdownVisibleChange(open) {
			if (open) {
				this.rotateIcon = 180
			} else {
				this.rotateIcon = 0
			}
			this.$emit('dropdownVisibleChange', open)
		},
	},
}
</script>

<style lang="scss" scoped>
.auto-complete-input {
	:deep(.certain-category-icon svg) {
		font-size: 12px;
		transition-duration: 0.3s;
		transition-property: transform;
	}
	:deep(.ant-select-auto-complete.ant-select .ant-input[disabled]) {
		color: #272d35;
	}
}
</style>
