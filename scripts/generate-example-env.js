const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const exampleEnvPath = path.join(__dirname, "..", ".env.example");

// ANSI color codes
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

// ASCII Banner
console.log(CYAN + BOLD + `
  _____ _   ___     __  _____                    _       _          ____                           _
 | ____| \\ | \\ \\   / / |_   _|__ _ __ ___  _ __ | | __ _| |_ ___   / ___| ___ _ __   ___ _ __ __ _| |_ ___  _ __
 |  _| |  \\| |\\ \\ / /    | |/ _ \\ '_ \` _ \\| '_ \\| |/ _\` | __/ _ \\ | |  _ / _ \\ '_ \\ / _ \\ '__/ _\` | __/ _ \\| '__|
 | |___| |\\  | \\ V /     | |  __/ | | | | | |_) | | (_| | ||  __/ | |_| |  __/ | | |  __/ | | (_| | || (_) | |
 |_____|_| \\_|  \\_/      |_|\\___|_| |_| |_| .__/|_|\\__,_|\\__\\___|  \\____|\\___|_| |_|\\___|_|  \\__,_|\\__\\___/|_|
                                          |_|
` + RESET);

// Watermark
console.log(DIM + "by Malay Patra ฅ≽^•⩊•^≼ฅ" + RESET + "\n");

if (!fs.existsSync(envPath)) {
    console.log(RED + BOLD + "❌ No .env file found!" + RESET);
    console.log(YELLOW + "⚠️  Please ensure you have a .env file before running this script." + RESET);
    process.exit(1);
}

console.log(GREEN + "✅ .env file detected. Generating .env.example template..." + RESET);

try {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const exampleEnvContent = envContent
        .split("\n")
        .map(line => {
            if (line.trim() && !line.startsWith("#")) {
                const [key] = line.split("=");
                return `${key}=`;
            }
            return line;
        })
        .join("\n");

    fs.writeFileSync(exampleEnvPath, exampleEnvContent, "utf-8");
    console.log(GREEN + BOLD + "🎉 .env.example has been successfully generated!" + RESET);
} catch (error) {
    console.error(RED + BOLD + "❌ Error generating .env.example:" + RESET, error.message);
    process.exit(1);
}
