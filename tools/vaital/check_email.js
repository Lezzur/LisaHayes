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
    const f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'] });
    f.on('message', function(msg, seqno) {
      msg.on('body', function(stream, info) {
        simpleParser(stream, (err, mail) => {
          if (err) console.error(err);
          console.log('--- MESSAGE ---');
          console.log('Subject:', mail.subject);
          console.log('Text:', mail.text);
          // Look for confirmation link
          const linkMatch = mail.text.match(/https?:\/\/[^\s]+/);
          if (linkMatch) {
            console.log('FOUND LINK:', linkMatch[0]);
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
