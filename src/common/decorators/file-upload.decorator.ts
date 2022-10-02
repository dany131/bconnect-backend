import {applyDecorators, UseInterceptors} from "@nestjs/common";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {ApiBody, ApiConsumes} from "@nestjs/swagger";
import {fileMimetypeFilter} from "../filters";


export function FileUpload(fieldName: string = "file", required: boolean = false, localOptions?: MulterOptions) {
    return applyDecorators(
        UseInterceptors(FileInterceptor(fieldName, localOptions)),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            schema: {
                type: "object",
                required: required ? [fieldName] : [],
                properties: {
                    [fieldName]: {
                        type: "string",
                        format: "binary"
                    }
                }
            }
        })
    );
}

export function MultipleFilesUpload(fieldName: string = "files", maxCount: number, required: boolean = false, localOptions?: MulterOptions) {
    return applyDecorators(
        UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    files: {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'binary'
                        }
                    }
                }
            }
        })
    );
}

export function ImageUpload(fileName: string = "image", required: boolean = false) {
    return FileUpload(fileName, required, {
        fileFilter: fileMimetypeFilter("png", "jpg", "jpeg")
    });
}

export function ImagesUpload(fieldName: string = "images", maxCount: number, required: boolean = false) {
    return MultipleFilesUpload(fieldName, maxCount, required, {
        fileFilter: fileMimetypeFilter("png", "jpg", "jpeg")
    });
}

export function VideoUpload(fileName: string = "media", required: boolean = false) {
    return FileUpload(fileName, required, {
        fileFilter: fileMimetypeFilter("asf", "avi", "flv", "mpeg", "m4v", "mkv", "webm", "mp4")
    });
}

