<script lang="ts">
	import Box from 'lucide-svelte/icons/box';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import SquareUser from 'lucide-svelte/icons/square-user';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { NavItem } from '$lib/types/nav-item';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import * as HoverCard from "$lib/components/ui/hover-card/index.js";

	interface Props {
		children: any;
		title: string;
		navItems: NavItem[];
	}
	let { children, title, navItems }: Props = $props();
</script>

<div class="grid h-screen w-full pl-[53px]">
	<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
		<div class="border-b p-2">
			<Button variant="outline" size="icon" aria-label="Home">
				<Box class="fill-foreground size-5" />
			</Button>
		</div>
		<div class="grid gap-1 p-2">
			{#each navItems as navItem}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button
							variant="ghost"
							size="icon"
							class="rounded-lg {page.url.pathname === navItem.path ? 'bg-muted' : ''}"
							aria-label={navItem.label}
							builders={[builder]}
							on:click={() => {
								console.log(navItem.path);
								goto(navItem.path);}
								}
						>
							<navItem.icon />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" sideOffset={5}>{navItem.label}</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
		<nav class="mt-auto grid gap-1 p-2">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="mt-auto rounded-lg"
						aria-label="Account"
						builders={[builder]}
					>
						<SquareUser class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Account</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col">
		<header class="bg-background fixed top-0 z-10 flex h-[57px] md:items-center border-b pl-4 w-full">
			<h1 class="text-xl font-semibold pr-4">{title}</h1>
		<HoverCard.Root>
			<HoverCard.Trigger>
			<Badge variant="secondary" style="pointer-events: none;">Beta</Badge>
			</HoverCard.Trigger>
			<HoverCard.Content class="w-80">
			<div class="flex justify-between space-x-4">
				<div class="space-y-1">
				<p class="text-sm">This website is still under heavy development. Outages are to be expected.</p>
				</div>
			</div>
			</HoverCard.Content>
		</HoverCard.Root>
			
		</header>
		<!-- This is wanky as shit but works. This is the same height as the top bar -->
		<div class="h-[57px]"></div>
		<!-- Render children -->
		<main class="flex-1 px-4 py-3">{@render children()}</main>
	</div>
</div>
