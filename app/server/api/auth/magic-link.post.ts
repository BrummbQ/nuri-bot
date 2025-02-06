import nodemailer from "nodemailer";
import crypto from "crypto";
import { insertMagicLink, findOrInsertUser } from "~/lib/db";

interface MagicLinkBody {
  email: string;
}

function getAppUrl(): string {
  if (process.env.NODE_ENV === "production") {
    return `https://nuribot.de`;
  } else {
    return `http://localhost:3000`;
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MagicLinkBody>(event);

  if (body?.email == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  const user = await findOrInsertUser(body.email);

  // Create a token
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

  // Create magic link
  const appUrl = getAppUrl();
  const magicLink = `${appUrl}/auth/verify?token=${token}`;
  await insertMagicLink(token, user.id, expiresAt);

  // Send email with magic link
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    auth: {
      user: process.env.EMAIL_SMTP_LOGIN,
      pass: process.env.EMAIL_SMTP_PW,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: body.email,
    subject: "Nuri Login Link",
    text: `Hier klicken zum einloggen: ${magicLink}`,
    html: `<p>Klicke <a href="${magicLink}">hier</a> zum einloggen.</p>`,
  });

  return { message: "Success" };
});
