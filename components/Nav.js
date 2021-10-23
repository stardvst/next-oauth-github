import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { useSession, signOut, signIn } from 'next-auth/react';

const Nav = () => {
  const session = useSession();

  return (
    <Flex bg="blue.500" color="white" px="2" py="1" justifyContent="flex-end">
      <Button my="1" colorScheme="blue" shadow="md" onClick={() => signOut()}>
        Sign out
      </Button>
    </Flex>
  );
};

export default Nav;
