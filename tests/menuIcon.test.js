import {h, Component} from 'preact';
import MenuIcon from '../src/js2/components/MenuIcon';
import {shallow, deep} from 'preact-render-spy';

describe('MenuIcon test', () => {
  it('renders a div.dubplus-icon', () => {
    const context = shallow(<MenuIcon />);
    expect(context.component()).toBeInstanceOf(MenuIcon);
    expect(context.find('div').attr('className')).toBe('dubplus-icon');
  });

});