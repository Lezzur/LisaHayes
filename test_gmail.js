const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');

async function main() {
    console.log("Testing SMTP...");
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "my.lisa.hayes.ai@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP connection successful!");
    } catch (error) {
        console.error("❌ SMTP connection failed:", error);
    }

    console.log("Testing IMAP...");
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: 'my.lisa.hayes.ai@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD
        },
        logger: false
    });

    try {
        await client.connect();
        console.log("✅ IMAP connection successful!");
        await client.logout();
    } catch (err) {
        console.error("❌ IMAP connection failed:", err);
    }
}

main();
