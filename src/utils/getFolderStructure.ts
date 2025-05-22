export function getFolderStructure(rootPath: string, filePath: string) {
  return filePath.replace(rootPath, "");
}
