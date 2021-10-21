import { getSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Component({ session }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            fetch('/api/posts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title, body }),
            });
          }}
        >
          <div>
            <label htmlFor="title">Title:</label>
            <input
              onChange={e => setTitle(e.target.value)}
              type="text"
              name="title"
            />
          </div>
          <div>
            <label htmlFor="body">Body:</label>
            <textarea
              onChange={e => setBody(e.target.value)}
              name="body"
            ></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
