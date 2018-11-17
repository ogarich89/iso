import React, { Component } from 'react';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: props.timer,
      isActive: false
    };
  }

  componentDidMount () {
    const { timer } = this.state;
    if(timer) {
      this.timer = setTimeout(() => this.setState({ isActive: true }), timer);
    } else {
      this.setState({ isActive: true });
    }
  }

  componentWillUnmount () {
    if(this.timer) clearTimeout(this.timer);
  }

  render() {
    const { isActive } = this.state;
    if(isActive) {
      return (
        <div>LOADING!!!</div>
      );
    }
    return null;
  }
}
