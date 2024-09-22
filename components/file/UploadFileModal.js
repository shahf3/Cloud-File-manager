import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { app } from "../../Config/FirebaseConfig";
import { useSession } from "next-auth/react";
import { ParentFolderIdContext } from "../../context/ParentFolderIdContext";
import { ShowToastContext } from "../../context/ShowToastContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function UploadFileModal({ closeModal }) {
  const { data: session } = useSession();
  const { parentFolderId, setParentFolderId } = useContext(
    ParentFolderIdContext
  );
  const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);

  const docId = Date.now();
  const db = getFirestore(app);
  const storage = getStorage(app);

  const onFileUpload = async (file) => {
  if (!file) return;

  if (file.size > 1000000) {  // 1 MB size limit
    setShowToastMsg("File is too large");
    return;
  }

  try {
    const docId = Date.now(); // Unique ID for file metadata
    const fileRef = ref(storage, `files/${file.name}`); // Reference to the file location in Firebase Storage
    await uploadBytes(fileRef, file); // Upload the file to Firebase Storage
    const downloadURL = await getDownloadURL(fileRef); // Get the file's download URL

    // Save file metadata in Firestore under the relevant folder
    await setDoc(doc(db, "files", docId.toString()), {
      name: file.name,
      type: file.name.split(".").pop(),
      size: file.size,
      modifiedAt: file.lastModified,
      createdBy: session.user.email,
      parentFolderId: parentFolderId, // The ID of the folder this file belongs to
      downloadURL: downloadURL, // Store the download URL
      id: docId
    });

    closeModal(true);
    setShowToastMsg("File Uploaded Successfully!");

  } catch (error) {
    console.error("Error uploading file: ", error);
    setShowToastMsg("Error uploading file");
  }
};

  
  return (
    <div>
      <form method="dialog" className="modal-box p-9 items-center w-[360px]">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <div
          className="w-full items-center 
        flex flex-col justify-center gap-3"
        >
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadFileModal;