"use strict";
import { convertMStoTime } from "@/utils/time-utils.js"

test("should accept string and convert ms to formatted time", () => {
  const testMS = "4513000"
  const expected = "1:15:13";
  const test = convertMStoTime(testMS);
  expect(test).toEqual(expected);
});

test("should return empty string if missing argument", () => {
  expect(convertMStoTime()).toEqual("");
});

test("should return empty string if argument produces NaNs", () => {
  const test = convertMStoTime("something that shouldn't work");
  expect(test).toEqual("");
});

test("should also accept a number", () => {
  const testMS = 415000
  const expected = "6:55";
  const test = convertMStoTime(testMS);
  expect(test).toEqual(expected);
});

test("one more check", () => {
  const testMS = "335000"
  const expected = "5:35";
  const test = convertMStoTime(testMS);
  expect(test).toEqual(expected);
});
