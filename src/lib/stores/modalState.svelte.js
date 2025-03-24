/** @type {import('../../global').ModalProps} */
export const modalState = $state({
  id: '',
  open: false,
  title: 'Dub+',
  content: '',
  value: '',
  placeholder: '',
  defaultValue: '',
  maxlength: 999,
  validation: () => {
    return true;
  },
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
  modalState.open = nextState.open ?? false;
  modalState.title = nextState.title || 'Dub+';
  modalState.content = nextState.content || '';
  modalState.value = nextState.value || '';
  modalState.placeholder = nextState.placeholder || '';
  modalState.defaultValue = nextState.defaultValue;
  modalState.maxlength = nextState.maxlength || 999;
  modalState.onConfirm = nextState.onConfirm;
  modalState.onCancel = nextState.onCancel;
  modalState.validation = nextState.validation || (() => true);
}
