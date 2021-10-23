import { useFormik } from 'formik';
import { getSession, signIn, signOut } from 'next-auth/react';
import * as Yup from 'yup';

export const PostSchema = Yup.object().shape({
  title: Yup.string().required('* Required'),
  body: Yup.string().required('* Required'),
});

export default function Component({ session }) {
  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '',
          body: '',
        }),
      });
    },
    validationSchema: PostSchema,
    validateOnBlur: true,
  });

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="title">
              Title:{' '}
              <span style={{ color: 'red' }}>
                {formik.touched?.title && formik?.errors?.title}
              </span>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                type="text"
                name="title"
              />
            </label>
          </div>
          <div>
            <label htmlFor="body">
              Body:{' '}
              <span style={{ color: 'red' }}>
                {formik.touched?.body && formik?.errors?.body}
              </span>
              <textarea
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.body}
                name="body"
              ></textarea>
            </label>
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
