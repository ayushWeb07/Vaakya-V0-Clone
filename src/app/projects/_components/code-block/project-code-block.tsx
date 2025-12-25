"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CodeBlockSnippet } from "./code-block-snippet";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChevronDown, Download } from "lucide-react";
import { CopyMessageIcon } from "../copy-message-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  convertFilesToTreeItems,
  downloadCodeFile,
  getFileExtension,
} from "./utils";
import styles from "../styles.module.css";
import FileTreeView from "./file-tree-view";

// ts interface
interface Props {
  sandboxFiles: Record<string, string>;
}

const ProjectCodeBlock = ({ sandboxFiles }: Props) => {
  // the current selected file
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    return Object.keys(sandboxFiles)?.length === 0
      ? null
      : Object.keys(sandboxFiles)[0];
  });

  // get the tree node structure
  const fileTreeStructure = useMemo(
    () => convertFilesToTreeItems(sandboxFiles),
    [sandboxFiles]
  );

  const handleSetSelectedFile = useCallback(
    (fileName: string) => {
      if (fileName in sandboxFiles) {
        setSelectedFile(fileName);
      }
    },
    [sandboxFiles]
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full border-border"
    >
      {/* file tree structure */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <FileTreeView fileTreeStructure={fileTreeStructure} selectedFile={selectedFile} handleSetSelectedFile={handleSetSelectedFile} />
      </ResizablePanel>

      <ResizableHandle />

      {/* the file's code */}
      <ResizablePanel defaultSize={70} maxSize={80} minSize={60}>
        {/* show the selected file's content */}
        {selectedFile && (
          <div className={`w-full h-full flex flex-col`}>
            {/* more info -> breadcrumb + icons */}
            <div className="w-full h-[5vh] bg-card py-3 px-5 border-b-2 border-border shrink-0 flex justify-between items-center">
              {/* breadcrumb */}
              <span className="text-neutral-300 text-sm font-medium">
                {selectedFile?.replace("/", " > ")}
              </span>

              {/* icons -> copy, download file */}
              <div className="flex justify-end items-center gap-5">
                {/* copy */}
                <CopyMessageIcon
                  message={sandboxFiles[selectedFile]}
                  toolTipText="Copy code"
                />

                {/* download */}
                <Tooltip>
                  <TooltipTrigger
                    className="cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300"
                    onClick={() =>
                      downloadCodeFile(selectedFile, sandboxFiles[selectedFile])
                    }
                  >
                    <Download size={15} />
                  </TooltipTrigger>

                  <TooltipContent className="bg-foreground px-3 py-1 rounded-lg text-xs font-medium">
                    Download file
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* file code */}
            <div className={`flex-1 overflow-auto ${styles.custom_scrollbar}`}>
              <CodeBlockSnippet
                code={sandboxFiles[selectedFile]}
                language={getFileExtension(selectedFile)}
              />
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProjectCodeBlock;
