import multer from "multer";

//use disk storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Public/Temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage})

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Determine destination based on file type
//     let uploadPath = './Public/Temp';
    
//     if (file.mimetype.startsWith('image/')) {
//       uploadPath = './Public/Temp/images';
//     } else if (file.mimetype.startsWith('video/')) {
//       uploadPath = './Public/Temp/videos';
//     } else if (file.mimetype === 'application/pdf') {
//       uploadPath = './Public/Temp/pdfs';
//     }
    
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     // Generate unique filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
    
//     // Create filename with timestamp and random number to prevent overwrites
//     const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
//     cb(null, filename);
//   }
// });

// // File filter to validate file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = {
//     'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
//     'video': ['video/mp4', 'video/mpeg', 'video/quicktime'],
//     'pdf': ['application/pdf']
//   };

//   // Determine file type
//   let fileType = null;
//   if (file.mimetype.startsWith('image/')) fileType = 'image';
//   else if (file.mimetype.startsWith('video/')) fileType = 'video';
//   else if (file.mimetype === 'application/pdf') fileType = 'pdf';

//   // Check if file type is allowed
//   if (fileType && allowedTypes[fileType].includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     // Reject file
//     cb(new Error(`Invalid file type. Only ${Object.keys(allowedTypes).join(', ')} are allowed.`), false);
//   }
// };

// // Configure multer with storage and file filter
// export const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     // Limit file size to 50MB
//     fileSize: 50 * 1024 * 1024 // 50 megabytes
//   }
// });

// // Middleware to handle multer errors
// export const handleMulterError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading.
//     return res.status(400).json({
//       success: false,
//       message: err.message || 'File upload error'
//     });
//   } else if (err) {
//     // An unknown error occurred when uploading.
//     return res.status(500).json({
//       success: false,
//       message: err.message || 'Unknown upload error'
//     });
//   }
//   next();
// };