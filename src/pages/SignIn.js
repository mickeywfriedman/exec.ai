import React from "react";
import { Button, Flex } from "@chakra-ui/core";
import { FcGoogle } from "react-icons/fc";
import Particles from 'react-particles-js';

const SignIn = ({ handleAuthClick, loading }) => (







  <Flex h='100vh' justify='center' alignItems='center' bg='#e2dada' >
    <Particles />

    <Button
      isLoading={loading}
      leftIcon={FcGoogle}
      height='50px'
      variantColor='gray'
      variant='outline'
      bg='#d1c2c2'
      position= 'absolute'
      onClick={handleAuthClick}
    >
      Sign in with Google
    </Button>

     <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
  </Flex>

);



export default SignIn;
