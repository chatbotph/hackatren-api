
const
Commuter = require('../../models/commuter'),
{
   errs: {
    CONFILCT_ERROR,
    SERVER_ERROR
   }
} = require('../../utils/errors'),
{ sendError, sendData } = require('../../utils/uni-response')

module.exports = (req, res, next) => {

const 
    findCommuter = () => {
        return Commuter.find({})
            .then(data => data)
            .catch(err => {
                throw err;
            });
    };

async function main() {
    try {
        const f = await findCommuter();
        sendData(res, "Retrieved Commuters", f);

    } catch (e) {
        console.log(e);
        sendError(res, SERVER_ERROR, "Something went wrong");
    }
}

main();


};

