import { Resend } from "resend";
import nodemailer from "nodemailer";

const {
  RESEND_API_KEY,
  NEXT_PUBLIC_APP_URL,
  RESET_TOKEN_EXPIRE_MINUTES,
  FROM_EMAIL,
  // SMTP fallback vars:
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} = process.env;

if (!RESEND_API_KEY) {
  console.warn("[lib/mail] RESEND_API_KEY not set — Resend will fail");
}
if (!FROM_EMAIL) {
  console.warn("[lib/mail] FROM_EMAIL not set — emails may be rejected");
}

const resend = new Resend(RESEND_API_KEY || "");

/**
 * Send reset email using Resend; fall back to SMTP if Resend refuses (unverified domain, testing mode, etc.)
 */
export async function sendResetEmail(toEmail: string, rawToken: string) {
  const origin = NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const expiresMins = RESET_TOKEN_EXPIRE_MINUTES || 60;
  const resetUrl = `${origin}/forgot/reset?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <div style="font-family: system-ui, Arial, sans-serif; line-height:1.4;">
      <p>You requested a password reset for your RobotiX account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in ${expiresMins} minutes.</p>
      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;

  // Try Resend first
  try {
    console.log("[lib/mail] Attempting to send via Resend to:", toEmail);
    console.log("[lib/mail] From email:", FROM_EMAIL || "no-reply@example.com");
    console.log("[lib/mail] Resend API key present:", !!RESEND_API_KEY);
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resp = await resend.emails.send({
      from: FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: "Reset your RobotiX password",
      html,
      text: `Open this link to reset your password: ${resetUrl}`,
    });

    console.log("[lib/mail] Resend response:", JSON.stringify(resp, null, 2));
    
    // Check if response indicates an error
    if (resp && 'error' in resp) {
      throw new Error(`Resend API error: ${JSON.stringify(resp.error)}`);
    }
    
    if (!resp || !resp.id) {
      console.warn("[lib/mail] Resend response missing ID:", resp);
    }
    
    return resp;
  } catch (err: any) {
    const msg = err?.message || JSON.stringify(err);
    const errorDetails = {
      message: msg,
      statusCode: err?.statusCode,
      name: err?.name,
      response: err?.response,
    };
    console.error("[lib/mail] Resend failed with details:", JSON.stringify(errorDetails, null, 2));

    // Detect common Resend errors that should trigger SMTP fallback or better error messages
    const isResendDomainError =
      (err && err.statusCode === 403) ||
      (err && err.statusCode === 401) ||
      /verify a domain/i.test(msg) ||
      /only send testing emails/i.test(msg) ||
      /invalid_from/i.test(msg) ||
      /Unauthorized/i.test(msg) ||
      /invalid api key/i.test(msg) ||
      /api key/i.test(msg) ||
      /domain/i.test(msg);
    
    const isResendConfigError = 
      /RESEND_API_KEY/i.test(msg) ||
      /not configured/i.test(msg) ||
      /missing/i.test(msg);

    // If it's a configuration error, throw immediately with clear message
    if (isResendConfigError) {
      throw new Error(`Resend configuration error: ${msg}. Please set RESEND_API_KEY in your environment variables.`);
    }
    
    if (!isResendDomainError) {
      // If error is something else, rethrow so caller can handle/log accordingly
      throw err;
    }

    // If SMTP creds are present, try SMTP fallback
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        console.log("[lib/mail] Falling back to SMTP transporter");
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT ? Number(SMTP_PORT) : 587,
          secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const mailResult = await transporter.sendMail({
          from: FROM_EMAIL || SMTP_USER,
          to: toEmail,
          subject: "Reset your RobotiX password",
          html,
          text: `Open this link to reset your password: ${resetUrl}`,
        });

        console.log("[lib/mail] SMTP fallback succeeded:", mailResult);
        return mailResult;
      } catch (smtpErr: any) {
        console.error("[lib/mail] SMTP fallback failed:", smtpErr?.message || smtpErr);
        // Re-throw combined error so API returns meaningful info during dev
        throw new Error(`Resend failed: ${msg}; SMTP fallback failed: ${smtpErr?.message || smtpErr}`);
      }
    }

    // No SMTP configured — surface helpful guidance
    throw new Error(
      `Resend rejected the send (testing/unverified domain). Either verify a sending domain in Resend or configure SMTP fallback. Resend error: ${msg}`
    );
  }
}

/**
 * Send a contact message to the club inbox using Resend, with SMTP fallback.
 * The recipient defaults to robotixclub@nitrr.ac.in but can be overridden with CONTACT_TO env.
 */
export async function sendContactEmail(fromName: string, fromEmail: string, message: string) {
  const CONTACT_TO = process.env.CONTACT_TO || "robotixclub@nitrr.ac.in";
  const safeName = (fromName || "").trim() || "Anonymous";
  const subject = `New contact message from ${safeName}`;
  const text = `From: ${safeName} <${fromEmail}>\n\n${message}`;
  const html = `
    <div style="font-family: system-ui, Arial, sans-serif; line-height:1.6;">
      <h2 style="margin:0 0 12px 0;">New Contact Message</h2>
      <p><strong>From:</strong> ${safeName} &lt;${fromEmail}&gt;</p>
      <div style="margin-top:12px; white-space:pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  // Try Resend first
  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const resp = await resend.emails.send({
      from: FROM_EMAIL || "onboarding@resend.dev",
      to: CONTACT_TO,
      subject,
      html,
      text,
      reply_to: fromEmail,
    } as any);

    if (resp && 'error' in resp) {
      throw new Error(`Resend API error: ${JSON.stringify((resp as any).error)}`);
    }
    return resp;
  } catch (err: any) {
    const msg = err?.message || String(err);

    // If SMTP creds are present, try SMTP fallback
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? Number(SMTP_PORT) : 587,
        secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailResult = await transporter.sendMail({
        from: FROM_EMAIL || SMTP_USER,
        to: CONTACT_TO,
        subject,
        html,
        text,
        replyTo: fromEmail,
      });
      return mailResult;
    }

    throw new Error(`Unable to send contact email: ${msg}`);
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send task assignment notification email to assignees
 */
export async function sendTaskAssignmentEmail(
  toEmail: string,
  toName: string,
  taskTitle: string,
  taskDescription: string,
  assignerName: string,
  dueDate: Date,
  priority: string,
  taskUrl?: string
) {
  const origin = NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const taskLink = taskUrl || `${origin}/dashboard/tasks`;
  
  const priorityColors: Record<string, string> = {
    high: "#dc2626",
    medium: "#f59e0b",
    low: "#10b981",
  };
  
  const priorityColor = priorityColors[priority.toLowerCase()] || "#6b7280";
  
  const html = `
    <div style="font-family: system-ui, Arial, sans-serif; line-height:1.6; max-width:600px; margin:0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Task Assigned</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Hello <strong>${escapeHtml(toName)}</strong>,
        </p>
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          You have been assigned a new task by <strong>${escapeHtml(assignerName)}</strong>.
        </p>
        
        <div style="background: #f9fafb; border-left: 4px solid ${priorityColor}; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px;">${escapeHtml(taskTitle)}</h2>
          <p style="color: #6b7280; margin: 10px 0; white-space: pre-wrap;">${escapeHtml(taskDescription || "No description provided.")}</p>
          <div style="margin-top: 15px; display: flex; gap: 20px; flex-wrap: wrap;">
            <div>
              <span style="color: #6b7280; font-size: 14px;">Priority:</span>
              <span style="background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 8px; text-transform: uppercase;">
                ${escapeHtml(priority)}
              </span>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 14px;">Due Date:</span>
              <span style="color: #111827; font-weight: 600; margin-left: 8px;">
                ${new Date(dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${taskLink}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View Task
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          This is an automated notification from RobotiX Task Management System.
        </p>
      </div>
    </div>
  `;

  const text = `
New Task Assigned

Hello ${toName},

You have been assigned a new task by ${assignerName}.

Task: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ""}
Priority: ${priority}
Due Date: ${new Date(dueDate).toLocaleDateString()}

View the task: ${taskLink}
  `;

  // Try Resend first
  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    
    const resp = await resend.emails.send({
      from: FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html,
      text,
    });

    if (resp && 'error' in resp) {
      throw new Error(`Resend API error: ${JSON.stringify((resp as any).error)}`);
    }
    return resp;
  } catch (err: any) {
    const msg = err?.message || String(err);

    // If SMTP creds are present, try SMTP fallback
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? Number(SMTP_PORT) : 587,
        secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailResult = await transporter.sendMail({
        from: FROM_EMAIL || SMTP_USER,
        to: toEmail,
        subject: `New Task Assigned: ${taskTitle}`,
        html,
        text,
      });
      return mailResult;
    }

    // Log error but don't throw - email failure shouldn't break task creation
    console.error(`[lib/mail] Failed to send task assignment email to ${toEmail}: ${msg}`);
    return null;
  }
}