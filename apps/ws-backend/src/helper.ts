import jwt, { JwtPayload } from 'jsonwebtoken';
const { JWT_SECRET } = require('@repo/backend-common/config');

export function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log(decoded);

        if (!decoded || !decoded.id) {
            return null;  // Assuming you want to return null if the userId is not present
        }

        return decoded.id;  // Replace 'userId' with your actual token payload structure
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
