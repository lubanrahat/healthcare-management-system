import nodemailer from "nodemailer";
import { config } from "../../config/env";
import { logger } from "../logger/logger";
import AppError from "../errors/app-error";
import HttpStatus from "./http-status";
import ErrorCodes from "../errors/error-codes";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: config.mailTrap.host,
  port: Number(config.mailTrap.port),
  secure: false,
  auth: {
    user: config.mailTrap.user,
    pass: config.mailTrap.pass,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendMailOptions) => {
  try {
    const templatePath = path.join(__dirname, "../../templates", `${templateName}.ejs`);
    const template = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({    
      from: config.mailTrap.user,
      to,
      subject,
      html: template,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

  } catch (error: any) {    
    logger.error("Failed to send mail", error.message);
    throw new AppError(
      "Failed to send mail",
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
