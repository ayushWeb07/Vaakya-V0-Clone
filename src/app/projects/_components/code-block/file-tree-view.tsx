"use client";
import React from "react";
import { TreeItem } from "./utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChevronDown, FileIcon, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ts interface
interface Props {
  fileTreeStructure: TreeItem[];
  selectedFile?: string | null;
  handleSetSelectedFile?: (fileName: string) => void;
}

interface TreeProps {
  treeItem: TreeItem;
  selectedFile?: string | null;
  handleSetSelectedFile?: (fileName: string) => void;
  parentPath: string;
}

// simple 1-tree structure
const Tree = ({
  treeItem,
  selectedFile,
  handleSetSelectedFile,
  parentPath,
}: TreeProps) => {
  const [name, ...items] = Array.isArray(treeItem) ? treeItem : [treeItem]; // extract the first file name and the rest as arr
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // if its a file
  if (items.length === 0) {
    return (
      <SidebarMenuButton
        isActive={selectedFile === currentPath}
        onClick={() => handleSetSelectedFile?.(currentPath)}
        className="cursor-pointer"
      >
        <FileIcon />
        <span>{name}</span>
      </SidebarMenuButton>
    );
  }

  // its a folder
  return (
    <SidebarMenuItem>
      <Collapsible>

        <CollapsibleTrigger className="cursor-pointer" asChild>
          <SidebarMenuButton>
            <ChevronDown />
            <FolderIcon />
            <span>{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items?.map((item, idx) => (
              <Tree
                key={idx}
                treeItem={item}
                selectedFile={selectedFile}
                handleSetSelectedFile={handleSetSelectedFile}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

// the main file tree structure
const FileTreeView = ({
  fileTreeStructure,
  selectedFile,
  handleSetSelectedFile,
}: Props) => {
  return (
    // <div>{JSON.stringify(fileTreeStructure)}</div>

    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full bg-background">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>

                {/* render the tree structure */}
                {
                  fileTreeStructure?.map((item, index) => <Tree key={index} treeItem={item} selectedFile={selectedFile} handleSetSelectedFile={handleSetSelectedFile} parentPath="" />)
                }

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default FileTreeView;
