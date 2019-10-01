import React from 'react';

import { useAuth0, requireLogin } from 'use-auth0-hooks';

function Profile() {
  const { user } = useAuth0();
  return (
    <div>
      <h1>Profile</h1>
      <p>This is the profile page.</p>
      <pre>{JSON.stringify(user || { }, null, 2)}</pre>
    </div>
  );
}

export default requireLogin(Profile);