import fs from "fs";
import path from "path";

export enum MediaFolders {
  profile = "profile",
  images = "images",
  admin = "admin",
  agent = "agent",
  account = "account",
  products = "products",
}
// Function to save files to the specified folder
export const saveFiles = async (
  folder: string,
  ...files: (Express.Multer.File | undefined)[]
) => {
  files.forEach((file) => {
    if (file) {
      const filePath = path.resolve(
        process.cwd(),
        `media/${folder}/${file.filename}`
      );
      fs.writeFileSync(filePath, file.buffer as any);
      console.log("User file saved: ", filePath);
    }
  });
};

// Function to remove specified files
export const removeFiles = async (...filePaths: (string | undefined)[]) => {
  filePaths.forEach((filePath) => {
    if (filePath) {
      try {
        fs.unlinkSync(path.join(process.cwd(), filePath));
      } catch (error) {
        console.error(`Error removing file: ${filePath}`, error);
      }
    }
  });
};

// Function to remove specified folders
export const removeFolders = async (...filePaths: (string | undefined)[]) => {
  filePaths.forEach((filePath) => {
    if (filePath) {
      try {
        fs.rmdirSync(path.join(process.cwd(), filePath), { recursive: true });
      } catch (error) {
        console.error(`Error removing folder: ${filePath}`, error);
      }
    }
  });
};

// Function to create the necessary media folders
export const createMediaFolders = async () => {
  const folderPaths = [
    path.join(process.cwd(), "media"),
    path.join(process.cwd(), "media/images"),
    path.join(process.cwd(), "media/admin/avatar"),
    path.join(process.cwd(), "media/admin/ids"),
    path.join(process.cwd(), "media/teacher/avatar"),
    path.join(process.cwd(), "media/teacher/ids"),
    path.join(process.cwd(), "media/student/avatar"),
    path.join(process.cwd(), "media/student/ids"),
    path.join(process.cwd(), "media/parent/ids"),
  ];

  for (const folder of folderPaths) {
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`Directory created: ${folder}`);
      } catch (error) {
        console.error(`Error creating directory: ${folder}`, error);
      }
    }
  }
};

// Function to create a user-specific folder
export const createUserFolder = async (id: string, folder: MediaFolders) => {
  const userFolderPath = path.join(process.cwd(), `media/${folder}/${id}`);
  if (!fs.existsSync(userFolderPath)) {
    try {
      fs.mkdirSync(userFolderPath, { recursive: true });
      console.log(`User folder created: ${userFolderPath}`);
    } catch (error) {
      console.error(`Error creating user folder: ${userFolderPath}`, error);
    }
  }
};
