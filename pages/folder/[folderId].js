import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../Config/FirebaseConfig';
import FolderList from '../../components/Folder/FolderList';
import FileList from '../../components/File/FileList';
import { useSession } from 'next-auth/react';
import SearchBar from '../../components/SearchBar';

function FolderDetails() {
  const router = useRouter();
  const { id } = router.query; // Folder ID
  const [folder, setFolder] = useState(null);
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (id) {
      const fetchFolderData = async () => {
        const folderDoc = await getDoc(doc(db, 'Folders', id));
        if (folderDoc.exists()) {
          setFolder(folderDoc.data());

          // Fetch subfolders
          const folderQuery = query(
            collection(db, 'Folders'),
            where('parentFolderId', '==', id)
          );
          const folderSnapshot = await getDocs(folderQuery);
          setFolderList(folderSnapshot.docs.map(doc => doc.data()));

          // Fetch files belonging to this folder
          const fileQuery = query(
            collection(db, 'files'),
            where('parentFolderId', '==', id)
          );
          const fileSnapshot = await getDocs(fileQuery);
          setFileList(fileSnapshot.docs.map(doc => doc.data()));

        } else {
          router.push('/404'); // Redirect if folder doesn't exist
        }
      };

      fetchFolderData();
    }
  }, [id]);

  return (
    <div className='p-5'>
      <SearchBar />
      <h2 className='text-[20px] font-bold mt-5'>{folder?.name}</h2>
      <FolderList folderList={folderList} isBig={false} />
      <FileList fileList={fileList} />
    </div>
  );
}

export default FolderDetails;
