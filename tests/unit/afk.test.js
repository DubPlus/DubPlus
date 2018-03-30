'use strict'
import {h, Component} from 'preact';
import AFK from '../../src/js2/menu/general/afk';
import {shallow, deep} from 'preact-render-spy';

describe('AFK test', () => {
  it('Proptypes checking', () => {
    const context = deep(<AFK />);
    context.find('.extra-icon[onClick]').simulate('click');
    expect(document.querySelector('.dp-modal').length).toEqual(1);
    // expect(context.props().data).toHaveProperty('menuTitle');
  });

});