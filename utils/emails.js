const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
module.exports = class SendEmail {
  constructor(user, url, homepageLink) {
    (this.to = user.email), (this.firstName = user.name);
    (this.url = url), (this.homepage = homepageLink);
    this.from = `Divorced Girl Smiling <${process.env.Email}>`;
  }
  createTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SEND_GRID_USERNAME,
        pass: process.env.SEND_GRID_PASSWORD,
      },
    });
  }
  //send Actual email
  async send(template, subject) {
    console.log(this.firstName, this.url, this.to, this.homepage, this.from);
    //Render Hml base Template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      name: this.firstName,
      url: this.url,
      subject,
      homepage: this.homepage,
      admin: process.env.Email,
    });
    //Email Option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.htmlToText(html),
    };
    //send Email
    await this.createTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome To Divorced Girl Smiling Family');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your Password Reset Token');
  }
  async sendEmailVerification() {
    await this.send('emailVerification', 'Email Confirmation');
  }
};
