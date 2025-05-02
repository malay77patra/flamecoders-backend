
function getJwtFormat(ms) {
    if (ms < 1000) throw new Error("Expiration time must be at least 1 second.");
    if (ms > 30 * 24 * 60 * 60 * 1000) throw new Error("Expiration time cannot exceed 30 days.");

    const seconds = ms / 1000;

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 60 * 60) return `${seconds / 60}m`;
    if (seconds < 24 * 60 * 60) return `${seconds / (60 * 60)}h`;
    return `${seconds / (24 * 60 * 60)}d`;
}

const getUserAvatarFilename = (userId, ext) => {
    return `user_${userId}_avatar.${ext}`;
  };

function getRandomAvatar() {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.random().toString(36).substring(7)}`;

}


module.exports = {
    getJwtFormat,
    getRandomAvatar,
    getUserAvatarFilename,
};