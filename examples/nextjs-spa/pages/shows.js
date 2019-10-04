import { Component } from 'react';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';

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

  async fetchUserData() {
    const { myShows, myShowsError } = this.state;
    if (myShows || myShowsError) {
      return;
    }

    const { accessToken } = this.props;
    if (!accessToken.value) {
      return;
    }

    const res = await fetch(`${process.env.API_BASE_URL}/api/my/shows`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });

    if (res.status >= 400) {
      this.setState({
        myShowsError: res.statusText || await res.json()
      })
    } else {
      const { shows } = await res.json();
      this.setState({
        myShows: shows.map(entry => entry.show)
      })
    }
  }
  
  async componentDidMount () {
    await this.fetchUserData();
  }

  async componentDidUpdate() {
    await this.fetchUserData();
  }

  render() {
    const { auth } = this.props;
    const { state, myShowsError } = this;
    const { shows, showsError } = this.props;
    return (
      <div>
        {
          state.myShows && (
            <div>
              <h1>My Favourite TV Shows ({auth.user.email})</h1>
              <p>This is rendered on the client side.</p>
              {myShowsError && <pre>Error loading my shows: {myShowsError}</pre>}
              <ul>
                {state.myShows && state.myShows.map(show => (
                  <li key={show.id}>
                    {show.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        
        <h1>All TV Shows</h1>
        {showsError && <pre>Error loading shows: {showsError}</pre>}
        <p>This is rendered on the server side.</p>
        <ul>
          {shows && shows.map(show => (
            <li key={show.id}>
              {show.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

TvShows.getInitialProps = async function() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/shows`);
  if (res.status >= 400) {
    return {
      showsError: res.statusText || await res.json()
    };
  }

  const { shows } = await res.json();
  return {
    shows: shows.map(entry => entry)
  };
};

export default withAuth(
  withAccessToken(TvShows, {
    audience: 'https://api/tv-shows',
    scope: 'read:shows'
  }) 
);