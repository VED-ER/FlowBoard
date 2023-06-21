import { ID, storage } from "@/appwrite"

const uploadImage = async (file: File) => {
    if (!file) return

    const fileUploaded = await storage.createFile(
        'bucket id',
        ID.unique(),
        file
    )

    return fileUploaded
}

export default uploadImage