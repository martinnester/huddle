<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style lang="scss">
	@use '../lib/styles/utils.scss' as *;
	:global(body) {
		--accent: oklch(60% 0.25 200);
		--spacing: 0.35em;
		--border-radius: 0.5em;
		--intent-danger: #e65140;
		--foreground: #1f1f1f;
		--background: white;
		--border-width: 1px;
		@media (prefers-color-scheme: dark) {
			--foreground: white;
			--background: #1f1f1f;
		}
		&::selection {
			background-color: var(--accent); /* Changes the highlight background */
			color: var(--background); /* Changes the text color itself */
		}
		:global(.lucide) {
			/* Change this! */
			color: currentColor;
			width: 1em;
			height: 1em;
			stroke-width: 2.5;
			vertical-align: middle;
		}
		background-color: var(--background);
		$base-color: color-mix(in oklab, var(--accent) 20%, var(--background));

		$start-color: oklch(from $base-color l c calc(h + 20) / alpha);
		$end-color: oklch(from $start-color l c calc(h - 50) / alpha);
		background: linear-gradient(30deg, $start-color 0%, $end-color 100%);

		overflow: hidden;
		color: var(--foreground);
		margin: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
			'Helvetica Neue', sans-serif;
	}
</style>
