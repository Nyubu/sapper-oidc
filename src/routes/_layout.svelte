<script context="module">
    export async function preload(page, session) {
      return session;
    }
  </script>

<script>
	import Tailwindcss from '../components/Tailwindcss.svelte';
	import Nav from '../components/Nav.svelte';
    import { onMount } from "svelte";
    import { stores } from "@sapper/app";
    import { silentRenew, pathGuard } from "sapper-oidc/lib/client";
    import { authPath, refreshPath, protectedPaths } from "../OIDCConfig";
    const { page } = stores();

    export let user;

    $: {
        if (user) {
        console.log(user); // You can see what data you get 👩‍🔬
        }
    }
    onMount(async () => {
        /* You can see the callback function assign "e" to "user",
            "e" is the data returned when a token is refreshed, it is
            the same structure as "user" returned before */
        await silentRenew(refreshPath, e => (user = e), user);
        page.subscribe(({ path }) => {
        /* If a user navigate client side to a route that you
                configured to be available only to logged in user,
                pathGuard will ensure that. */
        try {
            pathGuard(authPath, path, protectedPaths, user);
        }catch (error){
        // See the error section for more details
        }
        });
    });

    //
	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Tailwindcss />

<Nav {segment}/>

<main>
	<slot></slot>
</main>

