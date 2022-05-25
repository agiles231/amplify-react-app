import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { AmplifyAuthContainer, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import './App.css';

import awsconfig from './aws-exports';
import { AxiosInstanceProvider } from './AxiosInstanceProvider';

const config = awsconfig;
Auth.configure(config);
Amplify.register(Auth);

function App() {

  const [authState, setAuthState] = React.useState<AuthState>();

  React.useEffect(() => {
      return onAuthUIStateChange((nextAuthState: AuthState, authData: object | undefined) => {
          setAuthState(nextAuthState);
      })
  }, []);


  const getToken = async (): Promise<string> => {
      const token = Auth.currentSession().then(
          s => {
              return s.getIdToken();
          }
      )
      return token.then(t => t.getJwtToken())
  };

  const url = 'https://hg96i0rhk9.execute-api.us-east-1.amazonaws.com/prod'; // us-east-1
  //const url = 'https://0gp9r0lnlg.execute-api.us-east-2.amazonaws.com/prod'; // us-east-2
  const axiosInstance = new AxiosInstanceProvider(url, getToken).getInstance();

  const getRandInt = async () => {
    const result = await axiosInstance.get('/');
    return result.data.body;
  };

  const content = authState === AuthState.SignedIn ?
  (
    <div>
      {`Hello, World! Behold, a number: ${ getRandInt() }`}
    </div>
  ) : (
    <AmplifyAuthContainer><AmplifyAuthenticator /> </AmplifyAuthContainer>
  );
  return (
    { content }
  );
}

export default App;
