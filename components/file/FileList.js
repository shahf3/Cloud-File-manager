import React from 'react';
import FileItem from './FileItem';

function FileList({ fileList }) {
  return (
    <div className='bg-white mt-5 p-5 rounded-lg'>
      <h2 className='text-[18px] font-bold'>Files</h2>
      <div className='grid grid-cols-1 md:grid-cols-4 text-[13px] font-semibold border-b-[1px] pb-2 mt-3 border-gray-300 text-gray-400'>
        <h2>Name</h2>
        <h2>Modified</h2>
        <h2>Size</h2>
        <h2></h2> {/* For actions like delete or download */}
      </div>
      {fileList && fileList.length > 0 ? (
        fileList.map((file, index) => (
          <FileItem key={file.id || index} file={file} />
        ))
      ) : (
        <p>No files available.</p>
      )}
    </div>
  );
}

export default FileList;
