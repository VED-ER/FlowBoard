import { storage } from "@/appwrite"

const getImageUrl = (image: Image) => {
    const url = storage.getFilePreview(image.bucketId, image.fileId)

    return url
}

export default getImageUrl