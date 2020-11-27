import React, { Fragment, useState } from "react";
import { Base64 } from "js-base64";
import { MdReplay } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
import Particles from 'react-particles-js';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  Textarea,
  useToast,
  useDisclosure,
} from "@chakra-ui/core";




const UI_PARAMS_API_URL = "/params";
const TRANSLATE_API_URL = "/translate";
const EXAMPLE_API_URL = "/examples";

const API_KEY = "sk-6RRCo7aCAvLZW0XEJ3clTd7lhSmNuJ28hJriGEN3";

const OpenAI = require('openai-api');
const openai = new OpenAI(API_KEY);


const preface = "I asked to write an email to donnawengfriedman@gmail.com, and below is what I received: [Prompt: 'Working on project, automatically generate personal profiles from data, need python developers',  Generated Text: 'Dear x, unfortunately, I will not be able to make it to your party tonight as I have fallen ill. I hope you have the very best time and please tell everyone I say hi!''], [Prompt: 'Extension request, too much work',  Generated Text: 'Dear x, I hope you're well! Unfortunately, I am absolutely up to my eyes in work the next few days and will not be able to finish the assignment in time. I am of course very sorry about this, and was wondering whether I could have your permission to have a one day extension given the challenging circumstances? Thank you, and have a great day!'], [Prompt: 'Sorry about your Grandma's death,  Generated Text: 'I am so sorry to hear about your grandma's passing. I had a chance to meet her once, and can't image the family's loss. I wanted to check in and see if there is anything I can do to make this easier for you. I know you're focused on getting your family through this difficult time, but let me know if I can be a source of comfort in any way.'], [Prompt: 'I cannot go to party, ill',  Generated Text: 'Dear x, I hope you are well! I'm working on a cool new project that allows users to automatically generate personal profiles from data, and we could definitely use someone with your dev skills on our team. Would you be interested in joining a small team of founders to work on a project that automatically generates personal profiles from data? It's really a lot of fun and we can use someone who knows Python. If so, let's set up a call and technical interview.'], [Prompt:'";

const NUM_TOKENS = 250;

const ReplyModel = ({ replayData }) => {

  const [input, setInput] = useState('');
  const [message, setMessage, examples] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailTo = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const replayMsgId = form.elements["reply-message-id"].value;
    const message = form.elements["message"].value;


      // Send Replay
    sendMessage(
      {
        To: emailTo,
        Subject: subject,
        "In-Reply-To": replayMsgId,
      },
      message,
      displayToast
    );

    setInput('');
    setMessage('');

    onClose();
  };

  const sendMessage = (headers_obj, message, callback) => {
    let email = "";

    for (let header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";

    email += "\r\n" + message;

    const base64EncodedEmail = Base64.encodeURI(email);
    const request = window.gapi.client.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: base64EncodedEmail,
      },
    });

    request.execute(callback);
  };



  const _callAPI = (input) =>{

    console.log(preface+input);

    (async () => {
  const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt: preface + input + "',  Generated Text: '",
    maxTokens: 100,
    temperature: 0.9,
    topP: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    best_of: 1,
    n: 1,
    stream: false,
    stop: ['Prompt:', "]", "testing"]
  });
  
  const text = JSON.stringify(gptResponse.data.choices[0].text.trim());

  get_x_of_y(text)
  setMessage(text)
  console.log(text) //THIS IS WHAT NEEDS TO BE OUTPUTTED IN HTE FIRST TEXT AREA

  //return gptResponse.data.choices[0].text.trim()
  //console.log(gptResponse.data.choices[0].text.trim()) 
})


    ();



};

  const get_x_of_y = (input) => {
  
  console.log("input")
  return input 
}



  //return _callAPI(prompt);
  //console.log(_callAPI(prompt))
  

 // let responseText = response.choices[0].text.trim()
  //console.log(response, "ha")
  //return response;
//}

  const displayToast = ({ result }) => {
    if (result.labelIds.indexOf("SENT") !== -1) {
      toast({
        title: "Message Sent.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your replay.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Fragment>
      <Button
        rightIcon={MdReplay}
        variantColor='blue'
        variant='outline'
        onClick={onOpen}
      >
        Reply
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply </ModalHeader>
          <ModalCloseButton />
          <form id='form' onSubmit={handleSubmit}>
            <ModalBody>
              <Input
                type='hidden'
                id='reply-message-id'
                value={replayData.msgId}
                readOnly
              />
              <FormControl isRequired>
                <Input
                  type='email'
                  id='emailTo'
                  placeholder='To'
                  aria-describedby='email-helper-text'
                  value={replayData.to}
                  readOnly
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type='text'
                  id='subject'
                  placeholder='Subject'
                  aria-describedby='subject-email-helper-text'
                  value={replayData.subject}
                  readOnly
                />
              </FormControl>
              <FormControl isRequired>
                <Textarea
                  id='message'
                  minH='250px'
                  size='xl'
                  placeholder='Generated Text will Appear Here'
                  resize='vertical'
                  value={message}
                />
              </FormControl>

              <FormControl>
                <Textarea
                  id='gpt3-input'
                  placeholder=' Type here (.i.e. "Reschedule meeting, sick, Thursday at 9 pm")'
                  minH='100px'
                  size='xl'
                  resize='vertical'
                  value={input}
                  onChange={(e) => { setInput(e.target.value) }}

                />
                
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type='reset' variantColor='blue' mr={3} onClick={() => {setMessage(_callAPI(input)); }}>
                Generate
              </Button>
              <Button type='submit' variantColor='green'>
                Send
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ReplyModel;

ReplyModel.prototype = {
  replayData: PropTypes.object.isRequired,
};
