"use client";

import React, {useEffect, useRef, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "react-dom";
import { CreatePost } from "@/app/actions";
import {SubmissionResult, useForm} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createPostSchema } from "@/app/lib/zodSchemas";
import { Alert, AlertDescription} from "@/components/ui/alert";
import {ScrollArea} from "@/components/ui/scroll-area";
import { toast } from "nextjs-toast-notify";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import {useFeed} from "@/contex/FeedContext";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Filter} from "@/app/types/Filter";
import {Post} from "@/app/types/Post";
import {AlertCircle, Upload} from "lucide-react";
import Image from "next/image";
import {PostStorage} from "@/app/types/PostStorage";

// URL de la API de Azure Storage
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;

type CreatePostDialogProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
    user_id: number | undefined;
}
export function CreatePostDialog({ open, setIsDialogOpen, user_id }: CreatePostDialogProps) {
    const { addPost, filters} = useFeed();

    // The user can view the updated description of the book and the post up to 200 characters
    const [book_description, setBookDescription] = useState('');
    const [post_description, setPostDescription] = useState('');
    // If there is an error in the server, it will be displayed
    const [serverError, setServerError] = useState<{ status: number, message: string } | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

    // Image Control
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [lastResult, action] = useFormState(async (prevState: unknown, formData: FormData) => {
         try {
             const submission: SubmissionResult<string[]> | null | undefined = {status: "success"};
             // Sólo se puede enviar el formulario si se ha seleccionado un archivo
            if (fileInputRef.current?.files?.[0]) {

                // Añadir los tags seleccionados
                console.log("SELECTED FILTERS", selectedFilters);
                formData.append('filter_ids', JSON.stringify(selectedFilters));
                const result = await CreatePost(prevState, formData);

                if (result.status !== 200) {
                    setServerError({status: result.status, message: result.message});
                } else {
                    // Ahora creo el nuevo PostStorage con componentes vacíos
                    if (result.data === null) {
                        return
                    }
                    const newPostStorage: PostStorage = result.data;
                    const resultPost: Post = newPostStorage.post;

                    const imageFile = fileInputRef.current.files[0];

                    console.log("SASS", NEXT_PUBLIC_AZURE_SAS_STORAGE);
                    console.log("URL", NEXT_PUBLIC_STORAGE_BOOKS + `/${resultPost.book_id}.png?${NEXT_PUBLIC_AZURE_SAS_STORAGE}`);

                    const imageUploadResponse = await fetch(NEXT_PUBLIC_STORAGE_BOOKS + `/${resultPost.book_id}.png?${NEXT_PUBLIC_AZURE_SAS_STORAGE}`, {
                        method: 'PUT',
                        body: imageFile,
                        headers: {
                            'Content-Type': 'image/png',
                            'x-ms-blob-type': 'BlockBlob',
                            'x-ms-date': new Date().toUTCString(),
                        }
                    });

                    console.log("RESPONSE", imageUploadResponse.status);
                    if (imageUploadResponse.status !== 201) {
                        throw new Error('Image upload failed');
                    }

                    toast.info("¡ The post has been added to our Home successfully !", {
                        duration: 4000, progress: true, position: "bottom-center", transition: "swingInverted",
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
                            'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                            'class="lucide lucide-check z-50"><path d="M20 6 9 17l-5-5"/></svg>',
                        sonido: true,
                    });

                    if (newPostStorage) addPost(newPostStorage);
                    setIsDialogOpen(false);
                }
            } else {
                setServerError({status: 400, message: 'Please select an image to upload'});
            }

        return submission;
    } catch (error: any) {
        toast.error(error.message, {
            duration: 4000, progress: true, position: "bottom-center", transition: "swingInverted",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
                'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                'class="lucide lucide-check z-50"><path d="M20 6 9 17l-5-5"/></svg>',
            sonido: true,
        });

        console.error('Error during form submission:', error);
        setServerError({ status: 500, message: error.message});
        return { status: "error" };
    }
}, undefined);

    const [form, fields] = useForm({
        lastResult : lastResult as SubmissionResult<string[]> | null | undefined,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: createPostSchema });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const onOpenChange = () => {
        if(open) setServerError(null);
        setIsDialogOpen(!open);
    }

    const handleFilterChange = (filterName: string) => {
        // Search the filter id by name
        const filterId = Object.keys(filters).find((key) => filters[parseInt(key)] === filterName);
        if (filterId) {
            setSelectedFilters((prevFilters) => {
                if (prevFilters.includes(parseInt(filterId))) {
                    return prevFilters.filter((id) => id !== parseInt(filterId));
                } else {
                    return [...prevFilters, parseInt(filterId)];
                }
            });
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[80vw] p-0 border-0">
            <DialogClose
                className="absolute top-10 right-4 md:top-2 text-white bg-black hover:bg-gray-500 rounded-full p-2 z-10"
                onClick={() => setIsDialogOpen(false)}
            >
                ✖ {/* Icono o texto */}
            </DialogClose>
                <div className="flex flex-col md:flex-row">
                    <div
                        className="w-full md:w-1/3 bg-cover bg-center h-48 md:h-full"
                        style={{backgroundImage: 'url("/create_post.png")'}}
                    />
                    <ScrollArea className="h-[80vh] w-full md:w-2/3">
                        <div className="p-6 bg-[#051B32]">
                            <DialogHeader>
                                <DialogTitle className="text-gray-100 text-2xl font-bold mb-4">Create New Post</DialogTitle>
                            </DialogHeader>
                            <form
                                id={form.id}
                                action={action}
                                onSubmit={form.onSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor={fields.title.id} className="text-gray-200 text-sm font-medium">
                                            Book Title
                                        </label>
                                        <Input
                                            className="text-gray-300"
                                            id={fields.title.id}
                                            name={fields.title.name}
                                            placeholder="Enter book title"
                                            aria-invalid={!!fields.title.errors}
                                            aria-describedby={fields.title.errorId}
                                        />
                                        {fields.title.errors && (
                                            <p id={fields.title.errorId} className="text-xs text-red-400">
                                                {fields.title.errors}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor={fields.author.id} className="text-gray-200 text-sm font-medium">
                                            Author
                                        </label>
                                        <Input
                                            className="text-gray-300"
                                            id={fields.author.id}
                                            name={fields.author.name}
                                            placeholder="Enter author name"
                                            aria-invalid={!!fields.author.errors}
                                            aria-describedby={fields.author.errorId}
                                        />
                                        {fields.author.errors && (
                                            <p id={fields.author.errorId} className="text-xs text-red-400">
                                                {fields.author.errors}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-200 text-sm font-medium">Filters</label>
                                    <div className="grid grid-cols-1">
                                        <select
                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-600"
                                            onChange={(e) => handleFilterChange(e.target.value)}
                                            value={''}
                                        >
                                            <option value="" disabled>
                                                Selecciona una opción
                                            </option>

                                            {filters && Object.values(filters).map((filter, index) => (
                                                <option key={index} value={filter}>
                                                    {filter}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedFilters.map((filterId) => (
                                            <Badge
                                                key={filterId}
                                                variant="default"
                                                className="bg-gradient-to-br from-gray-300 via-blue-800   to-gray-800 p-1
                                    hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200"
                                            >
                                                {filters[filterId]}
                                                <button
                                                    className="ml-1 text-blue-200 hover:text-blue-100"
                                                    onClick={() => handleFilterChange(filters[filterId])}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-gray-200 text-sm font-medium">
                                        Book Description
                                    </label>
                                    <Textarea
                                        className="text-gray-300"
                                        id="description"
                                        name={fields.description.name}
                                        placeholder="Share your thoughts about the book..."
                                        rows={4}
                                        maxLength={200}
                                        onChange={(e) => setBookDescription(e.target.value)}
                                        aria-invalid={!!fields.description.errors}
                                        aria-describedby={fields.description.errorId}
                                    />
                                    <div className="flex justify-between text-gray-400 text-xs">
                                        <span>{book_description.length}/200</span>
                                        {fields.description.errors && (
                                            <p id={fields.description.errorId} className="text-red-400">
                                                {fields.description.errors}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="post_description" className="text-gray-200 text-sm font-medium">
                                        Your thoughts (Optional)
                                    </label>
                                    <Textarea
                                        className="text-gray-300"
                                        id="post_description"
                                        name={fields.post_description.name}
                                        placeholder="Share your thoughts about the book..."
                                        rows={4}
                                        maxLength={200}
                                        onChange={(e) => setPostDescription(e.target.value)}
                                        aria-invalid={!!fields.post_description.errors}
                                        aria-describedby={fields.post_description.errorId}
                                    />
                                    <div className="flex justify-between text-gray-400 text-xs">
                                        <span>{post_description.length}/200</span>
                                        {fields.post_description.errors && (
                                            <p id={fields.post_description.errorId} className="text-red-400">
                                                {fields.post_description.errors}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="image-upload" className="text-gray-200 text-sm font-medium">
                                        Upload Image
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-gray-600 hover:bg-gray-400"
                                        >
                                            <Upload className="w-4 h-4 mr-2"/>
                                            Choose Image
                                        </Button>
                                        {imagePreview && (
                                            <Image
                                                src={imagePreview}
                                                width={64} height={64}
                                                alt="Preview"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                    </div>
                                </div>
                                {serverError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertDescription>{serverError.message}</AlertDescription>
                                    </Alert>
                                )}
                                {serverError && serverError.status === 403 && (
                                    <Link
                                        href="/sign-in"
                                        className="mt-4 w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                                    >
                                        Sign In
                                    </Link>
                                )}
                                <DialogFooter>
                                    <Button type="submit" className="w-full sm:w-auto hover:bg-blue-800">Post</Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}