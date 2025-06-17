// sendEmail.ts
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv'
dotenv.config();
// Step 1: Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API!);

// Step 2: Define and send the email
export async function sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html?: string
) {
    const msg = {
        to: "abhijeetjha204@gmail.com",
        from: "abhijeetjha913@gmail.com",
        subject,
        text,
        html: html || text,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('Email sent successfully!');
        return response;
    } catch (error: any) {
        console.error('Error sending email:', error.response?.body || error.message);
    }
}