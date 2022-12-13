import jwt, { decode } from 'jsonwebtoken';

//User wants to like the post;
//click the like button => auth middleware(next) => controller function => so on;

const auth = async (req, res, next) => {
    try {
        // getting the token from req headers from front end and splitting it to get the token;
        const token = req.headers.authorization.split(" ")[1];

        // checking the if its jwt token or custom google oAuth token;
        const isCustomAuth = token.length < 500; //return true or false;

        let decodedData;

        //if token is given and custom true means the user has jwt token and verifying and assigning the reqUserId the id from token which we have assigned earlier while creating token;
        if (token && isCustomAuth){
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        }else{
            // means custom token;
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
                
        next();

    } catch (error) {
        console.log(error);
    }
}

export default auth;