"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPayment } from "@/lib/payments/api";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  courseId: string;
  courseTitle: string;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentDialog({
  courseId,
  courseTitle,
  price,
  open,
  onOpenChange,
  onSuccess,
}: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const payment = await createPayment({
        courseId,
        amount: price,
      });

      // Redirect to Midtrans payment page
      window.location.href = payment.paymentUrl;
    } catch (error) {
      toast({
        title: "Gagal memproses pembayaran",
        description:
          "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pembayaran Kursus</DialogTitle>
          <DialogDescription>
            Anda akan melakukan pembayaran untuk kursus {courseTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Pembayaran</span>
              <span className="text-lg font-bold">
                Rp {price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

