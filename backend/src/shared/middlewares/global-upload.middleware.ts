import { Request } from "express";
import multer from "multer";
import { v4 } from "uuid";
import { BadRequestError } from "../errors";

interface uploadOptions {
  fileType?: string[];
  maxSize?: number;
  fileFilter?(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ): void;
}

export const globalUploadMiddleware = (options?: uploadOptions) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, callback) {
      // Default file type check
      if (
        options?.fileType?.length &&
        !options?.fileType?.some((type) => file.mimetype.startsWith(type))
      ) {
        return callback(new BadRequestError("Invalid file format"));
      }

      // Default file size check
      if (file.size > (options?.maxSize || 2 * 1024 * 1024)) {
        return callback(new BadRequestError("Invalid file size"));
      }

      // Custom file filter if provided
      if (options?.fileFilter) {
        return options.fileFilter(req, file, callback);
      }

      // Generate unique filename based on mimetype
      const fileExtension = getFileExtension(file.mimetype);

      file.filename = `${v4()}.${fileExtension}`;
      callback(null, true);
    },
  });

const getFileExtension = (mimetype: string): string => {
  const mapping: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "image/svg+xml": "svg",
    "image/x-icon": "ico",
    "image/heif": "heif",
    "image/heic": "heic",
    "image/avif": "avif",
    "image/jp2": "jp2",
    "image/x-canon-cr2": "cr2",
    "image/x-adobe-dng": "dng",
    "image/x-raw": "raw",
    "image/vnd.microsoft.icon": "ico",
    "application/pdf": "pdf",
  };
  return mapping[mimetype] || "bin"; // Default to 'bin' if unknown
};
