import { NextFunction, Request, Response } from "express";
import * as multer from "multer";

const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/uploads");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
    },
  });

  const singleUpload = multer({ storage: storage }).single('image');
  const multipleUpload = multer({ storage: storage }).fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'profile_description', maxCount: 1 }
  ])

  return {
    singleUploadMiddleware: (req: Request, res: Response, next: NextFunction) => {
      singleUpload(req, res, function (error: any) {
        if (error instanceof multer.MulterError) {
          console.log("Multer Error:", error);
          return res.status(400).json({ error: error.message });
        } else if (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
        next();
      });
    },
    multipleUploadMiddleware: (req: Request, res: Response, next: NextFunction) => {
      multipleUpload(req, res, function (error: any) {
        if (error instanceof multer.MulterError) {
          console.log("Multer Error:", error);
          return res.status(400).json({ error: error.message });
        } else if (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
        next();
      });
    }
  };
};

export default uploadFile;
