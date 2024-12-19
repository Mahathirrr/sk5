"use client";

import { ArticleWithAuthor } from "@/lib/articles/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

interface ArticleCardProps {
  article: ArticleWithAuthor;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary">
        <CardHeader className="p-0">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={article.cover_image || "https://via.placeholder.com/640x360"}
              alt={article.title}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold">
            {article.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-4 p-4 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.avatar_url} />
              <AvatarFallback>
                {article.author.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{article.author.full_name}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.created_at), "dd MMM yyyy", {
              locale: id,
            })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
