// @flow
import React, { Component } from 'react';
import style from './Loading.scss';

type LoadingProps = { timer: number };
type LoadingState = { timer: number, isActive: boolean };

export default class Loading extends Component<LoadingProps, LoadingState> {
  timer: TimeoutID;
  constructor(props: LoadingProps) {
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
        <section className={style.loading}>
          <strong>LOADING...</strong>
        </section>
      );
    }
    return null;
  }
}
