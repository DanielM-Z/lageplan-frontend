<script lang="ts">
	import { apiRequest } from '$lib/api/client';
	import { API_ENDPOINTS } from '$lib/api/endpoints';
	import MapSidebar from '$lib/components/custom/map-sidebar.svelte';
	import MapDisplay from '$lib/components/custom/map-display.svelte';
	import type { RectangleBounds } from '$lib/types/rectangle-bounds';
	import { toast } from 'svelte-sonner';

	// Variable to hold the rectangle
	let rectangleDim: RectangleBounds | null = $state(null);

	function rectangleCallback(bounds: RectangleBounds | null) {
		if (bounds) {
			rectangleDim = bounds;
		}
	}

	// This calls the backend with the selected region to generate the files.
	async function callBackend() {
		if (rectangleDim == null) {
			toast.error('No region selected');
			return;
		}

		try {
			const requestBody = {
				southWestLat: rectangleDim.south,
				southWestLon: rectangleDim.west,
				northEastLat: rectangleDim.north,
				northEastLon: rectangleDim.east
			};
			await apiRequest(API_ENDPOINTS.GENERATE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});
			return;
		} catch (error) {
			return { error: 'Failed to execute test' };
		}
	}
</script>

<div class="flex h-full flex-row">
	<div class="w-96">
		<MapSidebar
			width={rectangleDim?.widthKm ?? 0}
			height={rectangleDim?.heightKm ?? 0}
			buttonCallback={callBackend}
		/>
	</div>
	<div class="flex-1 p-2">
		<MapDisplay {rectangleCallback} />
	</div>
</div>
