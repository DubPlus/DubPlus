export const activeTabState = $state({ isActive: true });

window.onfocus = function () {
  activeTabState.isActive = true;
};

window.onblur = function () {
  activeTabState.isActive = false;
};
