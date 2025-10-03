import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function ProjectsList() {
  const [, setLocation] = useLocation();

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/projects");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6">⏳ جاري تحميل المشاريع...</div>;
  if (isError) return <div className="p-6 text-red-500">❌ فشل تحميل المشاريع</div>;

  return (
    <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
      {projects && projects.length > 0 ? (
        projects.map((project: any) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition border border-border"
            onClick={() => setLocation(`/projects/${project.id}`)}
          >
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
              <p className="text-sm text-muted-foreground">
                {project.description || "لا يوجد وصف للمشروع"}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center text-muted-foreground">
          📂 لا توجد مشاريع حالياً.
        </div>
      )}
    </div>
  );
}
