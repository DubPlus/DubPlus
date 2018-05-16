// Mock Browser API's which are not supported by JSDOM, e.g. ServiceWorker, LocalStorage

// Mocks localStorage
const localStorageMock = (function() {
	let store = {};
	return {
		getItem: (key) => store[key] || null,
		setItem: (key, value) => store[key] = value.toString(),
		clear: () => store = {}
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
}); 

const indexedDB = require("fake-indexeddb");
Object.defineProperty(window, 'indexedDB', {
	value: indexedDB
}); 

// var gitInfo = require('../../tasks/repoInfo.js');
Object.defineProperty(window, '_RESOURCE_SRC_', {
	// value: gitInfo.resourceSrc
	value: '/test/'
}); 