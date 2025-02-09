# Email Service

This project is an Express.js-based email service that handles form submissions from multiple websites and sends emails using Nodemailer. The service is designed to be modular, reusable, and secure, allowing easy integration of new websites through `dataObjects`.

## Features

- Handles email submissions from different websites dynamically.
- Uses `dataObjects` to configure different email instances for various domains.
- Implements rate limiting to prevent spam and abuse.
- Supports CORS for secure cross-origin requests.
- Sanitizes input data to prevent XSS attacks.
- Includes a workaround to keep the server awake on Render's free tier.

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/email-service.git
   cd email-service
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure the following environment variables:
   ```env
   EMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password
   ```
4. Start the server:
   ```sh
   node app.js
   ```
   or with Nodemon for development:
   ```sh
   npm run dev
   ```

## API Usage

### Endpoint: `/contact`

**Method:** `POST`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body Example:**

```json
{
  "infoObj": {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1234567890",
    "message": "I am interested in your service."
  }
}
```

### Response

#### Success (200):

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

#### Error (400/500):

```json
{
  "success": false,
  "message": "Error description"
}
```

## Keeping the Server Awake on Render

On Render's free tier, services go to sleep after 15 minutes of inactivity. To prevent this, a **wake-up request** can be sent from the frontend whenever the contact form is in focus.

### **Solution: Wake-Up Endpoint**

In the backend (`app.js` or `server.js`), add:

```js
app.get("/wake-me-up", (req, res) => {
    console.log("Morning sir, what do you need");
    res.status(200).send("Good morning");
});
```

### **Frontend Wake-Up Request**

```js
document.querySelector("#yourInput").addEventListener("focus", () => {
    fetch("https://your-render-server.com/wake-me-up").catch(err => console.error("Waking server failed", err));
});
```

> **Note:** This workaround is only needed if your server is expected to sleep. If you upgrade to a paid plan or have constant traffic, this is unnecessary.

## Configuration

### Handling Multiple Websites

The `dataObjects` object allows handling multiple websites dynamically. Each website has its own schema, email template, and configuration:

```js
const dataObjects = {
  "https://example1.com": { ... },
  "https://example2.com": { ... }
};
```

To add a new website, simply add an entry in `dataObjects` with its specific email template and validation schema.

### Rate Limiting

This service implements rate limiting using `express-rate-limit` to prevent spam and abuse. The configuration:

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Max 25 requests per window per IP
  message: "Too many requests from this IP"
});
```

## Project Structure

```
email-service/
│── backend/
│   ├── config/
│   │   ├── corsOptions.js    # CORS configuration
│   ├── middleware/
│   │   ├── rateLimiter.js    # Rate limiter
│   ├── utils/
│   │   ├── mailer.js         # Nodemailer email handling
│   ├── schemas/              # Email input schemas
│   ├── dataObjects.js        # Email structure and data handling
│── app.js                    # Main Express server
│── package.json              # Dependencies and scripts
│── .env                      # Environment variables
│── frontend/
│   ├── contact.css           # Frontend styling
│   ├── contact.html          # Contact form HTML
│   ├── contact.js            # Frontend JavaScript (handling form and sending data)
```

## License

This project is licensed under the MIT License.



