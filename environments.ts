const environments = {
    local: {
        baseURL: "http://localhost:8080",
        users: {
            username: process.env.ADMIN_USER!,
            password: process.env.ADMIN_PASSWORD!,
        },
    },
    demo: {
        baseURL: "https://opensource-demo.orangehrmlive.com",
        users: {
            username: process.env.ADMIN_USER!,
            password: process.env.ADMIN_PASSWORD!,
        },
    },
}

type EnvName = keyof typeof environments;

const envName = (process.env.ENV || "demo") as EnvName;

if (!environments[envName]) {
    throw new Error(
        `Unknown environment: ${envName}. Valid options: ${Object.keys(environments).join(", ")}`,
    );
}

export const env = environments[envName];

if (!env.users.username || !env.users.password) {
  throw new Error('ADMIN_USER and ADMIN_PASSWORD must be set – copy .env.example to .env');
}