import twilio from 'twilio'
const accountSid = 'AC420d9193ea2918b6defcd2bf09b8ec8d';
const authToken = '33816959fb323d0a54ab193c722260a3';
const client = twilio(accountSid, authToken);
export async function sendTextMessage(to: string, from: string, body: string) {
    const message = await client.messages.create({
        body: body,
        from: from,
        to: to,
    });

    console.log(message.body);
}