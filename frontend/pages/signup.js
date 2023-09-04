import Layout from '../components/Layout';
import SignupComponent from '../components/auth/SignupComponent';
import 'bootstrap/dist/css/bootstrap.css';

import styles from './form.module.css';

const Signup = () => {
  return (
    <Layout>
      <div className="container">
        <h2 className="text-center pt-4 pb-4">Signup page</h2>
        <div className="row justify-content-center">
          <div className={`col-md-6 ${styles['signup-form-container']}`}>
            <SignupComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
