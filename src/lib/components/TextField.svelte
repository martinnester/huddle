<script lang="ts" generics="Value extends RemoteFormFieldValue">
	import type { RemoteFormField, RemoteFormFieldValue } from '@sveltejs/kit';
	import * as changeCase from 'change-case';
	import { slide } from 'svelte/transition';

	const {
		label,
		type,
		field
	}: {
		label: string;
		type: (as: RemoteFormField<Value>['as']) => ReturnType<RemoteFormField<Value>['as']>;
		field: RemoteFormField<Value>;
	} = $props();
	const id = $derived(changeCase.kebabCase(label));
</script>

<section class="field" transition:slide|local>
	<div class="label-wrapper">
		<label for={id}>{label}</label>
	</div>
	<input {id} placeholder=" " {...type(field.as)} />
	<ul>
		{#each field.issues() as issue (issue.path)}
			<li>• <small>{issue.message}</small></li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@use '../styles/utils.scss' as *;
	@use '../styles/vars.scss' as *;
	section.field {
		@include section();
		display: flex;
		flex-direction: column;

		$border-width: var(--border-width);
		@include focus-outline-transition();

		//?? can I auto remove this layer of indirection
		$spacing: var(--spacing);
		//if border radius was increased then it may cut into the text. adding it horizontally (or vertically) to the padding ensures this doesn't happen
		$border-radius: var(--border-radius);
		$label-focus-height: 0.75em;
		$label-blur-height: 1em;
		$input-height: 1em;
		$outline-alpha: 0.25;
		$input-top-padding: calc($spacing-vertical + $label-focus-height + $spacing-vertical);
		$blur-padding: calc(
			(($input-top-padding + $spacing-vertical + $input-height) - $label-blur-height) / 2
		);

		@include amp(':focus') {
			@include focus-outline(var(--accent));
		}
		input:not(:focus) {
			user-select: none;
		}
		@include amp(':focus, #{$invalid}') {
			&:not(:first-child) {
				margin-top: calc($border-width * -0.5);
			}
			&:not(:last-child) {
				margin-bottom: calc($border-width * -0.5);
			}
		}
		@include amp('#{$invalid}:focus') {
			@include focus-outline(var(--intent-danger));
		}
		@include amp('#{$invalid}') {
			background-color: transparent(var(--intent-danger), 0.1);

			border-color: color-mix(in oklab, var(--intent-danger) 50%, var(--background));
			label {
				color: var(--intent-danger);
			}
		}
		@mixin label-wrapper($when-input-is) {
			@include amp($when-input-is) {
				.label-wrapper {
					@content;
				}
			}
		}

		@include label-wrapper('*') {
			//+subtract 0.1em to adjust for most letters being lowercase and not actually looking centered vertically
			padding: calc($blur-padding - 0.1em) $spacing-horizontal;
			//-
			//+put on top
			position: absolute;
			left: 0;
			top: 0;
			//-
			@include transition(padding-top);
			//+ disable interactoins
			user-select: none;
			pointer-events: none;
			//-
			label {
				@include transition((font-size, color));
				display: block;
				box-sizing: border-box;
				font-size: $label-blur-height;
			}
		}

		@include label-wrapper(':not(:placeholder-shown), :focus') {
			padding-top: $spacing-vertical;
			label {
				font-size: $label-focus-height;
			}
		}
		@include label-wrapper(':not(#{$invalid})') {
			label {
				color: transparent(var(--foreground), 0.4);
			}
		}

		@include label-wrapper(':focus:not(#{$invalid})') {
			label {
				color: var(--accent);
			}
		}

		input {
			font-size: 1em;
			border: none;
			outline: none;
			padding: $spacing-vertical $spacing-horizontal;
			padding-top: $input-top-padding;
			background-color: transparent;
			color: inherit;
		}
		ul {
			&:empty {
				display: none;
			}
			list-style: none;
			padding: $spacing-vertical $spacing-horizontal;
			padding-top: 0;
			color: var(--intent-danger);
			margin: 0;
		}
	}
</style>
