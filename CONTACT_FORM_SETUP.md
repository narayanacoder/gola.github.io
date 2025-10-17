
# Contact Form Email Setup

Your contact form now posts to a configurable endpoint and falls back to `mailto:` if the endpoint isn't set or fails.

## Recommended (no backend): Formspree
1) Go to https://formspree.io and create a form (free tier is fine).
2) Copy your Form ID (looks like `https://formspree.io/f/abcdwxyz`).
3) Open `contact.html` and replace:
   ```html
   action="https://formspree.io/f/REPLACE_WITH_YOUR_ID"
   ```
   with your real Formspree endpoint.
4) Set your recipient to **rajeshwar@Golacyber.ai** in the Formspree dashboard.
5) Submit the form once in production to verify.
6) (Optional) In Formspree, enable spam protection / CAPTCHA.

## Alternative: Your own serverless endpoint
Use Cloudflare Workers, AWS Lambda, etc., to accept POST and send an email (SES, Mailgun, SendGrid). Then replace the `action` with your endpoint URL.

## Fallback behavior
If the endpoint fails or isn't configured yet, the page will open a mail compose window (mailto) prefilled with the user's message.
