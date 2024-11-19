"use client";

import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

type CreatePostDialogProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
    filters: Filter[];
}

export function CreatePostDialog({ open, setIsDialogOpen, filters}: CreatePostDialogProps) {
    // Refresh feed Context to update the feed
    const { refreshFeed } = useFeed();

    const [book_description, setBookDescription] = useState('');
    const [post_description, setPostDescription] = useState('');
    const [serverError, setServerError] = useState<string[] | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const [lastResult, action] = useFormState(async (prevState: unknown, formData: FormData) => {
        selectedFilters.forEach((filter, index) => {
            formData.append("tags", (index+1).toString());
        });
        const result = await CreatePost(prevState, formData);
        const submission: SubmissionResult = {status: "success",}

        const [statusPart, messagePart] = result.message.split(", ");
        // Split the message into status and message parts
        const status = statusPart.split(": ")[1];
        const message = messagePart.split(": ")[1];

        if (status !== "200") {
            setServerError([status, message]);
        }else{
            toast.info(" ¡ The post has been added to our Home successfully ! ", {
                duration: 4000, progress: true, position: "bottom-center", transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
                    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                    'class="lucide lucide-check z-50"><path d="M20 6 9 17l-5-5"/></svg>',
                sonido: true,
            });
            refreshFeed();
            setIsDialogOpen(false);
        }

        return submission;
    }, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: createPostSchema });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const onOpenChange = () => {
        setIsDialogOpen(!open);
    }

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    )
  }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[80vw] p-0">
        <div className="flex flex-col md:flex-row h-full">
          <div
            className="w-full md:w-1/3 bg-cover bg-center h-48 md:h-full"
            style={{backgroundImage: 'url("/create_post.png")'}}
          />
          <ScrollArea className="h-[80vh] w-full md:w-2/3">
            <div className="p-6 bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4">Create New Post</DialogTitle>
              </DialogHeader>
                          <form
                              id={form.id}
                              action={action}
                              onSubmit={form.onSubmit}
                              className="space-y-6"
                          >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label htmlFor={fields.title.id} className="text-sm font-medium">
                                          Book Title
                                      </label>
                                      <Input
                                          id={fields.title.id}
                                          name={fields.title.name}
                                          placeholder="Enter book title"
                                          aria-invalid={!!fields.title.errors}
                                          aria-describedby={fields.title.errorId}
                                      />
                                      {fields.title.errors && (
                                          <p id={fields.title.errorId} className="text-xs text-red-500">
                                              {fields.title.errors}
                                          </p>
                                      )}
                                  </div>
                                  <div className="space-y-2">
                                      <label htmlFor={fields.author.id} className="text-sm font-medium">
                                          Author
                                      </label>
                                      <Input
                                          id={fields.author.id}
                                          name={fields.author.name}
                                          placeholder="Enter author name"
                                          aria-invalid={!!fields.author.errors}
                                          aria-describedby={fields.author.errorId}
                                      />
                                      {fields.author.errors && (
                                          <p id={fields.author.errorId} className="text-xs text-red-500">
                                              {fields.author.errors}
                                          </p>
                                      )}
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Filters</label>
                                  <div className="grid grid-cols-1">
                                      <select
                                          className="w-full border border-gray-300 rounded px-2 py-1"
                                          onChange={(e) => handleFilterChange(e.target.value)}
                                          value={''} // Asume que seleccionas un filtro a la vez
                                      >
                                          <option value="" disabled>
                                              Selecciona una opción
                                          </option>
                                          {Array.isArray(filters) && filters.map((filter) => (
                                              <option key={filter.id} value={filter.id}>
                                                  {filter.name}
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
                                              {filters.find((f) => f.id.toString() === filterId)?.name}
                                              <button
                                                  className="ml-1 text-blue-200 hover:text-blue-100"
                                                  onClick={() => handleFilterChange(filterId)}
                                              >
                                                  ×
                                              </button>
                                          </Badge>
                                      ))}
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label htmlFor="description" className="text-sm font-medium">
                                      Book Description
                                  </label>
                                  <Textarea
                                      id="description"
                                      name={fields.description.name}
                                      placeholder="Share your thoughts about the book..."
                                      rows={4}
                                      maxLength={200}
                                      onChange={(e) => setBookDescription(e.target.value)}
                                      aria-invalid={!!fields.description.errors}
                                      aria-describedby={fields.description.errorId}
                                  />
                                  <div className="flex justify-between text-xs">
                                      <span>{book_description.length}/200</span>
                                      {fields.description.errors && (
                                          <p id={fields.description.errorId} className="text-red-500">
                                              {fields.description.errors}
                                          </p>
                                      )}
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label htmlFor="post_description" className="text-sm font-medium">
                                      Your thoughts (Optional)
                                  </label>
                                  <Textarea
                                      id="post_description"
                                      name={fields.post_description.name}
                                      placeholder="Share your thoughts about the book..."
                                      rows={4}
                                      maxLength={200}
                                      onChange={(e) => setPostDescription(e.target.value)}
                                      aria-invalid={!!fields.post_description.errors}
                                      aria-describedby={fields.post_description.errorId}
                                  />
                                  <div className="flex justify-between text-xs">
                                      <span>{post_description.length}/200</span>
                                      {fields.post_description.errors && (
                                          <p id={fields.post_description.errorId} className="text-red-500">
                                              {fields.post_description.errors}
                                          </p>
                                      )}
                                  </div>
                              </div>
                              {serverError && (
                                  <div className="w-full">
                                      <Alert variant="destructive">
                                          <AlertDescription>{serverError[1]}</AlertDescription>
                                      </Alert>
                                  </div>
                              )}
                              {serverError && serverError[0] === "403" && (
                                  <Link
                                      href="/auth/sign-in"
                                      className="mt-4 w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                                  >
                                      Sign In
                                  </Link>
                              )}

                              <DialogFooter>
                                  <Button type="submit" className="w-full sm:w-auto">Post</Button>
                              </DialogFooter>
                          </form>
                      </div>
          </ScrollArea>
              </div>
      </DialogContent>
</Dialog>

)
    ;
}