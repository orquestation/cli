export function getFolderStructure(rootPath, filePath) {
  return filePath.replace(rootPath, "");
}
