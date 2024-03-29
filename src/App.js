import React, { useEffect, useState } from "react";

// Import Context
import EmailState from "./context/email/EmailState";

// Import Pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";

import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await window.gapi.load("client:auth2", {
        callback: () => {
           console.log("here");
          window.gapi.client.setApiKey('AIzaSyAORGWXXeFlT_93EFeKogVWHZ9cDfKNTEM');
          window.gapi.auth.authorize(
            {
              client_id: '550370636628-e31246ibgad34kfvi8j9v2cihgnbgmbo.apps.googleusercontent.com',
              scope: 'https://mail.google.com/',
              immediate: true,
            },
            handleAuthResult()
          );
        },
        onerror: function () {
          // Handle loading error.
          console.log("gapi.client failed to load!");
        },
        timeout: 5000, // 5 seconds.
        ontimeout: function () {
          // Handle timeout.
          console.log("gapi.client could not load in a timely manner!");
        },
      });
    })();

    // eslint-disable-next-line
  }, []);



  const handleAuthResult = (authResult) => {

    if (authResult && !authResult.error) {
      console.log("Sign-in successful");
//       setIsAuthorize(true);
      loadClient();
    } else {
      console.log(authResult);
      console.error("handleAuthResult...");
      console.error(authResult);
      setLoading(false);
    }
  };

  const handleAuthClick = () => {
    setLoading(true);
     console.log('Auth result');
    return window.gapi.auth.authorize(
      {
        client_id: '550370636628-e31246ibgad34kfvi8j9v2cihgnbgmbo.apps.googleusercontent.com',
        scope: 'https://mail.google.com/',
        immediate: false,
      },
      handleAuthResult
    );
  };

  const loadClient = () => {
    return window.gapi.client.load("gmail", "v1").then(
      (res) => {
        console.log("gapi client loaded for API");
        setIsAuthorize(true);
    //   EmailState.getMessages();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };

  return (
    <EmailState>
      <ThemeProvider>
        <CSSReset />
        {isAuthorize ? (
          <Main />
        ) : (
          <SignIn loading={loading} handleAuthClick={handleAuthClick} />
        )}
      </ThemeProvider>
    </EmailState>
  );
};

export default App;