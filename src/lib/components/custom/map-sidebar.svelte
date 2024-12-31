<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '../ui/separator/separator.svelte';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import type { DownloadRequestSettingsDef } from '$lib/api/endpoints';
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		height: number;
		width: number;
		genSettings: DownloadRequestSettingsDef ;
		currentlyDownloading: false;
		buttonCallback: () => void;
	}
	let { height, width, genSettings = $bindable(), currentlyDownloading,buttonCallback,  }: Props = $props();

	interface CheckboxItem {
		text: string,
		checked: boolean
	}

	// Doesnt need to be a state since it updates itself anyways (I think)
	let checkboxItems: { [name: string] : CheckboxItem; } = {};

	// This toggles the boolean with the given key
	function checkBoxPressed(key: string){
		checkboxItems[key].checked = !checkboxItems[key].checked;
		genSettings ={
			contours: checkboxItems["contours"].checked, 
			buildings_3d: checkboxItems["objects_3d"].checked, 
			streets: checkboxItems["streets"].checked, 
			hatch: checkboxItems["hatch"].checked, 
			aerial_view: checkboxItems["aerial"].checked, 
			area_txt: checkboxItems["area_txt"].checked
		};
	}
	// This feels bad but works well enough so I let it be.
	checkboxItems["contours"] = {text: "Contours", checked: genSettings.contours};
	checkboxItems["objects_3d"] = {text: "3D Buildings", checked: genSettings.buildings_3d};
	checkboxItems["streets"] = {text: "Streets / Roads / Rivers", checked: genSettings.streets};
	checkboxItems["hatch"] = {text: "Buildings Hatch", checked: genSettings.hatch};
	checkboxItems["aerial"] = {text: "Aerial View", checked: genSettings.aerial_view};
	checkboxItems["area_txt"] = {text: "Area Txt", checked: genSettings.area_txt};

</script>

<div class="mr-3 hidden flex-col gap-8 md:flex">
	<form class="grid w-full gap-6">
		<fieldset class="grid gap-6 rounded-lg border p-4">
			<legend class="-ml-1 px-1 text-sm font-medium"> Download </legend>
			<div class="grid gap-3">
				<!-- <Button onclick={()=>{console.log(checkboxItems)}}>Hi</Button> -->
				<Label for="model">Export settings</Label>
				<div class="pl-1">
					{#each Object.keys(checkboxItems) as key}
					<div class="items-top flex space-x-2 pb-1">
						<!-- Disable the buttons when downloading -->
						<Checkbox checked={checkboxItems[key].checked} onCheckedChange={() => checkBoxPressed(key)} disabled = {currentlyDownloading}/>
						
							<div class="grid gap-1.5 leading-none">
						<p class="text-muted-foreground text-sm">
							{checkboxItems[key].text}
						</p>
						</div>
					</div>
					{/each}
				</div>
				
			<div class="flex items-center justify-center space-x-4 text-sm">
				<div>Width: {width.toFixed(2)}km</div>
				<Separator orientation="vertical" />
				<div>Height: {height.toFixed(2)}km</div>
				<Separator orientation="vertical" />
				<div class={width * height > 1 ? 'text-red-400' : ''}>
					Area: {(width * height).toFixed(2)}km²
				</div>
			</div>
		</fieldset>
	</form>
	<div class="">
		{#if currentlyDownloading}
		<Button disabled class="w-full" variant="secondary">
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Downloading...
		  </Button>
		{:else}
		<Button variant="secondary" class="w-full" on:click={buttonCallback}>Download</Button>
		{/if}
		
	</div>
</div>
