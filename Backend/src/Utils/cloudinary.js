import {v2 as cloudinary} from 'cloudinary'
import { extractPublicId } from "cloudinary-build-url"
 import fs from 'fs'
//configuration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async(localFilePath)=>{
try {
    if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:'auto'
    })
    fs.unlinkSync(localFilePath)
    return response
} catch (error) {
    fs.unlinkSync(localFilePath)
    return null
}
}


// const deleteInCloudinary = async (fileUrl)=>{
//     try {
//         if(!fileUrl) {return null;}
//         const publicId=extractPublicId(fileUrl)
//         if(!publicId) {return null}
//         let resourceType = "image"; // Default to image
//         if (fileUrl.match(/\.(mp4|mkv|mov|avi)$/)) {
//             resourceType = "video";
//         } else if (fileUrl.match(/\.(mp3|wav)$/)) {
//             resourceType = "raw"; // For audio or other file types
//         }
        
//         const res= await cloudinary.uploader.destroy(publicId,{resource_type:resourceType})
//         console.log("Cloudinary response:", res);
//         return res
//     } catch (error) {
//         return null
//     }
// }


const deleteInCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) {
            console.warn("No file URL provided for deletion");
            return null;
        }

        const publicId = extractPublicId(fileUrl);
        if (!publicId) {
            console.warn("Could not extract public ID from URL");
            return null;
        }

        // More comprehensive resource type detection
        const resourceType = getResourceType(fileUrl);
        
        const res = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        console.log("Cloudinary deletion response:", res);

        // Check if deletion was successful
        if (res.result === 'ok' || res.result === 'not found') {
            return 'ok';
        } else {
            console.error("Cloudinary deletion failed", res);
            return null;
        }
    } catch (error) {
        console.error("Error in Cloudinary deletion:", error);
        return null;
    }
}

// Helper function for resource type detection
const getResourceType = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    const videoExtensions = ['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
    const rawExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'raw';
    if (rawExtensions.includes(extension)) return 'raw';
    
    return 'image'; // Default to image
}

export {uploadOnCloudinary,deleteInCloudinary }