import Head from 'next/head';

import NavBar from './navbar';

export default ({ children }) => (
  <div>
    <Head>
      <title>Next.js with Auth0</title>
    </Head>
    <NavBar />
    <main>
      <div className="container">
        {children}
      </div>
    </main>
    <style jsx>{`
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
    `}</style>
    <style jsx global>{`
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, 'Segoe UI';
      }
    `}</style>
  </div>
);