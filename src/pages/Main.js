import React, { useEffect, useContext } from "react";
import EmailContext from "../context/email/emailContext"
import Particles from 'react-particles-js';

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

import { Flex } from "@chakra-ui/core";

const Main = () => {
  const { getMessages } = useContext(EmailContext);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      h='100vh'
      minH='600px'
      justify='space-arround'
      wrap='no-wrap'
      p='3em'
      bg='#e2dada'
      color='white'
    >
      <MailboxList />
      <EmailList />
      <Email />
    </Flex>
  );
};

export default Main;
