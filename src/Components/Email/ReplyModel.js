import React, { Fragment, useState } from "react";
import { Base64 } from "js-base64";
import { MdReplay } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
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

const API_KEY = "sk-EKrntNFyXHPnv3kGxLHxgSnA2wJPRyzP0zgkx3A7";

const OpenAI = require('openai-api');
const openai = new OpenAI(API_KEY);

const preface = "I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with 'Unknown'.\
\
Q: What is human life expectancy in the United States?\
A: 78 years.\
\
Q: Who was president of the United States in 1955?\
A: Dwight D. Eisenhower.\
\
Q: Which party did he belong to?\
A: He belonged to the Republican Party.\
\
Q: What is the square root of banana?\
A: Unknown\
\
Q: How does a telescope work?\
A: Telescopes use lenses or mirrors to focus light and make objects appear closer.\
\
Q: Where were the 1992 Olympics held?\
A: Barcelona, Spain.\
\
Q: How many squigs are in a bonk?\
A: Unknown\
\
Q: What is the revenue of General Motors?\
A: $150.8 billion.\
\
Q: What is the market cap of 3M?\
A: $93.8 billion.\
\
"

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

    (async () => {
 const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt: preface + input,
    maxTokens: 5,
    temperature: 0.9,
    topP: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    best_of: 1,
    n: 1,
    stream: false,
    stop: ['\n', "testing"]
  });
  
  const text = JSON.stringify(gptResponse.data.choices[0].text.trim());

  get_x_of_y(text)
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
