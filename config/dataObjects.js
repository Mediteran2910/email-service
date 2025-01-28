const xss = require("xss");
const { createSchema } = require("../schemas/contactSchema");

const dataObjects = {
  "https://mediteran2910.github.io": {
    schema: createSchema({
      name: true,
      email: true,
      message: true,
    }),
    from: process.env.EMAIL_USER,
    subject: "Villa Jure reservation",
    to: process.env.EMAIL_USER,
    generateContent: (infoObj) => {
      const sanitizedInfoObj = {
        name: xss(infoObj.name),
        email: xss(infoObj.email),
        phone: xss(infoObj.phone),
        message: xss(infoObj.message),
      };

      return {
        replyTo: sanitizedInfoObj.email,
        text: `Hi, my name is ${sanitizedInfoObj.name}, 
          I'm contacting you about Villa Jure, 
          I would like to make a reservation, 
          You can contact me on ${sanitizedInfoObj.email}`,
        html: `<p>Hi my name is: ${sanitizedInfoObj.name}</p>
          <p>My email is: ${sanitizedInfoObj.email}</p>
          <p>Message: ${sanitizedInfoObj.message}</p>`,
      };
    },
  },
  "https://zepralak.io": {
    from: process.env.EMAIL_USER,
    subject: "Zepralak Development",
    to: process.env.EMAIL_USER,
    generateContent: (infoObj) => {
      const sanitizedInfoObj = {
        name: xss(infoObj.name),
        email: xss(infoObj.email),
        phone: xss(infoObj.phone),
        message: xss(infoObj.message),
      };

      return {
        replyTo: sanitizedInfoObj.email,
        text: `Hi, my name is ${sanitizedInfoObj.name}, 
          I'm contacting you about Zepralak, 
          I would like to have a meeting with you, 
          You can contact me on ${sanitizedInfoObj.email} or mobile number ${sanitizedInfoObj.phone}`,
        html: `<p>Hi my name is: ${sanitizedInfoObj.name}</p>
          <p>My email is: ${sanitizedInfoObj.email}, or mobile number ${sanitizedInfoObj.phone}</p>
          <p>Message: ${sanitizedInfoObj.message}</p>`,
      };
    },
  },
};

module.exports = dataObjects;
