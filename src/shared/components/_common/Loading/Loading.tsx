import React, { Component } from 'react';
import style from './Loading.scss';

interface Props { timer: number }
interface State { timer: number, isActive: boolean }

export class Loading extends Component<Props, State> {
  timer: ReturnType<typeof setTimeout> | undefined;
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      timer: props.timer,
      isActive: false
    };
  }

  componentDidMount (): void {
    const { timer } = this.state;
    if(timer) {
      this.timer = setTimeout(() => this.setState({ isActive: true }), timer);
    } else {
      this.setState({ isActive: true });
    }
  }

  componentWillUnmount (): void {
    if(this.timer) clearTimeout(this.timer);
  }

  render(): JSX.Element | null {
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
