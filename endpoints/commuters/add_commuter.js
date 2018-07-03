const
    Commuter = require('../../models/commuter'),
    {
        errs: {
            CONFILCT_ERROR,
            SERVER_ERROR
        }
    } = require('../../utils/errors'),
    {
        sendError,
        sendData
    } = require('../../utils/uni-response'),
    {
        hashPassword
    } = require('../../utils/security');

module.exports = (req, res, next) => {

    const
        input = Object.assign({}, req.body),
        {
            fb_id
        } = input;

    const
        saveNewCommuter = (commuter) => {
            return commuter.save()
                .then(data => data)
                .catch(err => {
                    throw err;
                });
        };

    checkexists = () => {
        return Commuter.findOne({
                fb_id
            })
            .then(data => data)
            .catch(err => {
                throw err;
            });
    };

    async function main() {
        try {
            if (await checkexists()) {
                sendError(res, CONFILCT_ERROR, "Commuter already exists");
            } else {
                const commuter = new Commuter(input);
                const a = await saveNewCommuter(commuter);
                sendData(res, "Commuter created", a);
            }
        } catch (e) {
            console.log(e);
            sendError(res, SERVER_ERROR, "Something went wrong");
        }
    }

    main();


};