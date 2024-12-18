"use client";

import { Notification } from "@/lib/notifications/types";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  return (
    <DropdownMenuItem
      className="cursor-pointer p-4"
      onClick={() => onRead(notification.id)}
    >
      <div className="space-y-1">
        <p className="font-medium leading-none">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </p>
      </div>
    </DropdownMenuItem>
  );
}
