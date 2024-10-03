import React, { useCallback, useEffect } from "react"

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CloudArrowUpIcon } from "@heroicons/react/24/solid"
import { useDropzone } from "react-dropzone"

/**
 * Merge class names using twMerge and clsx
 * @param  {...ClassValue} inputs 
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Drag and drop zone for uploading files
 * @param {object} props
 * @param {ReactNode} [props.children] - Children to render
 * @param {string} [props.size="md"] - Size of the dropzone
 * @param {string} [props.className] - Additional class names
 * @param {string} [props.label="Upload File"] - Label to show when dragging files
 * @param {React.MutableRefObject} [props.openRef] - Reference to open the file dialog
 * @param {object} [props.accept={ 'image/*': [] }] - Accepted file types
 * @param {number} [props.maxFiles=1] - Maximum number of files to accept
 * @param {(files: File[]) => void} [props.onFiles] - Callback when files are dropped
 * @param {(error: Error) => void} [props.onError] - Callback when an error occurs
 * @returns {JSX.Element} DragDropzone Component
 */
export function DragDropzone({
    children,
    size = "md",
    className,
    label = "Upload File",
    openRef,
    accept = { 'image/*': [] },
    maxFiles = 1,
    onFiles,
    onError,
    ...props
}) {
    const onDrop = useCallback(acceptedFiles => {
        if (onFiles) {
            onFiles(acceptedFiles)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDropAccepted: onDrop,
        maxFiles: maxFiles,
        noClick: true,
        accept: accept,
        onError: (error) => {
            console.error(error)

            if (onError) onError(error)
        },
        onDropRejected: (fileRejections) => {
            const errorMessage = 'Invalid file type' + (fileRejections.length > 1 ? 's' : '')
            const error = { message: errorMessage, fileRejections }
            if (onError) onError(error)
        }
    })

    useEffect(() => {
        openRef.current = open
    }, [])

    return (
        <div
            {...getRootProps()}
            tabIndex={null}
            {...props}
            className={cn("pointer-events-none", props.className)}
        >
            <input {...getInputProps()} />

            <div className={cn(className, "transition-opacity pointer-events-auto flex flex-col",
                isDragActive ? "opacity-0" : "opacity-1"
            )}>
                {children}
            </div>

            <div className={cn("absolute inset-0 flex gap-4 items-center justify-center",
                isDragActive ? "opacity-1" : "opacity-0"
            )}>
                <CloudArrowUpIcon className={cn(size == "xl" ? "size-12" : size == "lg" ? "size-10" : size == "sm" ? "size-6" : "size-8")} />

                <h6 className={cn("text-center",
                    size == "xl" ? "text-2xl" : size == "lg" ? "text-xl" : size == "sm" ? "text-base" : "text-lg"
                )}>
                    {label}
                </h6>
            </div>
        </div>
    )
}