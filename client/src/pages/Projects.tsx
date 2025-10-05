import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Folder, Calendar, Loader2, Search } from "lucide-react";

// دالة debounce مع إمكانية الإلغاء
function debounce<T extends (...args: any[]) => void>(func: T, wait = 300) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  (debounced as any).cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };
  return debounced as T & { cancel?: () => void };
}

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
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === جلب المشاريع من API ===
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiRequest("GET", "/api/projects");
        const data = await res.json();
        setProjects(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل المشاريع");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // === البحث مع تأخير بسيط (Debounce) ===
  const handleSearch = useCallback(
    debounce((term: string, list: Project[]) => {
      const filteredList = list.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.description?.toLowerCase().includes(term.toLowerCase())
      );
      setFiltered(filteredList);
    }, 400),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm, projects);
  }, [searchTerm, projects, handleSearch]);

  // === تنظيف الدالة عند فك تركيب المكون ===
  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  // === حالة التحميل ===
  if (loading)
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>جاري تحميل المشاريع...</span>
        </div>
      </div>
    );

  // === حالة الخطأ ===
  if (error)
    return (
      <div className="p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        ❌ {error}
      </div>
    );

  return (
    <div className="p-6 container mx-auto">
      {/* ==== رأس الصفحة ==== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Folder className="w-6 h-6 text-primary" />
          مشاريعي
        </h1>

        <Button
          className="flex items-center gap-2"
          onClick={() => setLocation("/templates")}
        >
          <Plus className="w-4 h-4" />
          مشروع جديد
        </Button>
      </div>

      {/* ==== شريط البحث ==== */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="ابحث عن مشروع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4"
        />
      </div>

      {/* ==== حالة لا توجد مشاريع ==== */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16 bg-muted/30 border-dashed">
          <CardContent>
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              لا توجد مشاريع مطابقة
            </h2>
            <p className="text-muted-foreground mb-4">
              جرب كتابة كلمة أخرى أو أنشئ مشروع جديد.
            </p>
            <Button onClick={() => setLocation("/templates")}>
              <Plus className="w-4 h-4 mr-2" />
              إنشاء مشروع جديد
            </Button>
          </CardContent>
        </Card>
      ) : (
        // ==== شبكة المشاريع ====
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className="feature-card cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => setLocation(`/projects/${project.id}`)}
            >
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  {project.status && <span>🧩 {project.status}</span>}
                  {project.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.createdAt).toLocaleDateString("ar-EG")}
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
