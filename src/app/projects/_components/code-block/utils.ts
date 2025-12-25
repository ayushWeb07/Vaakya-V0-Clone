// get the file extension
const getFileExtension = (fileName: string): string => {
  const words = fileName.split(".");
  return words[words.length - 1];
};

// download the file
const downloadCodeFile = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ---

// ts interface for code file structure
export type TreeItem = string | [string, ...TreeItem[]];

interface TreeNode {
  [key: string]: TreeNode | null;
}

// convert the file names to proper tree node structure
const convertFilesToTreeItems = (files: Record<string, string>): TreeItem[] => {
  // Build a tree structure first
  const tree: TreeNode = {};

  // Sort files to ensure consistent ordering
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    // Navigate/create the tree structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Add the file (leaf node)
    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates it's a file
  }

  // Convert tree structure to TreeItem format
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a folder
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
};

export { getFileExtension, downloadCodeFile, convertFilesToTreeItems };
