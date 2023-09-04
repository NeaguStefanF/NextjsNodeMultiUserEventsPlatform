import { useState } from 'react';
import Layout from '../../../../components/Layout';
import { resetPassword } from '../../../../actions/auth';
import { withRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import styles from '../../../form.module.css';

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    name: '',
    newPassword: '',
    error: '',
    message: '',
    showForm: true,
  });

  const { showForm, name, newPassword, error, message } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.id,
    }).then((data) => {
      if (data && data.error) {
        setValues({
          ...values,
          error: data.error,
          newPassword: '',
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          newPassword: '',
        });
      }
    });
  };

  const resetPasswordForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            type="password"
            onChange={(e) =>
              setValues({ ...values, newPassword: e.target.value })
            }
            className="form-control"
            value={newPassword}
            placeholder="Type your new password"
            required
          />
        </div>

        <div>
          <button className="btn btn-primary mt-3">Change password</button>
        </div>
      </form>
    </div>
  );

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : '';

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center pt-4 pb-4">Reset Password</h2>
        <div className="row justify-content-center">
          <div className={`col-md-6 ${styles['forgot-form-container']}`}>
            {showError()}
            {showMessage()}
            {showForm && resetPasswordForm()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
