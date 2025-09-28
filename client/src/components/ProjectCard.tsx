import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Calendar, 
  ExternalLink, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import type { Project } from "@shared/schema";
import { useLanguage } from "./LanguageProvider";
import { Link } from "wouter";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

const statusIcons = {
  draft: Clock,
  building: Loader2,
  ready: CheckCircle,
  deployed: ExternalLink,
  error: AlertCircle,
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  building: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  ready: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  deployed: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
  error: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { t } = useLanguage();
  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons];

  return (
    <Card className="feature-card h-full flex flex-col" data-testid={`project-card-${project.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate mb-1" data-testid="project-name">
              {project.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2" data-testid="project-description">
              {project.description}
            </p>
          </div>
          <Badge className={`ml-2 ${statusColors[project.status as keyof typeof statusColors]}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {t(`project.status.${project.status}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            <Code2 className="w-3 h-3 mr-1" />
            {project.framework}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {project.language}
          </Badge>
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString('ar-SA') : t('date.unknown')}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Link href={`/editor/${project.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full" data-testid="button-edit">
            <Edit className="w-4 h-4 mr-2" />
            {t("button.edit")}
          </Button>
        </Link>
        
        {project.deployUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => project.deployUrl && window.open(project.deployUrl, '_blank')}
            data-testid="button-preview"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
        
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(project.id)}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            data-testid="button-delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
