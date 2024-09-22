// pages/index.js
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import SearchBar from '../components/SearchBar';
import FolderList from '../components/Folder/FolderList';
import FileList from '../components/File/FileList';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { app } from '../Config/FirebaseConfig';
import { ParentFolderIdContext } from '../context/ParentFolderIdContext';
import { ShowToastContext } from '../context/ShowToastContext';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  const db = getFirestore(app);
  const { setParentFolderId } = useContext(ParentFolderIdContext);
  const { showToastMsg } = useContext(ShowToastContext);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else {
      setParentFolderId(0);
      fetchAndSetData();
    }
  }, [session, showToastMsg]);

  useEffect(() => {
    // Filter folders and files based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredFolders(folderList.filter(folder =>
      folder.name.toLowerCase().includes(lowercasedQuery)
    ));
    setFilteredFiles(fileList.filter(file =>
      file.name.toLowerCase().includes(lowercasedQuery)
    ));
  }, [searchQuery, folderList, fileList]);

  const fetchAndSetData = async () => {
    const foldersQuery = query(
      collection(db, 'Folders'),
      where('parentFolderId', '==', 0),
      where('createBy', '==', session.user.email)
    );

    const filesQuery = query(
      collection(db, 'files'),
      where('parentFolderId', '==', 0),
      where('createdBy', '==', session.user.email)
    );

    try {
      const [foldersSnapshot, filesSnapshot] = await Promise.all([
        getDocs(foldersQuery),
        getDocs(filesQuery)
      ]);

      const folders = foldersSnapshot.docs.map(doc => doc.data());
      const files = filesSnapshot.docs.map(doc => doc.data());

      setFolderList(folders);
      setFileList(files);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className='p-5'>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FolderList folderList={filteredFolders} />
      <FileList fileList={filteredFiles} />
    </div>
  );
}
