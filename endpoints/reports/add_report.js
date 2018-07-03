const
    Report = require('../../models/report'),
    {
        errs: {
            CONFILCT_ERROR,
            SERVER_ERROR
        }
    } = require('../../utils/errors'),
    {
        sendError,
        sendData
    } = require('../../utils/uni-response')

module.exports = (req, res, next) => {

    const
        input = Object.assign({}, req.body),
        {
            fb_id
        } = input;

    const
        saveNewReport = (report) => {
            return report.save()
                .then(data => data)
                .catch(err => {
                    throw err;
                });
        };

    async function main() {
        try {
            const report = new Report(input);
            const a = await saveNewReport(report);
            sendData(res, "Report created", a);

        } catch (e) {
            console.log(e);
            sendError(res, SERVER_ERROR, "Something went wrong");
        }
    }

    main();


};