import WaitFor from "@/utils/waitFor.js";
import DTGlobal from "./proxy/global_object";
import DTProxyAPIs from "./proxy/api";
import DTProxyDOM from "./proxy/dom";
import DTProxyEvents from "./proxy/events";

/**
 * In order to prepare for the future alpha changes and the possibility that
 * Dubtrack might alter this object of data we rely on, I am planning to funnel
 * all interaction with Dubtrack through this "proxy" (for lack of better word)
 */

const proxy = DTGlobal;
proxy.api = DTProxyAPIs;
proxy.dom = DTProxyDOM;
proxy.events = DTProxyEvents;

export default proxy;
