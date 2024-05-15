<script>
	import { Router, Route } from 'svelte-routing';
	import Intro from './pages/Intro.svelte';
	import CharacterSelection from './pages/CharacterSelection.svelte';
	import Map from './pages/Map.svelte';
	import Game from './pages/Game.svelte';


  if (window.disableDoubleTapToZoom !== true) {
    const elm = document.body; // or some selection of the element you want to disable
    let doubleTouchStartTimestamp = 0;
    const catcher = function(evt) {
        const now = +(new Date());
        if (doubleTouchStartTimestamp + 1000 > now) {
            event.preventDefault();
        }
        doubleTouchStartTimestamp = now;
    };
    elm.addEventListener('touchstart', catcher, true);


    let last_touch_end = 0;
    document.addEventListener("touchend", function (e) {
      const now = (new Date()).getTime();
      if (now - last_touch_end <= 300) {
          e.preventDefault();
      }
      last_touch_end = now;
    }, false);

    window.disableDoubleTapToZoom = true;
  }


</script>

<Router>
	<Route path="/" component="{Intro}" />
	<Route path="/character-selection" component="{CharacterSelection}" />
	<Route path="/map" component="{Map}" />
	<Route path="/game" component="{Game}" />
</Router>
