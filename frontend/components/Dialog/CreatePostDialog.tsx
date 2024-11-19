"use client";

import React, { useState } from 'react';
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

type CreatePostDialogProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
}

export function CreatePostDialog({ open, setIsDialogOpen }: CreatePostDialogProps) {
    const [book_description, setBookDescription] = useState('');
    const [post_description, setPostDescription] = useState('');
    const [serverError, setServerError] = useState<string | null>(null);

    const [lastResult, action] = useFormState(async (prevState: unknown, formData: FormData) => {
        const result = await CreatePost(prevState, formData);
        const submission: SubmissionResult = {status: "success",}

        if (result && result.message !== 'Post created successfully') {
            setServerError(result.message);
        }else{
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
        setServerError(null);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[70vw]  md:max-w-[80vw]  lg:max-w-[80vw] xl:max-w-[90vw] p-0">
        <ScrollArea className="h-[80vh] w-full">
          <div className="flex flex-col md:flex-row">
            <div
              className="w-full md:w-1/3 bg-cover bg-center h-48 md:h-auto"
              style={{ backgroundImage: 'url("/create_post.png")' }}
            />
            <div className="w-full md:w-2/3 p-6 bg-white">
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
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">Post</Button>
                </DialogFooter>
              </form>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>

    );
}