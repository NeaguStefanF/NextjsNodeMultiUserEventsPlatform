import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import { signup } from '../../../../actions/auth';
import { withRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    error: '',
    loading: false,
    success: false,
    showButton: true,
  });

  const { name, token, error, loading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signup({ token }).then((data) => {
      if (data && data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false,
        });
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false,
        });
      }
    });
  };

  const showLoading = () => (loading ? <h2>Loading...</h2> : '');

  return (
    <Layout>
      <div className="container">
        <h3 className="text-center mt-4 pt-4 pb-4">
          Hi {name}, Good Luck and Have Fun !!!
        </h3>
        <div className="row justify-content-center">
          {showLoading()}
          {error && error}
          {success &&
            'You have successfully activated your account.You can signin now.'}
          {showButton && (
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
              Activate Your Account
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
