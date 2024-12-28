import type { ComponentType } from 'svelte';
import { type Icon } from 'lucide-svelte';
// NavItem is passed to the nav-bar to display an icon with
// additional information.
export interface NavItem {
	label: string;
	path: string;
	icon: ComponentType<Icon>;
}
