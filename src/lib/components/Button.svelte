<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		onclick,
		children,
		intent = 'secondary'
	}: {
		onclick: MouseEventHandler<HTMLButtonElement>;
		children: Snippet;
		intent?: 'primary' | 'secondary';
	} = $props();
</script>

<button class={intent} {onclick}>
	{@render children()}
</button>

<style lang="scss">
	@use '../styles/utils.scss' as *;
	@use '../styles/vars.scss' as *;
	button {
		font-size: 1em;
		color: var(--foreground);
		padding: $spacing-vertical $spacing-horizontal;
		border-width: var(--border-width);
		border-style: solid;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing);

		@include focus-outline-transition();
		&.primary {
			border-color: transparent(var(--accent), 0.75);
			background-color: transparent(var(--accent), 0.75);
		}
		&.secondary {
			border-color: transparent(var(--foreground), 0.075);
			background-color: transparent(var(--foreground), 0.075);
		}
		@include round-ends();
		&:hover {
			cursor: pointer;
		}
		&:focus-visible {
			@include focus-outline(var(--accent));
		}
	}
</style>
