<script lang="ts">
	import Rabbit from 'lucide-svelte/icons/rabbit';
	import Bird from 'lucide-svelte/icons/bird';
	import Turtle from 'lucide-svelte/icons/turtle';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '../ui/separator/separator.svelte';
	import { derived } from 'svelte/store';

	interface Props {
		height: number;
		width: number;
		buttonCallback: () => void;
	}
	let { height, width, buttonCallback }: Props = $props();
</script>

<div class="mr-3 hidden flex-col gap-8 md:flex">
	<form class="grid w-full gap-6">
		<fieldset class="grid gap-6 rounded-lg border p-4">
			<legend class="-ml-1 px-1 text-sm font-medium"> Generate </legend>
			<div class="grid gap-3">
				<Label for="model">Model</Label>
				<Select.Root>
					<Select.Trigger id="model" class="items-start [&_[data-description]]:hidden">
						<Select.Value placeholder="Select a model" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="genesis">
							<div class="text-muted-foreground flex items-start gap-3">
								<Rabbit class="size-5" />
								<div class="grid gap-0.5">
									<p>
										Neural
										<span class="text-foreground font-medium"> Genesis </span>
									</p>
									<p class="text-xs" data-description>Our fastest model for general use cases.</p>
								</div>
							</div>
						</Select.Item>
						<Select.Item value="explorer">
							<div class="text-muted-foreground flex items-start gap-3">
								<Bird class="size-5" />
								<div class="grid gap-0.5">
									<p>
										Neural
										<span class="text-foreground font-medium"> Explorer </span>
									</p>
									<p class="text-xs" data-description>Performance and speed for efficiency.</p>
								</div>
							</div>
						</Select.Item>
						<Select.Item value="quantum">
							<div class="text-muted-foreground flex items-start gap-3">
								<Turtle class="size-5" />
								<div class="grid gap-0.5">
									<p>
										Neural
										<span class="text-foreground font-medium"> Quantum </span>
									</p>
									<p class="text-xs" data-description>
										The most powerful model for complex computations.
									</p>
								</div>
							</div>
						</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="temperature">Temperature</Label>
				<Input id="temperature" type="number" placeholder="0.4" />
			</div>
			<div class="flex items-center justify-center space-x-4 text-sm">
				<div>Width: {width.toFixed(2)}km</div>
				<Separator orientation="vertical" />
				<div>Height: {height.toFixed(2)}km</div>
				<Separator orientation="vertical" />
				<div class={width * height > 10 ? 'text-red-400' : ''}>
					Area: {(width * height).toFixed(2)}km²
				</div>
			</div>
		</fieldset>
	</form>
	<div class="">
		<Button variant="secondary" class="w-full" on:click={buttonCallback}>Generate files</Button>
	</div>
</div>
