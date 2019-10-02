import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import { Component } from 'react';

import { withAccessToken, withAuth } from 'use-auth0-hooks';



class TvShows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shows: null,
      showsError: null,
      myShows: null,
      myShowsError: null
    };
  }

  async fetchPublicData() {
    const { shows, showsError } = this.state;
    if (shows || showsError) {
      return;
    }

    const res = await fetch('http://localhost:3001/api/shows');
    if (res.status >= 400) {
      this.setState({
        showsError: res.statusText || await res.json()
      })
    } else {
      const { shows } = await res.json();
      this.setState({
        shows: shows.map(entry => entry)
      })
    }
  }

  async fetchUserData() {
    const { myShows, myShowsError } = this.state;
    if (myShows || myShowsError) {
      return;
    }

    const { accessToken } = this.props;
    if (!accessToken.value) {
      return;
    }

    const res = await fetch('http://localhost:3001/api/my/shows', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (res.status >= 400) {
      this.setState({
        myShowsError: res.statusText || await res.json()
      })
    } else {
      const { shows } = await res.json();
      this.setState({
        myShows: shows.map(entry => entry)
      })
    }
  }

  /*


    */
  
  async componentDidMount () {
    await this.fetchPublicData();
    await this.fetchUserData();
  }

  async componentDidUpdate() {
    await this.fetchPublicData();
    await this.fetchUserData();
  }

  render() {
    const { state } = this;
    const { accessToken } = this.props;
    return (
      <div>
        <h1>TV Shows</h1>
        <ul>
          {state.shows && state.shows.map(show => (
            <li key={show.id}>
              {show.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default withAuth(
  withAccessToken(TvShows, {
    audience: 'urn:books',
    scope: 'read:books'
  }) 
);