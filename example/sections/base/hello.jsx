/** @jsx React.DOM */
var HelloMessage = React.createClass({
  render: function() {
    return <div>{'Hello ' + this.props.name}</div>;
  }
});

exports.sayHello = function(name) {
  React.renderComponent(<HelloMessage name={name} />, document.getElementById('hello'));
};
