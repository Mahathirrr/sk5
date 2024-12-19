"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleForm } from "@/components/articles/article-form";
import { createArticle } from "@/lib/articles/api";
import { useToast } from "@/components/ui/use-toast";

export default function CreateArticlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await createArticle(data);
      toast({
        title: "Article created",
        description: "Your article has been created successfully.",
      });
      router.push("/instructor/articles");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
