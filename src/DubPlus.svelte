<script>
  import { waitFor } from "./utils/waitFor";
  import Loading from "./lib/Loading.svelte";
  import Modal from "./lib/Modal.svelte";
  import Menu from "./lib/menu/Menu.svelte";
  import { modalState } from "./lib/stores/modalState.svelte";
  import { t } from "./lib/stores/i18n.svelte";

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
    modalState.id = "dubplus-loading-error";
    modalState.title = t("Error.modal.title");
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
      showErrorModal(t("Error.modal.loggedout"));
    } else if (status === "error") {
      showErrorModal(t("Error.unknown"));
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
