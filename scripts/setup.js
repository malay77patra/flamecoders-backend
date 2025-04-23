const User = require("@/db/models/user");

const setupAdmin = async () => {
    const admiEmail = process.env.ADMIN_EMAIL;
    console.log("Setting up admin...");

    if (!admiEmail) {
        console.error("❌ admiEmail is not set in environment variables.");
        return;
    }

    const admin = await User.findOne({ email: admiEmail });

    if (!admin) {
        console.error("❌ No user found with the admin email.");
        return;
    }

    admin.role = "admin";
    await admin.save();

    console.log(`✅ Admin setup complete.`);
};

module.exports = setupAdmin;
