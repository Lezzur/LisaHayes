const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {
  user: 'my.lisa.hayes.ai@gmail.com',
  password: process.env.GMAIL_APP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    const totalMessages = box.messages.total;
    const fetchStart = 1; // Get ALL messages for full check
    const f = imap.seq.fetch(fetchStart + ':*', { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT','1'] });
    f.on('message', function(msg, seqno) {
      msg.on('body', function(stream, info) {
        console.log('Body Info:', JSON.stringify(info));
        simpleParser(stream, (err, mail) => {
          if (err) console.error(err);
          console.log('--- MESSAGE ---');
          console.log('Subject:', mail.subject);
          console.log('Text snippet:', mail.text ? mail.text.substring(0, 500) : '[No Text]');
          console.log('HTML snippet:', mail.html ? mail.html.substring(0, 500) : '[No HTML]');
          // Look for confirmation link
          const body = mail.text || mail.html;
          if (body) {
            const linkMatch = body.match(/https?:\/\/[^\s"<>]+/);
            if (linkMatch) {
              console.log('FOUND LINK:', linkMatch[0]);
            }
          }
        });
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.connect();
