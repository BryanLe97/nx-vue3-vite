<template>
	<div
		:class="[
			'application-card',
			'd-flex',
			'flex-column',
			{ disabled: app.disabled || app.isComingSoon },
			{ hidden: app.hidden },
		]"
		:style="{
			backgroundImage: `linear-gradient(${app.color},${app.color}),url(${apiUrl}${app.image})`,
		}"
	>
		<div class="d-flex justify-content-between mb-auto">
			<div>
				<p class="m-0">{{ app.title }}</p>
				<h5>
					{{ app.name }}
					<p v-if="app.isComingSoon" class="neutral-3--text">
						({{ $t('app_portal.coming_soon') }})
					</p>
				</h5>

				<h5 class="neutral-3--text text-lowercase">
					{{ app.ciNumber }}
				</h5>
			</div>

			<div>
				<a-rate
					:count="1"
					:value="app.userId ? 1 : 0"
					:disabled="app.disabled || app.isComingSoon"
					@change="onBookmarkChange"
				/>
			</div>
		</div>

		<span class="description neutral-1--text mb-4">{{ app.description }}</span>

		<div class="d-flex justify-content-between">
			<!-- <a-button
        type="primary"
        style="width: 110px;"
        :disabled="app.disabled || app.isComingSoon || env == 'staging'"
        @click="launchApp(app.launchUrl)"
      >
        Launch Prod
      </a-button> -->

			<a-button
				type="primary"
				style="width: 100px"
				:disabled="app.disabled || app.isComingSoon || env == 'staging'"
				@click="launchApp(app.launchUrl, app.code)"
			>
				{{ $t('app_portal.launch') }}
				<SelectOutlined class="ml-2" />
			</a-button>

			<a-button
				type="link"
				style="width: 100px; color: white"
				:disabled="
					app.disabled || app.isComingSoon || !app.testUrl || env == 'prod'
				"
				@click="launchApp(app.testUrl, app.code)"
			>
				{{ $t('app_portal.launch_test') }}
			</a-button>
		</div>
	</div>
</template>

<script>
import { AuthTypes } from '@kraftheinz/common'

const env = import.meta.env.VITE_API_URL

export default {
	name: 'ApplicationCard',

	props: {
		app: {
			type: Object,
			required: true,
		},
		version: {
			type: String,
			default: undefined,
		},
	},

	data() {
		return {
			apiUrl: import.meta.env.VITE_API_URL,
			env,
		}
	},

	computed: {
		userInfo() {
			const { namespace, AUTH_GET_USER } = AuthTypes
			return this.$store.getters[`${namespace}/${AUTH_GET_USER}`]
		},
	},

	methods: {
		async launchApp(url, appCode) {
			window.open(url, '_blank')
			await this.axios.post(
				`${this.apiUrl}/identities/common/sitevisitors?appCode=${appCode}`
			)
		},

		onBookmarkChange(value) {
			this.$emit('bookmark', value)
		},
	},
}
</script>

<style lang="scss">
.application-card {
	position: relative;
	width: 310px;
	height: 310px;
	margin: 12px;
	padding: 32px;
	border-radius: 2px;
	transition: all 0.3s ease;

	background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
	background-blend-mode: multiply;

	&.disabled {
		filter: grayscale(1);
	}

	&.hidden {
		opacity: 0;
		width: 0;
		padding: 0;
		margin: 0;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		border-radius: 2px;
		box-shadow: 0px 5px 30px rgba(7, 29, 64, 0.5);
		opacity: 0;
		transition: all 0.3s ease;
	}

	&:hover {
		transform: translateY(-4px);

		&::after {
			opacity: 1;
		}
	}

	p {
		font-weight: bold;
		font-size: 14px;
		color: #99c0ff;
		text-transform: uppercase;
	}

	h5 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #fff;
		text-transform: capitalize;
	}

	:deep(.ant-btn-primary:hover) {
		border-color: #fff;
		background-color: #fff;
		color: #0062ff;
	}

	.description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
}
</style>
