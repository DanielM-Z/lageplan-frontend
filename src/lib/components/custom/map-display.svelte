<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { RectangleBounds } from '$lib/types/rectangle-bounds';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-draw/dist/leaflet.draw.css';

	interface Props {
		rectangleCallback: (rectangle: RectangleBounds | null) => void;
	}

	// Update parent when rectangle changes
	let { rectangleCallback }: Props = $props();

	// Simple helper function to generate RectangleBounds
	function getRectangleBounds(bounds: L.LatLngBounds, map: L.Map): RectangleBounds {
		map.distance(bounds.getSouthWest(), bounds.getSouthEast());
		const width = map.distance(bounds.getSouthWest(), bounds.getSouthEast()) / 1000;
		const height = map.distance(bounds.getSouthWest(), bounds.getNorthWest()) / 1000;
		const area = width * height;
		const res: RectangleBounds = {
			north: bounds.getNorth(),
			east: bounds.getEast(),
			south: bounds.getSouth(),
			west: bounds.getWest(),
			heightKm: height,
			widthKm: width,
			areaKm: area
		};
		return res;
	}

	onMount(async () => {
		const { default: L } = await import('leaflet');
		// @ts-ignore
		await import('leaflet-draw');

		// Initialize the base map
		const osmMapnik = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			noWrap: true
		});

		const lowerSaxonyBounds = L.latLngBounds(
			L.latLng(52.28181, 9.50283), // Southwest corner
			L.latLng(52.48487, 10.00477) // Northeast corner
		);

		// Load the map
		const map = L.map('map', {
			layers: [osmMapnik]
		}).fitBounds(lowerSaxonyBounds);

		// Add an editable layer to the map
		const drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		// Add drawing controls to the map
		// @ts-ignore
		const drawControl = new L.Control.Draw({
			draw: {
				polygon: false,
				circle: false,
				marker: false,
				polyline: false,
				rectangle: {
					shapeOptions: {
						color: 'black', // Set the rectangle color to black
						weight: 2
					}
				} // Enable rectangle drawing
			}
			// edit: {
			// 	featureGroup: drawnItems // Enable editing of drawn items
			// }
		});
		map.addControl(drawControl);

		let currentRectangle: L.Rectangle | null = null;

		// Handle the draw:created event
		map.on('draw:created', (event: any) => {
			const layer = event.layer;

			// If the layer is a rectangle
			if (layer instanceof L.Rectangle) {
				// Remove the previous rectangle if one exists
				if (currentRectangle) {
					drawnItems.removeLayer(currentRectangle);
				}

				// Add the new rectangle to the drawn items layer
				drawnItems.addLayer(layer);
				currentRectangle = layer;

				// Notify parent
				const bounds = getRectangleBounds(layer.getBounds(), map);
				rectangleCallback(bounds);
			}
		});
	});
</script>

{#if browser}
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
{/if}
<div class="h-full w-full rounded-lg" id="map"></div>
