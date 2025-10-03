import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
}

export default function Projects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiRequest("GET", "/api/projects");

        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "حدث خطأ غير متوقع أثناء تحميل المشاريع");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading)
    return <p className="p-6 text-gray-600">⏳ جاري تحميل المشاريع...</p>;

  if (error)
    return <p className="p-6 text-red-600">❌ {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📂 مشاريعي</h1>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">لا توجد مشاريع حالياً.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition bg-white"
              onClick={() => setLocation(`/projects/${project.id}`)}
            >
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-1">{project.name}</h2>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {project.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground flex gap-3">
                  {project.status && <span>🧩 الحالة: {project.status}</span>}
                  {project.createdAt && (
                    <span>
                      📅 {new Date(project.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
