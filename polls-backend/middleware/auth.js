import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        if(!req.headers.authorization)
            return res.status(401).json({ message: 'Sign In required for this action.'});

        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;

        if(token && isCustomAuth){
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = decoded?.id;
        } else {
            const decoded = jwt.decode(token);
            req.user = decoded?.sub;
        }

        next();
    } catch (err) {
        console.log(err);
    }
}
