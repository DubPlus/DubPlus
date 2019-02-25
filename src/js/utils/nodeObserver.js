/**
 * This class setups a MutationObserver on the document body to observer dom nodes
 * being added, updated, or removed from the body. Then it implements a simple
 * pub/sub service to run callbacks based on when specific nodes are changed
 * 
 * @class NodeObserver
 */
class NodeObserver {
  constructor() {
    if (window.MutationObserver) {
      this.observer = new MutationObserver(this.observerCallback);

      // Start observing the target node for configured mutations
      this.observer.observe(document.body, {
        attributes: false,
        childList: true,
        // for now we are setting this to false but if we need to listen for 
        // changes deeper than document.body then we should set this to true
        subtree: false
      });
    }
  }

  /**
   * @private
   * @property where all pub/subs subsribers will be stored
   * @memberof NodeObserver
   */
  subscribers = {}

  /**
   *
   *
   * @param {string} selector only ID or complete className of the node you want to subscribe to
   *                          must include the "#" or the "." in the selector name
   * @param {function} cb callback function to run when selector changes in the DOM
   * @memberof NodeObserver
   */
  sub(selector, cb) {
    this.subscribers[selector] = cb;
  }

  /**
   * remove a subscription
   *
   * @param {string} selector
   * @memberof NodeObserver
   */
  unsub(selector) {
    if (this.subscribers[selector]) {
      delete this.subscribers[selector];
    }
  }

  /**
   * the callback to the main MutationObserver event
   * @private
   * @memberof NodeObserver
   */
  observerCallback = mutationsList => {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        this.handleNewNodes(mutation.addedNodes);
        this.handleRemovedNodes(mutation.removedNodes);
      }
    }
  }

  /**
   * @private
   * @memberof NodeObserver
   */
  handleNewNodes(nodes) {
    nodes.forEach(n => {
      if (n.id && this.subscribers["#" + n.id]) {
        this.subscribers["#" + n.id](n, true, false);
      }

      if (n.className && this.subscribers["." + n.className]) {
        this.subscribers["#" + n.className](n, true, false);
      }
    });
  }

  /**
   * @private
   * @memberof NodeObserver
   */
  handleRemovedNodes(nodes) {
    nodes.forEach(n => {
      if (n.id && this.subscribers["#" + n.id]) {
        this.subscribers["#" + n.id](n, false, true);
      }

      if (n.className && this.subscribers["." + n.className]) {
        this.subscribers["#" + n.className](n, false, true);
      }
    });
  }
}

const nodeEvents = new NodeObserver();
export default nodeEvents;
