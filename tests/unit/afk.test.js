'use strict'
import {h, Component} from 'preact';
import {MenuSwitch} from '../../src/js2/components/menuItems';
import AFK from '../../src/js2/menu/general/afk';
import {shallow, deep} from 'preact-render-spy';

describe('AFK test', () => {
  it('Proptypes checking', () => {
    const context = shallow(<AFK />);
    
    expect(context.contains(<MenuSwitch />)).toBe(true);
  });

});