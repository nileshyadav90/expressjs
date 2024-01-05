const admin = require('firebase-admin');

 const validateToken = async (req, res, next) => {
    
    const token = req.headers['token'];
    try {
        if(token) {
            console.log('token here', token);
            const fireData = await admin.firestore().collection('tokens').doc(token.split("/")[0]).get();
            const data = fireData.data();
            if(data === undefined) {
                throw "";
            } else {
                if(token.split("/")[1] === data.userInfo.id) {
                    res.locals.user = data.userInfo.id;
                    next();
                } else {
                    throw "";
                }
            }
        } else {
            throw "";
        }
    } catch(e){
        console.error('error', e);
        res.status(500).json({ message: 'Token error' });
    }
}
module.exports.validateToken = validateToken;