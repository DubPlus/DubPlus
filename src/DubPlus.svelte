<script>
  import { waitFor } from "./utils/waitFor";
  import Loading from "./lib/Loading.svelte";
  import Modal from "./lib/Modal.svelte";
  import Menu from './lib/Menu.svelte';

  /** @type {"loading" | "ready" | "loggedout" | "error"} */
  let status = $state("loading");

  const checkList = [
    "QueUp.session.id",
    "QueUp.room.chat",
    "QueUp.Events",
    "QueUp.room.player",
    "QueUp.helpers.cookie",
    "QueUp.room.model",
    "QueUp.room.users",
  ];

  waitFor(checkList)
    .then(() => {
      status = "ready";
    })
    .catch(() => {
      if (!window.QueUp?.session?.id) {
        // user might be logged out
        status = "loggedout";
      } else {
        status = "error";
      }
    });
</script>

{#if status === "loading"}
  <Loading />
{:else if status === "ready"}
  <Menu />
{:else if status === "loggedout"}
  <Modal title="Dub+ Error" show={true} content="You're not logged in. Please login to use Dub+." />
{:else}
  <Loading text="Something happed, refresh and try again" />
{/if}
