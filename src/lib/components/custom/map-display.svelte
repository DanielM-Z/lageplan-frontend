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
		await import('$lib/plugin/editable/Leaflet.Editable');
		// @ts-ignore
		await import('leaflet.path.drag/src/Path.Drag');

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
			layers: [osmMapnik],
			// @ts-ignore
			editable: true
		}).fitBounds(lowerSaxonyBounds);

		// @ts-ignore
		L.EditControl = L.Control.extend({
			options: {
				position: 'topleft',
				callback: null,
				kind: '',
				html: ''
			},
			onAdd: function (map: L.Map) {
				var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
					link = L.DomUtil.create('a', '', container);
				link.href = '#';
				link.title = 'Create a new ' + this.options.kind;
				link.innerHTML = this.options.html;
				L.DomEvent.on(link, 'click', L.DomEvent.stop)
					.on(link, 'click', function () {
						// @ts-ignore
						window.LAYER = this.options.callback.call(map.editTools);
					}, this);
				return container;
			}
		});

		// @ts-ignore
		L.NewRectangleControl = L.EditControl.extend({
			options: {
				position: 'topleft',
				// @ts-ignore
				callback: map.editTools.startRectangle,
				kind: 'rectangle',
				html: '⬛'
			}
		});

		// @ts-ignore
		map.addControl(new L.NewRectangleControl());

		// Add an editable layer to the map
		const drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		let currentRectangle: L.Rectangle | null = null;


		map.on('editable:drawing:end', (event: any) => {
			const layer = event.layer;

			// If the layer is a rectangle
			if (layer instanceof L.Rectangle) {
				// Remove the previous rectangle if one exists
				if (currentRectangle) {
					drawnItems.removeLayer(currentRectangle);
					// Optionally, remove previous listeners to avoid duplicates
					currentRectangle.off('dragend');
					currentRectangle.off('editable:editing');
				}

				// Add the new rectangle to the drawn items layer
				drawnItems.addLayer(layer);
				currentRectangle = layer;

				if (currentRectangle) {

					currentRectangle.on('editable:editing', () => { 
						console.log('editable:editing event triggered');
						const bounds = getRectangleBounds(currentRectangle!.getBounds(), map);
						rectangleCallback(bounds);
					});
					if (currentRectangle) {
					currentRectangle.on('dragend', () => {
						// Update the parent with the final bounds
						const bounds = getRectangleBounds(currentRectangle!.getBounds(), map);
						rectangleCallback(bounds);
					});
				}
					const bounds = getRectangleBounds(currentRectangle!.getBounds(), map);
						rectangleCallback(bounds);
				}
			}
		});
	});
</script>

{#if browser}
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
{/if}
<div class="h-full w-full rounded-lg" id="map" style="z-index: 0;"></div>