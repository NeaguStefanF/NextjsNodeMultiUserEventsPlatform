import { useState } from 'react';
import Layout from '../../../components/Layout';
import { forgotPassword } from '../../../actions/auth';
import 'bootstrap/dist/css/bootstrap.css';
import styles from '../../form.module.css';

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: '',
    message: '',
    error: '',
    showForm: true,
  });

  const { email, name, error, message, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, message: '', error, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: '', error: '' });
    forgotPassword({ email }).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: '',
          showForm: false,
        });
      }
    });
  };

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : '';

  const forgotPasswordForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            type="email"
            onChange={handleChange('email')}
            className="form-control"
            value={email}
            placeholder="Type your email"
            required
          />
        </div>

        <div>
          <button className="btn btn-primary mt-3">
            Send link to reset password
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center pt-4 pb-4">Forgot password?</h2>
        <div className="row justify-content-center">
          <div className={`col-md-6 ${styles['forgot-form-container']}`}>
            {showError()}
            {showMessage()}
            {showForm && forgotPasswordForm()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
