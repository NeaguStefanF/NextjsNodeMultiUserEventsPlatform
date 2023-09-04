import { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/auth';

const Admin = ({ children }) => {
  useEffect(() => {
    const authenticatedUser = isAuth();

    if (!authenticatedUser) {
      Router.push(`/signin`);
    } else if (authenticatedUser.role !== 1) {
      Router.push(`/`);
    }
  }, []);

  return <>{children}</>;
};

export default Admin;
