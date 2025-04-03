
const EMAIL = {
    verify: {
        html: `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00d8a8;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            background-color: #00d8a8;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">Flamecoders</div>
        <h2>Verify Your Email Address</h2>
        <p>Thank you for signing up! Please click the button below to verify your email address.</p>
        <a href="{{link}}" class="button">Verify Email</a>
        <p>If you did not request this email, you can safely ignore it.</p>
        <div class="footer">
            &copy; 2025 Flamecoders. All rights reserved.
        </div>
    </div>
</body>

</html>`,
        text: `
Flamecoders

Verify Your Email Address

Thank you for signing up! Please verify your email address by clicking the link below:

{{link}}

If you did not request this email, you can safely ignore it.

© 2025 Flamecoders. All rights reserved.`
    }
}

module.exports = { EMAIL };