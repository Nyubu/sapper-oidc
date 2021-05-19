<script>
    import { onMount } from "svelte";
    import { auth } from "sapper-oidc/lib/client";
    import { authPath } from "../OIDCConfig";
  
    onMount(() => {
      try {
        auth(authPath);
      } catch (error) {
        console.log(error);
      }
    });
  </script>