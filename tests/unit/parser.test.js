'use strict';
import parser from '../../src/js2/utils/emotes/parser.js'

test('should match a single emote in a string', () => {
  let str = "yo :kappa: gabba";
  const expected = [':kappa:'];
  let matches = parser(str);
  expect(matches.length).toEqual(1);
  expect(matches).toEqual(expect.arrayContaining(expected));
});

test('should ignore unmatched colons', () => {
  let str1 = ":text1:sample2:";
  const expected = [':text1:'];
  let matches = parser(str1);
  expect(matches.length).toEqual(1);
  expect(matches).toEqual(expect.arrayContaining(expected));

  let str2 = "hello :smiley cat:";
  let matches2 = parser(str2);
  expect(matches2.length).toEqual(0);
  expect(matches2).toEqual([]);
  
});

test('should match any character not a whitespace or colon', () => {
  let str = ":@(1@#$@SD: :s:";
  const expected = [':@(1@#$@SD:',':s:'];
  let matches = parser(str);
  expect(matches.length).toEqual(2);
  expect(matches).toEqual(expect.arrayContaining(expected));  
});

test('should match emotes with no space between them', () => {
  let str = ":nospace::inbetween: because there are 2 colons in the middle";
  const expected = [':nospace:',':inbetween:'];
  let matches = parser(str);
  expect(matches.length).toEqual(2);
  expect(matches).toEqual(expect.arrayContaining(expected));  
});

test('should match emotes in a long unbroken string', () => {
  let str = "bla bla asasd:nospace:middle:nospace:asdasdasd";
  const expected = [':nospace:',':nospace:'];
  let matches = parser(str);
  expect(matches.length).toEqual(2);
  expect(matches).toEqual(expect.arrayContaining(expected));
});


test('should read the entire string properly', () => {
  let str = "this one time I ended my sentence in an :emote:";
  const expected = [':emote:'];
  let matches = parser(str);
  expect(matches.length).toEqual(1);
  expect(matches).toEqual(expect.arrayContaining(expected));
});

test("Now I'm just trying to break things", () => {
  let str = "::::::::::::::::::::::::::::::::::";
  let matches = parser(str);
  expect(matches.length).toEqual(0);
  expect(matches).toEqual([]);
});

test("Now I'm just trying to break things again", () => {
  let str = ":::s::::::::-:::::: ::::::):::::::::::";
  const expected = [':s:', ':-:'];
  let matches = parser(str);
  expect(matches.length).toEqual(2);
  expect(matches).toEqual(expect.arrayContaining(expected));
});