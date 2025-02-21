// @ts-check
import { test, expect } from '@playwright/test';
import { getSelection } from '../src/lib/emoji/helpers.js';

test('partial emoji is in middle of text and cursor is on right side', () => {
  const currentText = 'This is a :cat example';
  const cursorPos = 14; // 'This is a :cat| example'
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(10);
  expect(right).toBe(14);
});

test('partial emoji is in middle of text and cursor is middle', () => {
  const currentText = 'This is a :cat example';
  const cursorPos = 12; // 'This is a :c|at example'
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(10);
  expect(right).toBe(14);
});

test('partial emoji is in middle of text and cursor is on left side', () => {
  const currentText = 'This is a :cat example';
  const cursorPos = 10; // 'This is a |:cat example'
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(10);
  expect(right).toBe(14);
});

test('partial emoji is at end of text and cursor is at very end', () => {
  const currentText = 'why do :bird';
  const cursorPos = currentText.length;
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(7);
  expect(right).toBe(12);
});

test('partial emoji is at beginning of text and cursor is at start', () => {
  const currentText = ':cat why do';
  const cursorPos = 0;
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(0);
  expect(right).toBe(4);
});

test('a partial emoji next to an emoji without space', () => {
  const currentText = ':cat::dog';
  const cursorPos = currentText.length; // ':cat::dog|'
  const [left, right] = getSelection(currentText, cursorPos);

  expect(left).toBe(5); // :cat:|:dog
  expect(right).toBe(9); // :cat::dog|
});
