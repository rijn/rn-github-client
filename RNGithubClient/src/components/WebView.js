import React from 'react';
import { connect } from 'react-redux';
import { WebView as _WebView } from 'react-native';

/**
 * Web view screen
 * @class WebView
 */
export class WebView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    return (
      <_WebView
        source={{ uri: this.props.navigation.state.params.url }}
        style={{ flex: 1 }}
      />
    );
  }
};

export default connect()(WebView);