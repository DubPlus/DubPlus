<script>
  import { waitFor } from "./utils/waitFor";
  import Loading from "./lib/Loading.svelte";
  import Modal from "./lib/Modal.svelte";
  import Menu from "./lib/Menu.svelte";
  import { modalState } from "./lib/modalState.svelte";

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

  /**
   * @param {string} content
   */
  function showErrorModal(content) {
    modalState.id = "";
    modalState.title = "Dub+ Error";
    modalState.content = content;

    modalState.onCancel = () => {
      modalState.open = false;
    };

    // this must always go last to ensure the data above
    // is set before the modal is opened
    modalState.open = true;
  }

  $effect(() => {
    if (status === "loggedout") {
      showErrorModal("You're not logged in. Please login to use Dub+.");
    } else if (status === "error") {
      showErrorModal("Something went wrong starting Dub+. Please refresh and try again.");
    }
  });
</script>

{#if status === "loading"}
  <Loading />
{:else if status === "ready"}
  <Menu />
{:else}
  <Modal />
{/if}
