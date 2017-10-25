class DeploymentLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], nonce: 0};
  }

  tick() {
    var items = [];
    var component = this;

    axios.get("/deploy_histories")
      .then(function (histories) {
        items = histories.data.map(function(item) {
          return {version: item.bundle_name, timestamp: new Date(item.CreatedAt)}
        })

        component.setState(prevState => ({
          nonce: prevState.nonce + 1,
          items: items}),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 5000);
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
          <span className="text-muted">{item.timestamp.toGMTString()}</span>
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
