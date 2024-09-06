const oneTimePasscodeEmailTemplate = (passcode: string) =>
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Passcode Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }

        .content {
            padding: 20px;
        }

        .passcode {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 20px;
        }

        .note {
            color: #555555;
            margin-bottom: 20px;
        }

        .footer {
            margin-top: 20px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>One-Time Passcode</h2>
        </div>
        <div class="content">
            <p class="passcode">Your one-time passcode is: <strong>${passcode}</strong></p>
            <p class="note">Please use this passcode to complete your action. This passcode is valid for a single use only and will expire in 10 minutes.</p>
        </div>
        <div class="footer">
            <p>If you did not request this passcode, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`

export default oneTimePasscodeEmailTemplate;