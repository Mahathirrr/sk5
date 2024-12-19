import { getArticles } from "@/lib/articles/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";

export default async function InstructorArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your articles and create new content
          </p>
        </div>
        <Link href="/instructor/articles/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
