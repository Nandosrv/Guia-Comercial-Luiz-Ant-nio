<script>
    import { onMount } from "svelte";
    import { auth } from "../../../lib/firebase/client";
  
    /**
	 * @type {import("@firebase/auth").User}
	 */
    let user;
  
    onMount(() => {
      auth.onAuthStateChanged((currentUser) => {
        if (!currentUser || currentUser.email !== "nandooliveirasrv1@gmail.com") {
          window.location.href = "/"; // Joga para a home se não for admin
        } else {
          user = currentUser;
        }
      });
    });
  </script>
  
  <h1>Painel Administrativo</h1>
  <p>Bem-vindo, {user?.email}!</p>