<script>
    import { onMount } from "svelte";
    import { callback } from "sapper-oidc/lib/client";
  
    onMount( () => {
      try {
        callback(true); // If true, the user will be redirected back to where he was before.
      }catch (error){
        // See the error section for more details
      }
    });
  </script>