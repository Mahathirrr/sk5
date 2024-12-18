"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Notification, NotificationState } from "./types";
import { useAuth } from "@/lib/auth/hooks";

export function useNotifications(): NotificationState & {
  markAsRead: (notificationId: string) => Promise<void>;
} {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Load initial notifications
    const loadNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setState({
          notifications: data,
          unreadCount: data.filter((n) => !n.read).length,
        });
      }
    };

    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setState((prev) => ({
            notifications: [newNotification, ...prev.notifications],
            unreadCount: prev.unreadCount + 1,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    setState((prev) => ({
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }));
  };

  return {
    ...state,
    markAsRead,
  };
}
