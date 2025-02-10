import React, { useMemo, useCallback } from "react";
import TaskBoard from "../TaskBoard/TaskBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "../ProjectContext/ProjectContext";

const TaskBoardWrapper: React.FC = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const navigate = useNavigate();
  const { getProjectData, loading } = useProject();

  const trimmedProjectName = useMemo(
    () => projectName?.trim() || "",
    [projectName]
  );

  const projectData = useMemo(
    () => (trimmedProjectName ? getProjectData(trimmedProjectName) : null),
    [getProjectData, trimmedProjectName]
  );

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (!projectName) {
    return <div>Параметр projectName не задан</div>;
  }

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (!projectData) {
    return <div>Проект не найден</div>;
  }

  const { tasksCollection = { queue: [], development: [], done: [] } } =
    projectData;

  return (
    <TaskBoard
      projectName={projectData.name}
      tasksCollection={tasksCollection}
      onBack={handleBack}
    />
  );
};

export default TaskBoardWrapper;
