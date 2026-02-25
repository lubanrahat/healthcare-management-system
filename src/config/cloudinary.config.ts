import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { config } from "./env";
import AppError from "../shared/errors/app-error";
import HttpStatus from "../shared/utils/http-status";
import ErrorCodes from "../shared/errors/error-codes";
import { logger } from "../shared/logger/logger";

cloudinary.config({
  cloud_name: config.cloudinary.caloudinaryCloudName,
  api_key: config.cloudinary.caloudinaryApiKey,
  api_secret: config.cloudinary.caloudinaryApiSecret,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(
      "File buffer and file name are required for upload",
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INTERNAL_ERROR,
    );
  }

  const extension = fileName.split(".").pop()?.toLocaleLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `ph-healthcare/${folder}/${uniqueName}`,
          folder: `ph-healthcare/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                "Failed to upload file to Cloudinary",
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCodes.INTERNAL_SERVER_ERROR,
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      logger.info(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    logger.error("Error deleting file from Cloudinary:", error);
    throw new AppError(
      "Failed to delete file from Cloudinary",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const cloudinaryUpload = cloudinary;
