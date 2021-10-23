import { Box, Flex } from '@chakra-ui/layout';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { getSession } from 'next-auth/react';
import * as Yup from 'yup';
import { Button } from '@chakra-ui/button';

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
        body: JSON.stringify(values),
      });
    },
    validationSchema: PostSchema,
    validateOnBlur: true,
  });

  if (session) {
    return (
      <Box mx="4" my="2" px="2" py="1">
        <Flex flexDir="column">
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              id="title"
              mb="4"
              isInvalid={formik.touched?.title && formik?.errors?.title}
            >
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.body}
              />
              <FormErrorMessage>
                {formik.touched?.title && formik?.errors?.title}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="body"
              isInvalid={formik.touched?.body && formik?.errors?.body}
            >
              <FormLabel>Body</FormLabel>
              <Textarea
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.body}
              />
              <FormErrorMessage>
                {formik.touched?.body && formik?.errors?.body}
              </FormErrorMessage>
            </FormControl>
            <Button colorScheme="blue" mt="2" type="submit">
              Submit
            </Button>
          </form>
        </Flex>
      </Box>
    );
  }
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
