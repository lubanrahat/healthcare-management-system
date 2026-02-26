import { z } from "zod";

const envSchema = z.object({
  //App
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  //Database
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),
  //Frontend
  FRONTEND_URL: z.string().url().min(1, "FRONTEND_URL is required"),
  //Better auth
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url().min(1, "BETTER_AUTH_URL is required"),
  //Jwt Token
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  //cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  //Google
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  //Mail trap
  MAILTRAP_HOST: z.string().min(1, "MAILTRAP_HOST is required"),
  MAILTRAP_PORT: z.coerce.number().default(2525),
  MAILTRAP_USER: z.string().min(1, "MAILTRAP_USER is required"),
  MAILTRAP_PASS: z.string().min(1, "MAILTRAP_PASS is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.error) {
  console.error("Environment variable validation failed", {
    errors: parsedEnv.error.format(),
  });
  process.exit(1);
}

const env = parsedEnv.data;

export const config = {
  app: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
  },
  database: {
    url: env.DATABASE_URL,
  },
  frontend: {
    url: env.FRONTEND_URL,
  },
  betterAuth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
  },
  jwt: {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
    accessTokenExpires: env.ACCESS_TOKEN_EXPIRES_IN,
    refeshTokenSecret: env.REFRESH_TOKEN_SECRET,
    refeshTokenExpires: env.REFRESH_TOKEN_EXPIRES_IN,
  },
  cloudinary: {
    caloudinaryCloudName: env.CLOUDINARY_CLOUD_NAME,
    caloudinaryApiKey: env.CLOUDINARY_API_KEY,
    caloudinaryApiSecret: env.CLOUDINARY_API_SECRET,
  },
  google: {
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  mailTrap: {
    host: env.MAILTRAP_HOST,
    port: env.MAILTRAP_PORT,
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
};
