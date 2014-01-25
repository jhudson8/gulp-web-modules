/** @jsx React.DOM */

// /sections/base/index.js is the main entry point for your application

// any file in your project can see values in "global"
global.firstName = 'John';

// section exports from other sections can be retrieved asynchronously using the section name
requireSection('foo', function(exports) {
  var message = exports.getMessage();

  // any javascript file within sections/base can be required synchronously just as if it were a node module
  var formatter = require('./message-formatter'),
      formattedMessage = formatter(message);

  // use the reactjs plugin to convert this jsx to javascript when building
  var HelloMessage = React.createClass({
    render: function() {
      return <div>{'Hello ' + this.props.message}</div>;
    }
  });

  React.renderComponent(<HelloMessage message={formattedMessage} />, document.getElementById('message'));
});
