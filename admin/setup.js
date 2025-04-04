const Admin = require("@models/admin");

const setupSuperAdmin = async () => {
    const superAdmiEmail = process.env.SUPER_ADMI_EMAIL;
    console.log("Setting up super admin...");

    if (!superAdmiEmail) {
        console.error("❌ superAdmiEmail is not set in environment variables.");
        return;
    }

    await Admin.updateOne(
        { email: superAdmiEmail },
        { $setOnInsert: { email: superAdmiEmail } },
        { upsert: true }
    );

    console.log(`✅ Super admin setup complete.`);
};

module.exports = setupSuperAdmin;
