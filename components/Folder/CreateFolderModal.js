import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { app } from '../../Config/FirebaseConfig';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { ShowToastContext } from '../../context/ShowToastContext';
import { ParentFolderIdContext } from '../../context/ParentFolderIdContext';

function CreateFolderModal() {
  const [folderName, setFolderName] = useState('');
  const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);
  const { data: session } = useSession();
  const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);
  const db = getFirestore(app);

  const onCreate = async () => {
    if (folderName.trim() === '') {
      setShowToastMsg('Folder name cannot be empty!');
      return;
    }

    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, 'Folders', docId), {
        name: folderName,
        id: docId,
        createdBy: session.user.email,
        parentFolderId: parentFolderId || null
      });
      setShowToastMsg('Folder Created!');
      document.getElementById('my_modal_3').close(); // Close the modal
    } catch (error) {
      console.error('Error creating folder:', error);
      setShowToastMsg('Error creating folder.');
    }
  };

  return (
    <div>
      <form method="dialog" className="modal-box p-9 items-center">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('my_modal_3').close()}>
          ✕
        </button>
        <div className="w-full items-center flex flex-col justify-center gap-3">
          <Image src="/folder.png" alt="folder" width={50} height={50} />
          <input
            type="text"
            placeholder="Folder Name"
            className="p-2 border-[1px] outline-none rounded-md"
            onChange={(e) => setFolderName(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white rounded-md p-2 px-3 w-full"
            onClick={onCreate}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFolderModal;

