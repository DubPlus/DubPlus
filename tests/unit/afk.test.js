import {h, Component} from 'preact';
import AFK from '../../src/js2/menu/general/afk';
import {shallow, deep} from 'preact-render-spy';

describe('AFK test', () => {
  it('Proptypes checking', () => {
    const context = deep(<AFK />);
    console.log(context);
    expect(context).toHaveProperty('menuTitle');
  });

});