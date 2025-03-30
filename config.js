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

// End points
// Must start wiht a slash '/'
const MAGIC_LINK_VERIFICATION_ENDPOINT = "/api/magic/verify";

// Definations
const MAX_REGISTRATION_TRIES = 3;

// Objects
const REFRESH_TOKEN_OPTIONS = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: MAX_REFRESH_TOKEN_AGE
}



module.exports = {
    BRANDING,
    MAX_REFRESH_TOKEN_AGE,
    MAX_ACCESS_TOKEN_AGE,
    MAX_MAGIC_LINK_AGE,
    REFRESH_TOKEN_OPTIONS,
    SMALL_COOL_DOWN,
    BIG_COOL_DOWN,
    MAGIC_LINK_VERIFICATION_ENDPOINT,
    MAX_REGISTRATION_TRIES,
};