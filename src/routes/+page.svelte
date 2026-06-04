<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import type { PageProps } from './$types';
	import { login } from './login.remote';
	import LogIn from '@lucide/svelte/icons/log-in';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import { m } from '$lib/paraglide/messages.js';
	import { signup } from './signup.remote';
	import Box from '$lib/components/Box.svelte';
	import { fade } from 'svelte/transition';
	let { data: session }: PageProps = $props();
	let form = $state.raw<typeof login | typeof signup>(login);
	const switchToSignup = (e: MouseEvent) => {
		e.preventDefault();
		form = signup;
	};

	$effect(() => {
		signup.fields.username.set(login.fields.username.value());
	});
	$effect(() => {
		signup.fields.password.set(login.fields.password.value());
	});

	$effect(() => {
		login.fields.username.set(signup.fields.username.value());
	});
	$effect(() => {
		login.fields.password.set(signup.fields.password.value());
	});
	const user = $derived(session.user ?? login.result ?? signup.result);
</script>

{#if !user}
	<h2>{form === login ? m.login_heading() : m.signup()}</h2>
	<form {...form}>
		<TextField field={form.fields.username} label={m.username()} type={(as) => as('text')} />
		<TextField field={form.fields.password} label={m.password()} type={(as) => as('password')} />
		{#if form === signup}
			<TextField
				field={signup.fields.confirmPassword}
				label="Confirm Password"
				type={(as) => as('password')}
			/>
		{/if}

		{#if login.result === null && form === login}
			<Box>
				<small style="color: var(--intent-danger);"><CircleAlert /> {m.invalid_login()}</small>
			</Box>
		{/if}
		{#if form === signup}
			<Button
				onclick={(e) => {
					e.preventDefault();
					form = login;
				}}>Cancel</Button
			>
		{/if}
		{#if form === login}
			<Button onclick={switchToSignup}><UserPlus />{m.signup()}</Button>
		{:else}
			<Button
				onclick={(e) => {
					e.preventDefault();
					signup.submit();
				}}
				intent="primary"><UserPlus />{m.signup()}</Button
			>
		{/if}

		{#if form === login}
			<Button
				onclick={(e) => {
					e.preventDefault();
					login.submit();
				}}
				intent="primary"><LogIn />{m.login()}</Button
			>
		{/if}
	</form>
{:else}
	<pre>
    {JSON.stringify(user, null, 4)}
</pre>
{/if}

<style lang="scss">
	form {
		width: 20em;
		min-width: 20em;
		display: flex;
		flex-direction: column;
	}
</style>
