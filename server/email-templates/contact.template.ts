import config from "../config/config";

const contactEmailTemplate = (id: string, email: string, month: string, day: string, year: string, subject: string, message: string, link: string) =>
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message Received</title>
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

        .info {
            font-size: 16px;
            color: #333333;
            margin-bottom: 20px;
        }

        .message {
            font-size: 14px;
            color: #555555;
            margin-bottom: 20px;
        }

        .view-link {
            display: inline-block;
            padding: 10px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
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
            <h2>New Contact Message Received</h2>
        </div>
        <div class="content">
            <p>A new contact message has been received. Please find the details below:</p>
            <p class="info"><strong>ID:</strong> ${id}</p>
            <p class="info"><strong>Email:</strong> ${email}</p>
            <p class="info"><strong>Date:</strong> ${month} ${day}, ${year}</p>
            <p class="info"><strong>Subject:</strong> ${subject}</p>
            <p class="message">${message}</p>
            <a href="${link}" class="view-link">View Contact</a>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact us at ${config.APPURL}</p>
        </div>
    </div>
</body>
</html>
`;

export default contactEmailTemplate;