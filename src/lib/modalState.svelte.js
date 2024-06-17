/** @type {import('../global').ModalProps} */
export const modalState = $state({
  id: "",
  open: false,
  title: "Dub+",
  content: "",
  value: "",
  placeholder: "",
  maxlength: 999,
  onConfirm: () => {},
  onCancel: () => {},
});
