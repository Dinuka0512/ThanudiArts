export async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) {
        throw new Error("Missing Cloudinary env vars. Create a .env file from .env.example.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
}
