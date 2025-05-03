// Brandings
const BRANDING = {
    name: "Flamecoders"
}


// Times
// must be in milliseconds
const MAX_REFRESH_TOKEN_AGE = 1000 * 60 * 60 * 24 * 15; // 15 days
const MAX_ACCESS_TOKEN_AGE = 1000 * 60 * 15; // 15 mins
const MAX_MAGIC_LINK_AGE = 1000 * 60 * 15; // 15 mins

const SMALL_COOL_DOWN = 1000 * 60 * 2; // 2 mins
const BIG_COOL_DOWN = 1000 * 60 * 30; // 30 mins


// Definations
const MAX_REGISTRATION_TRIES = 3;

// Objects
const REFRESH_TOKEN_OPTIONS = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: MAX_REFRESH_TOKEN_AGE
}

MAX_IMG_UPLOAD_SIEZE = 2 * 1024 * 1024; // 2 MB
MAX_AVT_UPLOAD_SIEZE = 1 * 1024 * 1024; // 1 MB
ALLOWED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp'];


module.exports = {
    BRANDING,
    MAX_REFRESH_TOKEN_AGE,
    MAX_ACCESS_TOKEN_AGE,
    MAX_MAGIC_LINK_AGE,
    REFRESH_TOKEN_OPTIONS,
    SMALL_COOL_DOWN,
    BIG_COOL_DOWN,
    MAX_REGISTRATION_TRIES,
    MAX_IMG_UPLOAD_SIEZE,
    MAX_AVT_UPLOAD_SIEZE,
    ALLOWED_IMG_TYPES,
};