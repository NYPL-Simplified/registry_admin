import React, { FormEvent, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  HelperErrorText,
  TextInput,
} from '@nypl/design-system-react-components';

import { LOGIN } from '../constants';
import { TokenContext, TokenContextValues } from '../context/tokenContext';

const backgroundStyles = {
  background: 'section.blogs.primary',
  margin: 'auto',
  marginTop: 'xxl',
  paddingBottom: 'xl',
  paddingTop: 'l',
  width: '400px',
};
const formFieldStyles = { margin: 'auto', width: '75%' };
const errorStyles = {
  color: 'ui.error.primary',
  paddingTop: 'xs',
  textAlign: 'center',
};

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showLoginError, setShowLoginError] = useState<boolean>(false);

  const { setAccessToken } = useContext(TokenContext) as TokenContextValues;

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData();
    body.append('username', username);
    body.append('password', password);

    fetch(LOGIN as RequestInfo | URL, {
      method: 'POST',
      body,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status >= 400 && response.status < 502) {
          setShowLoginError(true);
        }
        throw new Error(
          'There was a problem authenticating this user in LoginForm.tsx.'
        );
      })
      .then((data) => {
        setAccessToken(data.access_token);
        Cookies.set('refreshToken', data.refresh_token, {
          sameSite: 'lax',
          secure: true,
        });
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Box __css={backgroundStyles}>
      <Heading level='two' size='tertiary' __css={{ textAlign: 'center' }}>
        Log In
      </Heading>
      <Form id='login' onSubmit={(e: FormEvent<HTMLFormElement>) => login(e)}>
        <FormField>
          <TextInput
            id='username'
            isRequired
            labelText='Username'
            onChange={(e) => setUsername(e.target.value)}
            showRequiredLabel={false}
            type='text'
            __css={formFieldStyles}
          />
        </FormField>
        <FormField>
          <TextInput
            id='password'
            isRequired
            labelText='Password'
            onChange={(e) => setPassword(e.target.value)}
            showRequiredLabel={false}
            type='password'
            __css={formFieldStyles}
          />
        </FormField>
        <FormField>
          <Button id='submit' type='submit' __css={formFieldStyles}>
            Submit
          </Button>
        </FormField>
      </Form>
      {showLoginError && (
        <HelperErrorText
          ariaAtomic={false}
          ariaLive='assertive'
          id='loginError'
          text='Your username or password is incorrect.'
          __css={errorStyles}
        />
      )}
    </Box>
  );
};

export default LoginForm;
