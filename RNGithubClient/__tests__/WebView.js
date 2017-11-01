import 'react-native';
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { WebView } from '../src/components/WebView';

it('webView should render webview', () => {
  jest.unmock('ScrollView');
  const wrapper = shallow(
    <WebView navigation={{ state: { params: { url: 'test' } } }}/>,
  );
  expect(wrapper.is('WebView')).toBe(true);
})