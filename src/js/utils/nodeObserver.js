/**
 * This class setups a MutationObserver on the document body to observer dom nodes
 * being added, updated, or removed from the body. Then it implements a simple
 * pub/sub service to run callbacks based on when specific nodes are changed
 * You can only add one sub per id/className
 * 
 * @class NodeObserver
 */
class NodeObserver {
  constructor() {
    if (window.MutationObserver) {
      this.observer = new MutationObserver(this.observerCallback);
      this.start()
    }
  }

  start = () => {
    // Start observing the target node for configured mutations
    this.observer.observe(document.body, {
      attributes: false,
      childList: true,
      // for now we are setting this to false but if we need to listen for 
      // changes deeper than document.body then we should set this to true
      subtree: false
    });
  }

  stop = () => {
    this.observer.disconnect()
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
   * @param {string} selector only ID or className of the node you want to subscribe to
   *                          must include the "#" for id
   *                          class names must be the exact result of elem.className
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
        this.handleNodes(mutation.addedNodes, true, false);
        this.handleNodes(mutation.removedNodes, false, true);
      }
    }
  }

  /**
   * @private
   * @memberof NodeObserver
   */
  handleNodes(nodes, isNew, isRemoved) {
    nodes.forEach(n => {
      if (n.id && this.subscribers["#" + n.id]) {
        this.subscribers["#" + n.id](n, isNew, isRemoved);
      }

      if (n.className && this.subscribers["." + n.className]) {
        this.subscribers["." + n.className](n, isNew, isRemoved);
      }
    });
  }
}

const nodeEvents = new NodeObserver();
export default NodeObserver;
