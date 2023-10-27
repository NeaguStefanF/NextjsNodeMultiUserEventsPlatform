import { useState, useEffect } from 'react';
import Link from 'next/link';
import { emailContactForm } from '../../actions/form';

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    message: '',
    name: '',
    email: '',
    sent: false,
    buttonText: 'Send Message',
    success: false,
    error: false,
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: 'Sending...' });
    emailContactForm({ authorEmail, name, email, message }).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          name: '',
          email: '',
          message: '',
          buttonText: 'Sent',
          success: data.success,
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: 'Send Message',
    });
  };

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? '' : 'none' }}
    >
      We will respond to your message the fastest we can!
    </div>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit} className="pb-5">
        <div className="form-group mb-3">
          <label className="lead mb-1">Message</label>
          <textarea
            onChange={handleChange('message')}
            type="text"
            className="form-control"
            value={message}
            required
            rows="10"
          ></textarea>
        </div>

        <div className="form-group mb-3">
          <label className="lead mb-1">Full Name</label>
          <input
            type="text"
            onChange={handleChange('name')}
            className="form-control"
            value={name}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label className="lead mb-1">
            Email Address (try: elev4162@gmail.com)
          </label>
          <input
            type="email"
            onChange={handleChange('email')}
            className="form-control"
            value={email}
            required
          />
        </div>

        <div>
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showError()}
      {showSuccess()}
      {contactForm()}
    </>
  );
};

export default ContactForm;
