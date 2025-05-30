import File, { IFile } from "./entities/File.js";
import promptFileHandler from "./promptFileHandler.js";
import srcFileHandler from "./srcFileHandler.js";
import log from "./utils/logger.js";

export default async function setDirection (file: IFile) {
    await file.loadContent();
    // TODO: review code
    if(file.original.type === "prompt") {
        await file.parseContent();

        log.warn(`Direction ${file.direction}`)
        if(file.direction === "osd-code") {
            await promptFileHandler(file);
        }
        if(file.direction === "code-osd") {
            //get code file from osd file
            const srcFile = new File({name:file.src.name, parentPath:file.src.parentPath});
            
            await srcFile.loadContent();
            await srcFileHandler(srcFile);
        }
    }

    if(file.original.type === "src") {
        await srcFileHandler(file);  
    }

}