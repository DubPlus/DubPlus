/** @type {import('../../global').ModalProps} */
export const modalState = $state({
  id: "",
  open: false,
  title: "Dub+",
  content: "",
  value: "",
  placeholder: "",
  maxlength: 999,
  onConfirm: () => {
    return true;
  },
  onCancel: () => {},
});

/**
 *
 * @param {import('../../global').ModalProps} nextState
 */
export function updateModalState(nextState) {
  modalState.id = nextState.id;
  modalState.open = nextState.open ?? false;
  modalState.title = nextState.title || "Dub+";
  modalState.content = nextState.content || "";
  modalState.value = nextState.value || "";
  modalState.placeholder = nextState.placeholder || "";
  modalState.maxlength = nextState.maxlength || 999;
  modalState.onConfirm =
    nextState.onConfirm ||
    (() => {
      return true;
    });
  modalState.onCancel = nextState.onCancel || (() => {});
}
