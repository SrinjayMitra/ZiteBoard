const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
const SALT_ROUNDS = 10;
const BACKEND_URL = "http://localhost:3000/api/";
const WS_URL = "ws://localhost:8080";
const HTTP_URL = "http://localhost:3000/api";
const NEXTAUTH_SECRET = "SECRET";
const GOOGLE_CLIENT_ID = "981490127890-th3f9s1fe299a735jd9j7ib74f9tmkid.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
module.exports = { JWT_SECRET, SALT_ROUNDS,BACKEND_URL, NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,WS_URL,HTTP_URL };

