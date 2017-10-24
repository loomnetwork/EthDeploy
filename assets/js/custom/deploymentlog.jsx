class DeploymentLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [{version: '0.00', timestamp: '~'}], nonce: 0};
  }

  tick() {
    this.setState(prevState => ({
      nonce: prevState.nonce + 1,
      items: prevState.items.concat([{version: 'v0.0' + prevState.nonce, timestamp: '2017-10-22'}]),
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="list-group mb-3" id="deploymentlog">
        <h6 className="list-group-header">Deployment Log</h6>

        <LogItem items={this.state.items} />
      </div>
    );
  }
}

class LogItem extends React.Component {
  render() {
    return (
      <div>
      {this.props.items.map(item => (
        <a key={item.version} className="list-group-item list-group-item-action justify-content-between d-flex" href="#">
          <span>{item.version}</span>
          <span className="text-muted">{item.timestamp}</span>
        </a>
      ))}
      </div>
    );
  }
}


ReactDOM.render(
  <DeploymentLog />,
  document.getElementById('deploymentlog')
);
