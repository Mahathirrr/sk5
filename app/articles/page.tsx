import { getArticles } from "@/lib/articles/api";
import { ArticleCard } from "@/components/articles/article-card";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Artikel Terbaru</h1>
        <p className="mt-2 text-muted-foreground">
          Baca artikel terbaru seputar teknologi, pendidikan, dan pengembangan
          diri
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
