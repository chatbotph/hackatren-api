const
    sgHelper = require('sendgrid').mail,
    KEY = process.env.SENDGRID_API_KEY,
    sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

exports.sendEmail = function (from, to, subject, body, callback) {
    let
        //configs
        sgFrom = new sgHelper.Email(from),
        sgTo = new sgHelper.Email(to),
        sgSubject = subject,
        sgContent = new sgHelper.Content('text/html', body),
        sgMail = new sgHelper.Mail(sgFrom, sgSubject, sgTo, sgContent),

        request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: sgMail.toJSON(),
        });

    return sg.API(request).
        then(data => {
            return data;
        }).catch(err => {
            return err;
        });
}

