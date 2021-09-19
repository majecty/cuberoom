<script>
	import { Router, Route } from 'svelte-routing';
	import Intro from './pages/Intro.svelte';
	import CharacterSelection from './pages/CharacterSelection.svelte';
	import Map from './pages/Map.svelte';
	import Game from './pages/Game.svelte';
</script>

<Router>
	<Route path="/" component="{Intro}" />
	<Route path="/character-selection" component="{CharacterSelection}" />
	<Route path="/map" component="{Map}" />
	<Route path="/game" component="{Game}" />
</Router>
