import { FC, useState, useCallback } from "react";
import { useProject } from "../ProjectContext/ProjectContext";
import TaskBoard from "../TaskBoard/TaskBoard";
import ProjectsCards from "../Selectproject/Selectproject";

const ProjectsContainer: FC = () => {
  const { projectsList, addProject } = useProject();
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(
    null
  );

  const handleProjectSelect = useCallback((projectName: string) => {
    setSelectedProjectName(projectName.trim());
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProjectName(null);
  }, []);

  const handleAddProject = useCallback(
    (name: string, description: string) => {
      addProject(name.trim(), description.trim());
    },
    [addProject]
  );

  if (selectedProjectName) {
    const project = projectsList.find(
      (p) => p.name.trim() === selectedProjectName
    );

    if (!project) {
      return <div>Проект не найден</div>;
    }

    const tasksCollection = project.tasksCollection || {
      queue: [],
      development: [],
      done: [],
    };
    return (
      <TaskBoard
        projectName={selectedProjectName}
        tasksCollection={tasksCollection}
        onBack={handleBack}
      />
    );
  }
  return (
    <ProjectsCards
      onSelectProject={handleProjectSelect}
      onAddProject={handleAddProject}
    />
  );
};

export default ProjectsContainer;
