// context/ParentFolderIdContext.js
import { createContext, useState } from 'react';

export const ParentFolderIdContext = createContext();

export const ParentFolderIdProvider = ({ children }) => {
  const [parentFolderId, setParentFolderId] = useState(null);

  return (
    <ParentFolderIdContext.Provider value={{ parentFolderId, setParentFolderId }}>
      {children}
    </ParentFolderIdContext.Provider>
  );
};
