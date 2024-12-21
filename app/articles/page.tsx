import { getArticles } from "@/lib/articles/api";
import { ArticleCard } from "@/components/articles/article-card";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="container flex-grow py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Artikel Terbaru</h1>
          <p className="mt-2 text-muted-foreground">
            Baca artikel terbaru seputar teknologi, pendidikan, dan pengembangan
            diri
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              Belum ada artikel tersedia saat ini.
            </p>
            <p className="text-sm text-muted-foreground">
              Silakan cek kembali nanti untuk artikel baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
