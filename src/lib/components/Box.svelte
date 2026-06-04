<script lang="ts">
	import type { Snippet } from 'svelte';

	import { slide } from 'svelte/transition';
	const { children }: { children: Snippet<[]> } = $props();
</script>

<section class="box" transition:slide|local>
	{@render children()}
</section>

<style lang="scss">
	@use '../styles/utils.scss' as *;
	@use '../styles/vars.scss' as *;

	section.box {
		@include section();

		padding: $spacing-vertical $spacing-horizontal;
	}
</style>
