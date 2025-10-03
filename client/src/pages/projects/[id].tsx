import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const projectId = params?.id;

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      // ✅ التصحيح هنا
      const res = await apiRequest("GET", `/api/projects/${projectId}`);
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (isError && error) console.error(error);
  }, [isError, error]);

  if (isLoading)
    return <div className="p-6">🔄 جاري تحميل بيانات المشروع...</div>;

  if (isError || !project)
    return <div className="p-6 text-red-500">❌ فشل في تحميل بيانات المشروع.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {project.framework && (
            <p><strong>🧩 الإطار:</strong> {project.framework}</p>
          )}
          {project.language && (
            <p><strong>🌐 اللغة:</strong> {project.language}</p>
          )}
          {project.status && (
            <p><strong>📦 الحالة:</strong> {project.status}</p>
          )}

          {project.sourceCode && (
            <div>
              <h3 className="font-semibold mb-1">💻 الكود المصدر:</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
                {project.sourceCode}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Button onClick={() => setLocation("/projects")}>
          ⬅ الرجوع إلى المشاريع
        </Button>
      </div>
    </div>
  );
}
