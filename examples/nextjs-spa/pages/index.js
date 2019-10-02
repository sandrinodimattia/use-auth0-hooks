import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        Welcome to this <strong>Next.js and Auth0</strong> example.
        All of the authentication in this sample happens client side.
        All of the Server Side Rendering happens in a user-agnositc way and through calls to the <strong>Shows API</strong>
        we will fetch the user specific content.
      </p>
    </div>
  );
};