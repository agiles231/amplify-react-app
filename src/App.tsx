import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import './App.css';

import awsconfig from './aws-exports';
import { AxiosInstanceProvider } from './AxiosInstanceProvider';

Auth.configure(awsconfig);
Amplify.register(Auth);

function App() {

  const getToken = async (): Promise<string> => {
      const token = Auth.currentSession().then(
          s => {
              return s.getIdToken();
          }
      )
      return token.then(t => t.getJwtToken())
  };

  const url = process.env.REACT_APP_API_GATEWAY_URL || '';
  const axiosInstance = new AxiosInstanceProvider(url, getToken).getInstance();
  const [value, setValue] = React.useState<number>();

  React.useEffect(() => {
    const getRandInt = async () => {
      const result = await axiosInstance.get('/');
      setValue(result.data.body);
    };
    getRandInt()
  }, [value]);


  const content = (
    <Authenticator>
      <div>
        {`Hello, World! Behold, a number: ${ value }`}
      </div>
    </Authenticator>);
  return content;
}

export default App;
