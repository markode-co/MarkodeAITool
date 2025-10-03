import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: () => fetcher<User>("/api/auth/user"),
    retry: false,
  });

  console.log("🧩 useAuth state:", { user, isLoading, error });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
