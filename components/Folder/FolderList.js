import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import FolderItem from './FolderItem';
import FolderItemSmall from './FolderItemSmall';
import { ParentFolderIdContext } from '../../context/ParentFolderIdContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../Config/FirebaseConfig';

function FolderList({ folderList, isBig = true }) {
  const [activeFolder, setActiveFolder] = useState();
  const [allFolders, setAllFolders] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showRecent, setShowRecent] = useState(true);
  const router = useRouter();
  const { setParentFolderId } = useContext(ParentFolderIdContext);
  const db = getFirestore(app);

  // Determine if we are on the home page
  const isHomePage = router.pathname === '/';

  const fetchAllFolders = async () => {
    try {
      const folderCollection = collection(db, 'Folders');
      const folderSnapshot = await getDocs(folderCollection);
      const folders = folderSnapshot.docs.map(doc => doc.data());
      setAllFolders(folders);
    } catch (error) {
      console.error("Error fetching folders: ", error);
    }
  };

  useEffect(() => {
    if (showAll) {
      fetchAllFolders();
    }
  }, [showAll]);

  const onFolderClick = (index, item) => {
    setActiveFolder(index);
    if (setParentFolderId) {
      setParentFolderId(item.id);
    }
    router.push({
      pathname: "/folder/" + item.id,
      query: {
        name: item.name,
        id: item.id,
      },
    });
  };

  const handleViewAllClick = () => {
    setShowRecent(false);
    setShowAll(true);
  };

  const handleViewRecentClick = () => {
    setShowAll(false);
    setShowRecent(true);
  };

  return (
    <div className="p-5 mt-5 bg-white rounded-lg">
      {isHomePage && (
        <h2 className="text-[17px] font-bold items-center">
          {showRecent ? 'Recent Folders' : 'All Folders'}
          <span
            className="float-right text-blue-400 font-normal text-[13px] cursor-pointer"
            onClick={showRecent ? handleViewAllClick : handleViewRecentClick}
          >
            {showRecent ? 'View All' : 'View Recent'}
          </span>
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-3 gap-4">
        {(isHomePage ? (showRecent ? folderList : allFolders) : folderList).map((item, index) => (
          <div key={index} onClick={() => onFolderClick(index, item)}>
            {isBig ? <FolderItem folder={item} /> : <FolderItemSmall folder={item} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FolderList;

