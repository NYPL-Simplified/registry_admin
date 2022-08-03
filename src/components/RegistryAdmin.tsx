import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  Button,
  Flex,
  SkeletonLoader,
  Spacer,
  TemplateAppContainer,
  Toggle,
} from '@nypl/design-system-react-components';

import Header from './Header';
import LibrariesList from './LibrariesList';
import LoginForm from './LoginForm';
import { TokenContext, TokenContextValues } from '../context/tokenContext';

const RegistryAdmin = () => {
  // isSimpleList determines whether the libraries will be rendered as accordions
  // with full details, or just a plain text list of names and patron counts.
  const [isSimpleList, setIsSimpleList] = useState<boolean>(false);
  // isLoading is a flag used to render the SkeletonLoader while the app tries to
  // refresh the accessToken.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { accessToken, setAccessToken } = useContext(
    TokenContext
  ) as TokenContextValues;

  // When a user clicks the "Log Out" button, the accessToken (in tokenContext)
  // is reset to an empty string and the refreshToken is deleted from cookie
  // storage.
  const logout = () => {
    setAccessToken('');
    Cookies.remove('refreshToken');
  };

  const refresh = () => {
    // Look for the refreshToken cookie.
    const refreshToken = Cookies.get('refreshToken');

    // If a refreshToken exists, send it to the refresh endpoint.
    if (refreshToken) {
      fetch(process.env.QA_REFRESH as RequestInfo | URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            // If the server responds with an error, setIsLoading to false.
            // This will render the LoginForm.
            setIsLoading(false);
            throw new Error('There was a problem refreshing.');
          }
        })
        // If the server responds with a new accessToken, save it to
        // tokenContext. Then, setIsLoading to false. This will render the
        // LibrariesList.
        .then((data) => {
          setAccessToken(data.access_token);
          setIsLoading(false);
        })
        .catch((err) => console.log(err.message));
    } else {
      // If there is no refreshToken, setIsLoading to false.
      // This will render the LoginForm.
      setIsLoading(false);
    }
  };

  // If there is no accessToken in tokenContext, try refreshing. Else,
  // setIsLoading to false. This will render the LibrariesList.
  useEffect(() => {
    if (!accessToken) {
      refresh();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader headingSize={20} showImage={false} />
      ) : (
        <TemplateAppContainer
          header={<Header />}
          contentTop={
            accessToken ? (
              <Flex alignItems='center'>
                <Toggle
                  id='librariesView'
                  isChecked={isSimpleList}
                  labelText='View simple list'
                  onChange={() => setIsSimpleList(!isSimpleList)}
                />
                <Spacer />
                <Button id='logout' onClick={logout}>
                  Log Out
                </Button>
              </Flex>
            ) : undefined
          }
          contentPrimary={
            accessToken ? (
              <LibrariesList isSimpleList={isSimpleList} />
            ) : (
              <LoginForm />
            )
          }
        />
      )}
    </>
  );
};

export default RegistryAdmin;
