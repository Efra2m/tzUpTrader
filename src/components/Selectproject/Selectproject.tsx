import React, { useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Selectproject.module.scss";
import { useProject } from "../ProjectContext/ProjectContext";

interface ProjectsCardsProps {
  onSelectProject: (projectName: string) => void;
  onAddProject: (name: string, description: string) => void;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectCardProps {
  project: Project;
  onNavigate: (projectName: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(
  ({ project, onNavigate }) => {
    const handleNavigate = useCallback(() => {
      onNavigate(project.name);
    }, [onNavigate, project.name]);

    return (
      <div className={styles.projectCard}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <button onClick={handleNavigate}>Перейти к проекту</button>
      </div>
    );
  }
);

const ProjectsCards: React.FC<ProjectsCardsProps> = ({
  onSelectProject,
  onAddProject,
}) => {
  const navigate = useNavigate();
  const { projectsList, loading } = useProject();

  useEffect(() => {}, [projectsList]);

  const handleNavigate = useCallback(
    (projectName: string) => {
      navigate(`/tasks/${projectName}`);
    },
    [navigate]
  );

  const renderedProjects = useMemo(() => {
    return projectsList.map((project: Project) => (
      <ProjectCard
        key={project.id}
        project={project}
        onNavigate={handleNavigate}
      />
    ));
  }, [projectsList, handleNavigate]);

  return (
    <div className={styles.projectscontainer}>
      {loading ? (
        <p>Загрузка проектов...</p>
      ) : projectsList.length > 0 ? (
        renderedProjects
      ) : (
        <p>Нет проектов. Добавьте новый проект через кнопку ниже.</p>
      )}
    </div>
  );
};

export default memo(ProjectsCards);
