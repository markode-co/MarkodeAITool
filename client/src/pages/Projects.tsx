import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiRequest("/api/projects");
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p>جاري تحميل المشاريع...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">مشاريعي</h1>
      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="border p-2 rounded bg-white shadow-sm">
            <h3 className="font-medium">{p.name}</h3>
            <p className="text-gray-600">{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
