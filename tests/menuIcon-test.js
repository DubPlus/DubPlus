import React from 'preact-compat-enzyme';
import { expect } from 'chai';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-preact';
Enzyme.configure({ adapter: new Adapter() });

import sinon from 'sinon';
import MenuIcon from '../src/js2/components/MenuIcon';

describe('<MenuIcon />', () => {
  it('renders an `.dubplus-icon`', () => {
    const wrapper = shallow(<MenuIcon />);
    expect(wrapper.find('.icon-star')).to.have.length(1);
  });

  // it('renders children when passed in', () => {
  //   const wrapper = shallow((
  //     <MyComponent>
  //       <div className="unique" />
  //     </MyComponent>
  //   ));
  //   expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  // });

  // it('simulates click events', () => {
  //   const onButtonClick = sinon.spy();
  //   const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
  //   wrapper.find('button').simulate('click');
  //   expect(onButtonClick).to.have.property('callCount', 1);
  // });
});