import { getArticleBySlug } from "@/lib/articles/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import Image from "next/image";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="mb-8">
          <Image
            src={article.cover_image}
            alt={article.title}
            width={1200}
            height={675}
            className="aspect-video w-full rounded-lg object-cover"
          />
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={article.author.avatar_url} />
                <AvatarFallback>
                  {article.author.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {article.author.full_name}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(article.created_at), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <MDXRemote
          source={article.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
            },
          }}
        />
      </article>
    </div>
  );
}
