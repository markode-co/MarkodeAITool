import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: () => fetcher<User>("/api/auth/user"),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
