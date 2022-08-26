import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  SkeletonLoader,
  TemplateAppContainer,
} from '@nypl/design-system-react-components';

import ActionBar from './ActionBar';
import Header from './Header';
import LibrariesList from './LibrariesList';
import LoginForm from './LoginForm';
import { FETCH_LIBRARIES, REFRESH } from '../constants';
import useTokenContext from '../context/tokenContext';
// import useLibrariesContext from '../context/librariesContext';
import {
  LibrariesContext,
  LibrariesContextValues,
} from '../context/librariesContext';

const RegistryAdmin = () => {
  // Error feedback displayed to the user, if necessary.
  const [error, setError] = useState<string>('');
  // If isLoading is true, a SkeletonLoader is displayed. isLoading is set to
  // false after fetch calls are completed.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // isSimpleList determines whether the libraries will be rendered as accordions
  // with full details (false), or as a table of names and patron counts (true).
  const [isSimpleList, setIsSimpleList] = useState<boolean>(false);

  const { accessToken, setAccessToken } = useTokenContext();
  // const { setLibraries } = useLibrariesContext();

  const { setLibraries } = useContext(
    LibrariesContext
  ) as LibrariesContextValues;

  // The logout function resets the accessToken to an empty string and deletes
  // the refreshToken from cookie storage. This causes the LoginForm to be
  // displayed.
  const logout = () => {
    // Reset setError to an empty string just in case it is set to an old
    // error.
    setError('');
    setAccessToken('');
    Cookies.remove('refreshToken');
    setIsLoading(false);
  };

  const refresh = () => {
    // Look for the refreshToken cookie.
    const refreshToken = Cookies.get('refreshToken');
    // If a refreshToken exists, send it as a header to the refresh endpoint.
    if (refreshToken) {
      fetch(REFRESH as RequestInfo | URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              "There was a problem refreshing this user's access token."
            );
          }
        })
        // If the call is successful, save the new accessToken to tokenContext.
        // This will trigger the useEffect which will then call fetchLibraries.
        .then((data) => {
          setAccessToken(data.access_token);
        })
        // If there's a problem refreshing, first log the error message. Then, use
        // the logout function to delete the accessToken (if one exists) and the
        // refreshToken. This will bring the user back to the LoginForm.
        .catch((err) => {
          console.log(err.message);
          logout();
        });
    } else {
      // If no refreshToken exists, delete the accessToken (if there is one), and
      // setIsLoading to false so the user is brought back to the LoginForm.
      logout();
    }
  };

  // Fetch the libraries with the accessToken.
  const fetchLibraries = () => {
    fetch(FETCH_LIBRARIES as RequestInfo | URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          // Reset setError to an empty string just in case it is set to an old
          // error.
          setError('');
          return response.json();
        } else if (response.status === 401) {
          // If the response status is 401, the accessToken may just be expired.
          // Try refreshing it.
          refresh();
        } else {
          setError(
            'There was a problem fetching the libraries. Try refreshing the page, or logging in again.'
          );
        }
        throw new Error('There was a problem fetching libraries.');
      })
      .then((data) => {
        setLibraries(data.libraries);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
  };

  // If a user refreshes the page, they will have lost their access token,
  // but may still have a refresh token in cookies, so try refreshing.
  // If there is an access token, fetch the libraries.
  useEffect(() => {
    if (!accessToken) {
      refresh();
    } else {
      fetchLibraries();
    }
  }, [accessToken]);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader data-testid='librariesSkeleton' />
      ) : (
        <TemplateAppContainer
          header={<Header />}
          contentTop={
            accessToken ? (
              <>
                <ActionBar
                  logout={logout}
                  isSimpleList={isSimpleList}
                  setIsSimpleList={setIsSimpleList}
                />
              </>
            ) : undefined
          }
          contentPrimary={
            accessToken ? (
              <LibrariesList error={error} isSimpleList={isSimpleList} />
            ) : (
              <LoginForm error={error} setError={setError} />
            )
          }
        />
      )}
    </>
  );
};

export default RegistryAdmin;
