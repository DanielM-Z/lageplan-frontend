<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import NavBar from '$lib/components/custom/nav-bar.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Box from 'lucide-svelte/icons/box';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import type { NavItem } from '$lib/types/nav-item';
	let { children } = $props();
	

	let navItems: NavItem[] = [
		{
			label: 'Main',
			path: '/',
			icon: Box
		},
		{
			label: 'Settings',
			path: '/settings',
			icon: Settings2
		}
	];
</script>

<Toaster />
<!-- <ModeWatcher /> -->
<NavBar title="Geo-Mapper" {navItems}>{@render children()}</NavBar>
