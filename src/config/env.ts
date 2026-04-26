import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  CLIENT_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  BREVO_API_KEY: string;
  APP_USER: string;
  APP_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
    "PORT",
    "CLIENT_URL",
    "BREVO_API_KEY",
    "APP_USER",
    "APP_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required but not set.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL || "",
    CLIENT_URL:
      process.env.CLIENT_URL || "https://buddy-script-app.netlify.app",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
    BETTER_AUTH_URL:
      process.env.BETTER_AUTH_URL ||
      "https://buddy-script-server-oerv.onrender.com",
    BREVO_API_KEY: process.env.BREVO_API_KEY || "",
    APP_USER: process.env.APP_USER || "",
    APP_URL: process.env.APP_URL || "https://buddy-script-app.netlify.app",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };
};

export const envVars = loadEnvVariables();
