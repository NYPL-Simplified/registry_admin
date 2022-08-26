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
import useTokenContext from '../context/tokenContext';

interface LoginFormProps {
  error: string;
  setError: (error: string) => void;
}

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

const LoginForm = ({ error, setError }: LoginFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setAccessToken } = useTokenContext();

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create a FormData object to store the username and password for sending
    // with the login request.
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);

    fetch(LOGIN as RequestInfo | URL, {
      method: 'POST',
      body,
    })
      .then((response) => {
        if (response.ok) {
          // Reset setError to an empty string just in case it is set to an old
          // error.
          setError('');
          return response.json();
        }
        if (response.status >= 400 && response.status < 502) {
          // This error will be displayed to the user.
          setError('Your username or password is incorrect. Please try again.');
        }
        throw new Error(
          'There was a problem authenticating this user in LoginForm.tsx.'
        );
      })
      .then((data) => {
        // After a successful request, store the two tokens received in their
        // their appropriate places: the access token in context and the refresh
        // token in cookies.
        setAccessToken(data.access_token);
        Cookies.set('refreshToken', data.refresh_token, {
          sameSite: 'lax',
          secure: true,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
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
      <HelperErrorText
        ariaAtomic={false}
        ariaLive='assertive'
        id='loginError'
        text={error && error}
        __css={errorStyles}
      />
    </Box>
  );
};

export default LoginForm;
