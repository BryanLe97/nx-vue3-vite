<template>
	<div class="list-changelog">
		<a-row v-if="title" class="list__title pt-2 pb-4">
			<a-col v-if="title" :span="16">
				<h2 class="mb-0">{{ title }}</h2>
			</a-col>

			<a-col class="list__add-btn" :offset="title ? 0 : 12" :span="8">
				<slot name="create-buttons">
					<a-button type="primary" @click="onAddClick">
						{{ `Add ${title}` }}
					</a-button>
				</slot>
			</a-col>
		</a-row>

		<div v-if="listChangelog.length > 0" class="list__table p-5">
			<a-card class="bg-white">
				<template v-for="changelog in listChangelog" :key="changelog.id">
					<a-row
						type="flex"
						align="middle"
						justify="start"
						:gutter="[0, 8]"
						class="version-item"
					>
						<a-card class="mb-2">
							<a-col :span="24">
								<div class="d-flex align-items-center flex-wrap w-100">
									<h5 :key="changelog.versionNumber" class="pr-3 m-0 h5">
										{{ changelog.versionNumber }}
									</h5>
									<span :key="changelog.releaseDate" class="sub-color">
										{{ moment(changelog.releaseDate, 'DD/MM/YYYY') }}
									</span>
								</div>
							</a-col>
							<a-col>
								<div v-if="!isMultiTag(changelog.tag)">
									<tag-field
										:key="changelog.tag"
										:value="changelog.tag"
										color="gray"
									/>
								</div>
								<div v-else>
									<template v-for="tag in parseMultiTag(changelog.tag)">
										<template
											v-for="tag in parseMultiTag(changelog.tag)"
											:key="tag"
										>
											<tag-field :value="tag" color="gray" />
										</template>
									</template>
								</div>
							</a-col>
							<a-col :span="24">
								<div class="desc" v-html="changelog.description"></div>
							</a-col>
						</a-card>
					</a-row>
				</template>
			</a-card>
		</div>
		<a-card v-if="!isComplete && listChangelog.length > 0" key="infinite">
			<infinite-loading @infinite="onInfinite" />
		</a-card>
	</div>
</template>

<script>
export default {
	name: 'ListChangelog',
	inject: ['crud', 'createRoute'],

	data() {
		return {
			title: 'Changelog',
			isComplete: false,
			isRendered: false,
		}
	},

	computed: {
		listChangelog() {
			return this.crud.getList() || []
		},

		pagination() {
			return this.crud.getPagination() || {}
		},

		showTotalItems(total, range) {
			return `Viewing ${range[0]}-${range[1]} of ${total}`
		},
	},

	created() {
		this.crud.deleteFilter('IsInactive')
		this.crud.setPagination({ page: 1 })
		this.crud.fetchList()
	},

	methods: {
		onAddClick() {
			this.$router.push(this.createRoute)
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

		parseMultiTag(value) {
			if (!value.includes(',')) return value
			return value.split(',')
		},

		isMultiTag(value) {
			return value.includes(',')
		},
	},
}
</script>

<style lang="scss" scoped>
.list-changelog {
	width: 100%;
	.bg-white {
		background: white;
	}

	.sub-color {
		color: #92a0b0;
	}

	:deep(.ant-row-flex.version-item) {
		.ant-card {
			width: 100%;
			&.ant-card-bordered {
				border: 0;
			}
		}
	}

	.desc {
		:deep(ul, ol) {
			padding-left: 16px;
			margin-bottom: 0px;
		}
	}
}
</style>
