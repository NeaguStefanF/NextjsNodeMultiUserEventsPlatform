const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
  const { email, name, message } = req.body;

  const emailData = {
    to: process.env.EMAIL_TO,
    from: email,
    subject: `Contact form - ${process.env.APP_NAME}`,
    text: `Email received from contact form\nSender name: ${name}\nSender email: ${email}\nMessage: ${message}`,
    html: `
      <h4>Email received from contact form:</h4>
      <p>Sender name: ${name}</p>
      <p>Sender email: ${email}</p>
      <p>Message: ${message}</p>
      <p>This email may contain sensitive information.</p>
      <p>https://concursul.com</p>
    `,
  };

  sendgridMail
    .send(emailData)
    .then((sent) => {
      return res.json({
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);

      if (error.response && error.response.body && error.response.body.errors) {
        const errorMessage = error.response.body.errors[0].message;
        return res.status(400).json({ error: errorMessage });
      }

      return res
        .status(500)
        .json({ error: 'Something went wrong. Please try again later.' });
    });
};

exports.contactPostsAuthorForm = (req, res) => {
  const { authorEmail, email, name, message } = req.body;

  let mailList = [authorEmail, process.env.EMAIL_TO];

  const emailData = {
    to: mailList,
    from: email,
    subject: `New message from - ${process.env.APP_NAME}`,
    text: `Email received from contact form\nSender name: ${name}\nSender email: ${email}\nMessage: ${message}`,
    html: `
      <h4>New message received from:</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      <p>This email may contain sensitive information.</p>
      <p>https://concursul.com</p>
    `,
  };

  sendgridMail
    .send(emailData)
    .then((sent) => {
      return res.json({
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);

      if (error.response && error.response.body && error.response.body.errors) {
        const errorMessage = error.response.body.errors[0].message;
        return res.status(400).json({ error: errorMessage });
      }

      return res
        .status(500)
        .json({ error: 'Something went wrong. Please try again later.' });
    });
};
