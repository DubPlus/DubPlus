'use strict';
import ldb from '../../src/js2/utils/indexedDB.js';

test('Indexed DB sets a value successfully', (done) => {
  var err = null;
  try { 
    ldb.set("test", "********************this is a test");

    ldb.get("test", (data) => {
      // console.log(data);
      expect(data).toEqual("********************this is a test");
      done();
    });

  } catch (e) {
    console.error(e);
  }
  expect(err).toBeNull();
});
