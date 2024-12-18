"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAccessToken } from "@/lib/access-tokens/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  token: z.string().min(1, "Token tidak boleh kosong"),
});

interface AccessTokenDialogProps {
  courseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AccessTokenDialog({
  courseId,
  open,
  onOpenChange,
  onSuccess,
}: AccessTokenDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const success = await useAccessToken({
        token: values.token,
        courseId,
      });

      if (success) {
        toast({
          title: "Token berhasil digunakan",
          description: "Anda sekarang memiliki akses ke kursus ini.",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Token tidak valid",
          description:
            "Token yang Anda masukkan tidak valid atau sudah digunakan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal menggunakan token",
        description:
          "Terjadi kesalahan saat menggunakan token. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gunakan Token Akses</DialogTitle>
          <DialogDescription>
            Masukkan token akses untuk mendapatkan akses ke kursus ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Akses</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan token akses Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? "Memproses..." : "Gunakan Token"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

