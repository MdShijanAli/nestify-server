import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP } from "better-auth/plugins";
import axios from "axios";
import { envVars } from "../config/env";

// ------------------------
// Unified Email Function (Brevo API)
// ------------------------

async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Nestify Real Estate 🏠",
          email: envVars.APP_USER,
        },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text,
      },
      {
        headers: {
          "api-key": envVars.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    console.log("✅ Email sent via Brevo API:", {
      to: options.to,
      subject: options.subject,
      messageId: response.data?.messageId,
    });
    return response.data;
  } catch (error: any) {
    const providerError = {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
      to: options.to,
      subject: options.subject,
    };
    console.error("❌ Brevo Email API Error:", providerError);
    throw new Error(
      `Failed to send email via Brevo: ${JSON.stringify(providerError)}`,
    );
  }
}

// ------------------------
// BetterAuth Config
// ------------------------

export const auth = betterAuth({
  cookies: {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  },

  baseURL: (envVars.BETTER_AUTH_URL || "").trim(),

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://skill-bridge-client-by-shijan.netlify.app",
    (envVars.APP_URL || "").trim(),
    (envVars.CLIENT_URL || "").trim(),
  ].filter(Boolean),

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      firstName: { type: "string", required: false, fieldName: "first_name" },
      lastName: { type: "string", required: false, fieldName: "last_name" },
      phone: { type: "string", required: false },
      isActive: { type: "boolean", defaultValue: true },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  // ------------------------
  // Email Verification
  // ------------------------

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("[AUTH] Triggering verification email", {
        email: user.email,
      });

      const verificationUrl = `${envVars.APP_URL}/verify-email?token=${token}`;

      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Nestify Real Estate 🏠
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">
                        Verify Your Email Address
                      </h2>
                      <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Hi there! 👋
                      </p>
                      <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Thank you for signing up for <strong>Nestify Real Estate 🏠</strong>. To complete your registration and start exploring, please verify your email address by clicking the button below.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="margin: 35px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 10px 0 0; word-break: break-all;">
                        <a href="${url}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                          ${url}
                        </a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Security Notice -->
                  <tr>
                    <td style="padding: 0 40px 40px; border-top: 1px solid #e2e8f0;">
                      <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #f7fafc; border-radius: 8px; padding: 20px;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                              <strong>🔒 Security tip:</strong> If you didn't create an account with Nestify Real Estate 🏠, you can safely ignore this email. Your email address will not be used.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                        This verification link will expire in 24 hours.
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        © ${new Date().getFullYear()} Nestify Real Estate 🏠. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Additional Footer -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                  <tr>
                    <td style="text-align: center; padding: 0 20px;">
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                        You're receiving this email because you signed up for Nestify Real Estate 🏠.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await sendEmail({
        to: user.email,
        subject: "✨ Verify your email address - Nestify Real Estate 🏠",
        text: `Welcome to Nestify Real Estate 🏠!\n\nPlease verify your email address by clicking the following link:\n\n${url}\n\nIf you didn't create an account, you can safely ignore this email.\n\nThis link will expire in 24 hours.\n\n© ${new Date().getFullYear()} Nestify Real Estate 🏠. All rights reserved.`,
        html: htmlTemplate,
      });

      console.log("✅ Verification email sent");
    },

    autoSignInAfterVerification: true,
  },

  // ------------------------
  // Google OAuth
  // ------------------------

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: envVars.GOOGLE_CLIENT_ID as string,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // ------------------------
  // OTP Plugin
  // ------------------------

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Verification Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                          Nestify Real Estate 🏠
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 50px 40px; text-align: center;">
                        <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">
                          Your Verification Code
                        </h2>
                        <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Use the code below to verify your email address:
                        </p>
                        
                        <!-- OTP Code -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </p>
                        </div>
                        
                        <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          This code will expire in <strong>10 minutes</strong>.
                        </p>
                        <p style="margin: 10px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          Please enter this code to complete your ${type}.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                      <td style="padding: 0 40px 40px; border-top: 1px solid #e2e8f0;">
                        <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #fff5f5; border-radius: 8px; padding: 20px; border-left: 4px solid #f56565;">
                          <tr>
                            <td>
                              <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.6;">
                                <strong>⚠️ Security Alert:</strong> If you didn't request this code, please ignore this email. Someone may have entered your email address by mistake.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                          Never share this code with anyone.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          © ${new Date().getFullYear()} Nestify Real Estate 🏠. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Additional Footer -->
                  <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                      <td style="text-align: center; padding: 0 20px;">
                        <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                          You're receiving this email because you requested a verification code for Nestify Real Estate 🏠.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
          `;

        await sendEmail({
          to: email,
          subject: `🔐 Your Verification Code - Nestify Real Estate 🏠`,
          text: `Your Nestify Real Estate 🏠 verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\n© ${new Date().getFullYear()} Nestify Real Estate 🏠. All rights reserved.`,
          html: htmlTemplate,
        });

        console.log("✅ OTP email sent");
      },
    }),
  ],
});
