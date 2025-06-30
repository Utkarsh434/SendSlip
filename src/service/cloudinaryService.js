import axios from "axios";

export const uploadInvoiceThumbnail =  async(imageData)=>{
    const formData = new FormData();
    formData.append('file',imageData);
    formData.append('upload_preset','SendSlip');
    formData.append('cloud_name',"drjnxoeje");

    const response = await axios.post(`https://api.cloudinary.com/v1_1/drjnxoeje/image/upload`,formData);

    return response.data.secure_url
}