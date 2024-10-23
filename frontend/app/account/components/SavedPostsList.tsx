// app/account/components/SavedPostsList.tsx
'use client';

import React from "react";

const savedPosts = [
  { id: 1, content: "Top 10 Classic Novels", author: "bookworm42" },
  { id: 2, content: "Review: Bestseller", author: "litcritic99" },
];

export default function SavedPostsList() {
  return (
      <div className="space-y-4 pb-4">
        {savedPosts.length > 0 ? (
            savedPosts.map(post => (
                <div key={post.id} className="bg-gray-50 p-4 rounded-lg">
                  <p>{post.content}</p>
                  <p className="text-sm text-gray-600 mt-2">Posted by: {post.author}</p>
                </div>
            ))
        ) : (
            <p>You have not saved any posts yet.</p>
        )}
      </div>
  );
}
