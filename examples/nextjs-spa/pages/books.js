import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import { Component } from 'react';

import { withAccessToken, withAuth } from 'use-auth0-hooks';

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shows: null
    };
  }

  async fetchDataIfNeeded() {
    const { shows } = this.state;
    if (shows) {
      return;
    }

    const { accessToken } = this.props;
    if (!accessToken.value) {
      return;
    }

    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const data = await res.json();
    this.setState({
      shows: data.map(entry => entry.show)
    })
  }
  
  async componentDidMount () {
    await this.fetchDataIfNeeded();
  }

  async componentDidUpdate() {
    await this.fetchDataIfNeeded();
  }

  render() {
    const { state } = this;
    const { accessToken } = this.props;
    return (
      <div>
        <h1>Batman TV Shows</h1>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
        <ul>
          {state.shows && state.shows.map(show => (
            <li key={show.id}>
              <Link href="/p/[id]" as={`/p/${show.id}`}>
                <a>{show.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default withAuth(
  withAccessToken(Books, {
    audience: 'urn:books',
    scope: 'read:books'
  }) 
);