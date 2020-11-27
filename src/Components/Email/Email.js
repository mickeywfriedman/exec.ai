import React, { Fragment, useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";

import { getHeader, removeQuote, formatDate } from "../Helper"; // Helper functions
import { Base64 } from "js-base64";
import { MdArchive } from "react-icons/md"; // Icons
import car from './thumb.png'
import cat from './hello.png'
import can from './um.png'
import cab from './grk.jpg'
import {
  Flex,
  Box,
  Button,
  Badge,
  Image,
  Icon,
  AspectRatioBox,
  Avatar,
  Stack,
  Text,
  useToast,
  useColorMode,
  Heading,
} from "@chakra-ui/core";

import emptyEmailImg from "./empty_email.svg";

const JobCard = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };

  return (
    <Box

    justify='left'
    alignItems='left'
     margin = '20px'

      w='250px'
      rounded='5px'
      overflow='hidden'
      boxShadow='lg'
      bg='#eadada'>
     <img
      src={car}
      alt='React Logo'/>
      <Box p={2}>
        
        <Box textAlign='center'>
          <Button
            bg='#d1c2c2'
            size='md'
            rounded='10px'
            mt={1}
            boxShadow='sm'
            _hover={{ boxShadow: 'md' }}
            _active={{ boxShadow: 'lg' }}>
            Job Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};


const WorkCard = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };

  return (
    <Box

    justify='left'
    alignItems='left'

      w='250px'
      rounded='5px'
      overflow='hidden'
      boxShadow='lg'
      margin-right = '40px'
      bg='#eadada'>
     <img
      src={cab}
      alt='React Logo'/>
      <Box p={2}>
        
        <Box textAlign='center'>
          <Button
            bg='#d1c2c2'
            size='md'
            rounded='10px'
            mt={1}
            boxShadow='sm'
            _hover={{ boxShadow: 'md' }}
            _active={{ boxShadow: 'lg' }}>
            Work 
          </Button>
        </Box>
      </Box>
    </Box>
    
  );
};
const PersonalCard = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };

  return (
    <Box

    justify='left'
    alignItems='left'

      w='250px'
      rounded='5px'
      overflow='hidden'
      boxShadow='lg'
      margin-right = '40px'
      bg='#eadada'>
     <img
      src={can}
      alt='React Logo'/>
      <Box p={2}>
        
        <Box textAlign='center'>
          <Button
            bg='#d1c2c2'
            textColor = '#fff'
            size='sm'
            rounded='10px'
            mt={1}
            boxShadow='sm'
            _hover={{ boxShadow: 'md' }}
            _active={{ boxShadow: 'lg' }}>
            Friends and Family
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
const ScheduleCard = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };

  return (
    <Box

    justify='right'
    alignItems='right'

      w='250px'
      margin = '20px'
      rounded='5px'
      overflow='hidden'
      boxShadow='lg'
      bg='#eadada'>
     <img
      src={cat}
      alt='React Logo'/>
      <Box p={2}>
        
        <Box textAlign='center'>
          <Button
            bg='#d1c2c2'
            size='md'
            rounded='10px'
            mt={1}
            boxShadow='sm'
            _hover={{ boxShadow: 'md' }}
            _active={{ boxShadow: 'lg' }}>
            Scheduling!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
const Email = () => {
  const { message } = useContext(EmailContext);
  const headers = message ? message.payload.headers : [];
  const toast = useToast();

  React.useEffect(() => {
    if (message) {
      addToFrame(message);
    }
    // eslint-disable-next-line
  }, [message]);



  const formatReplayData = (headers) => {
    const replayTo =
      getHeader(headers, "Reply-to") !== undefined
        ? getHeader(headers, "Reply-to")
        : getHeader(headers, "From");
    const replaySubject = getHeader(headers, "Subject");
    const replayMsgId = getHeader(headers, "Message-ID");

    return {
      to: `${replayTo}`,
      subject: `Re: ${replaySubject}`,
      msgId: `${replayMsgId}`,
    };
  };

  const handleTrashBtn = (userId, messageId) => {
    return window.gapi.client.gmail.users.messages
      .trash({
        userId: userId,
        id: messageId,
      })
      .then((resp) => {
        if (resp.status === 200) {
          toast({
            title: "Message Deleted",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        toast({
          title: "An error occurred.",
          description: "Unable to Delete Message.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleArchiveBtn = (ids, labelIds) => {
    return window.gapi.client.gmail.users.messages
      .batchModify({
        userId: "me",
        resource: {
          ids: ids,
          removeLabelIds: labelIds,
        },
      })
      .then((resp) => {
        if (resp.status === 204) {
          toast({
            title: "Message Archived",
            description: "The Message is now in archive category.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        toast({
          title: "An error occurred.",
          description: "Unable to Archive Message.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const addToFrame = (message) => {
    let ifrm = document.getElementById("iframe").contentWindow.document;
    ifrm.body.innerHTML = getMessageBody(message.payload);
  };

  const getMessageBody = (message) => {
    const encodedBody =
      typeof message.parts === "undefined"
        ? message.body.data
        : getHTMLPart(message.parts);

    return Base64.decode(encodedBody);
  };

  const getHTMLPart = (arr) => {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === "undefined") {
        if (arr[x].mimeType === "text/html") {
          return arr[x].body.data;
        }
      } else {
        return getHTMLPart(arr[x].parts);
      }
    }
    return "";
  };

  return (
    <Flex
      direction='column'
      wrap='no-wrap'
      w='58%'
      h='100%'
      p='0.6rem 1rem'
      bg='white'
      color='black'
      border='1px'
      borderColor='gray.200'
      borderTopRightRadius='md'
      borderBottomRightRadius='md'
    >
      {!message ? (
        <EmptyMail />
      ) : (
        <Fragment>
          {/* Header Buttons */}
          <Flex justify='space-around' wrap='no-wrap' mb={2}>
            <ReplyModel replayData={formatReplayData(headers)} />
            <ForwardModel
              forwardData={message}
              getMessageBody={getMessageBody}
            />
            <Button
              rightIcon={MdArchive}
              variantColor='blue'
              variant='outline'
              onClick={() => handleArchiveBtn([message.id], ["INBOX"])}
            >
              Archive
            </Button>
            <Button
              rightIcon='delete'
              variantColor='blue'
              variant='outline'
              onClick={() => handleTrashBtn("me", message.id)}
            >
              Delete
            </Button>
          </Flex>

          {/* Mail Container */}
          <Flex
            className='mailContainer'
            flexGrow='2'
            direction='column'
            wrap='no-wrap'
            p={2}
          >
            <Box className='mailHeader' mb={2}>
              <Text fontSize='lg' fontWeight='bold' color='gray.700' mb={1}>
                {getHeader(headers, "Subject")}
              </Text>
              <Flex wrap='no-wrap' justify='flex-start'>
                <Avatar
                  name={removeQuote(getHeader(headers, "From").split("<")[0])}
                  src='https://bit.ly/tioluwani-kolawole'
                  mr={4}
                />
                <Box w='80%'>
                  <Text fontSize='md' color='gray.700'>
                    {getHeader(headers, "From")}
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    {formatDate(getHeader(headers, "Date"))}
                  </Text>
                </Box>
              </Flex>
              <Text fontSize='sm' color='gray.700' mt={1}>
                {`To: ${getHeader(headers, "To")}`}
              </Text>
            </Box>
            <Box className='mailBody' flexGrow='2'>
              <AspectRatioBox ratio={16 / 9} h='100%'>
                <Box as='iframe' id='iframe' title='messageBody'>
                  <p>Your browser does not support iframes.</p>
                </Box>
              </AspectRatioBox>
            </Box>
          </Flex>
        </Fragment>
      )}
    </Flex>
  );
};

export default Email;

const EmptyMail = () => (


  <Flex
    flexDirection='column'
    justify='center'
    alignItems='center'
    mb={3}
    style={{ height: "100%" }}
  >


   <Heading as='h3' size='lg' color='#a6b0b7' mt={3}>
      Choose the Tye of Email You'd Like to Write
    </Heading>
        <Flex
    flexDirection='row'
    justify='center'
    alignItems='center'
    mb={6}
    style={{ height: "100%" }}
  >
    <PersonalCard/>  <ScheduleCard/> 
    </Flex>
    <Flex
    flexDirection='row'
    justify='center'
    alignItems='center'
    mb={3}
    style={{ height: "100%" }}
  >
    <WorkCard/> <JobCard/>  
    </Flex>

   
  </Flex>
);
