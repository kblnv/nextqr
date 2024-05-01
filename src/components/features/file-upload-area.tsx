import React, { useState } from "react";

interface FileUploadAreaProps {
  processFile: (file: FileList | null) => void;
  children: React.ReactNode;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  processFile,
  children,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOn: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragOff: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragging(false);
    processFile(event.dataTransfer.files);
  };

  return (
    <div
      className={
        dragging
          ? "flex flex-1 items-center justify-center rounded-lg border border-dashed border-blue-500 px-4 shadow-sm"
          : "flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm"
      }
      onDragOver={handleDragOn}
      onDragEnter={handleDragOn}
      onDragLeave={handleDragOff}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export { FileUploadArea };
