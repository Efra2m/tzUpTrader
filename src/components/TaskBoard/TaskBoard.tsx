import React, { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../SortableItem/SortableItem";
import DroppableColumn from "../DroppableColumn/DroppableColumn";
import HeaderCard from "../HeaderCard/HeaderCard";
import { TaskStatus, Task, TasksCollection, TaskColumn } from "../types/types";

interface TaskBoardProps {
  projectName: string;
  tasksCollection: TasksCollection;
  onBack: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  projectName,
  tasksCollection,
  onBack,
}) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<TasksCollection>(() => {
    const stored = localStorage.getItem(`tasks_${projectName}`);
    return stored
      ? JSON.parse(stored)
      : tasksCollection || {
          queue: [],
          development: [],
          done: [],
        };
  });

  useEffect(() => {
    localStorage.setItem(`tasks_${projectName}`, JSON.stringify(tasks));
  }, [tasks, projectName]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = Number(active.id);
      const sourceColumn = Object.keys(tasks).find((key) =>
        tasks[key as keyof TasksCollection].find((task) => task.id === activeId)
      ) as keyof TasksCollection | undefined;

      const destinationColumn = over.data.current?.column as
        | keyof TasksCollection
        | undefined;

      if (
        sourceColumn &&
        destinationColumn &&
        sourceColumn !== destinationColumn
      ) {
        const sourceTasks = [...tasks[sourceColumn]];
        const destinationTasks = [...tasks[destinationColumn]];
        const movingTask = sourceTasks.find((task) => task.id === activeId);

        if (!movingTask) return;

        setTasks((prev) => ({
          ...prev,
          [sourceColumn]: sourceTasks.filter((task) => task.id !== activeId),
          [destinationColumn]: [
            ...destinationTasks,
            { ...movingTask, status: destinationColumn },
          ],
        }));
      }
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const activeId = Number(active.id);
        const overId = Number(over.id);
        const column = Object.keys(tasks).find((key): key is TaskColumn => {
          return tasks[key as TaskColumn].some((task) => task.id === activeId);
        });

        if (column) {
          const sortedTasks = arrayMove(
            tasks[column],
            tasks[column].findIndex((task) => task.id === activeId),
            tasks[column].findIndex((task) => task.id === overId)
          );

          setTasks((prev) => ({
            ...prev,
            [column]: sortedTasks,
          }));
        }
      }

      setActiveId(null);
    },
    [tasks, setTasks, setActiveId]
  );

  const filterTasks = useCallback(
    (task: Task): boolean => {
      if (searchTerm.trim() === "") return true;
      const lowerSearch = searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(lowerSearch);
      const idMatch = task.id.toString() === searchTerm.trim();
      return titleMatch || idMatch;
    },
    [searchTerm]
  );

  type TasksCollection = Record<TaskStatus, Task[]>;

  const handleViewTask = useCallback(
    (task: Task) => {
      setCurrentTask(task);
      setIsModalOpen(true);
    },
    [setCurrentTask, setIsModalOpen]
  );

  const handleSave = useCallback(
    (savedTask: Task): void => {
      setTasks((prevTasks) => {
        const updatedTasks: TasksCollection = { ...prevTasks };

        if (currentTask) {
          Object.keys(updatedTasks).forEach((column) => {
            const columnKey = column as TaskStatus;
            updatedTasks[columnKey] = updatedTasks[columnKey].map((t) =>
              t.id === savedTask.id ? savedTask : t
            );
          });
        } else {
          const status = savedTask.status;
          updatedTasks[status] = [...(updatedTasks[status] || []), savedTask];
        }
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
      setIsModalOpen(false);
      setCurrentTask(null);
    },
    [currentTask, setTasks, setIsModalOpen, setCurrentTask]
  );

  const deleteTask = useCallback(
    (taskId: number) => {
      const updatedTasksByStatus = (Object.keys(tasks) as TaskStatus[]).reduce(
        (acc, status) => {
          acc[status] = tasks[status].filter((task) => task.id !== taskId);
          return acc;
        },
        {} as Record<TaskStatus, Task[]>
      );
      setTasks(updatedTasksByStatus);
    },
    [tasks, setTasks]
  );

  return (
    <>
      <HeaderCard
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentTask={currentTask}
        handleSave={handleSave}
        onDelete={deleteTask}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentTask={setCurrentTask}
        projectName={projectName}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: "1px", marginLeft: "6px" }}>
          {Object.keys(tasks).map((column) => {
            const columnKey = column as keyof typeof tasks;
            const columnTasks = Array.isArray(tasks[columnKey])
              ? tasks[columnKey]
              : [];
            const filteredTasks = columnTasks.filter(filterTasks);

            return (
              <DroppableColumn
                key={column}
                items={filteredTasks.map((task) => task.id)}
                id={column}
              >
                <SortableContext
                  key={column}
                  items={filteredTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    style={{
                      backgroundColor: "#f2f2f2",
                      padding: "10px",
                    }}
                  >
                    <h3>{column.toUpperCase()}</h3>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <SortableItem key={task.id} id={task.id}>
                          <div
                            style={{
                              padding: "10px",
                              backgroundColor: "white",
                              marginBottom: "10px",
                            }}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            {task.createdAt && (
                              <p>Дата создания: {task.createdAt}</p>
                            )}
                            {task.workingTime && (
                              <p>Время работы: {task.workingTime}</p>
                            )}
                            {task.endDate && (
                              <p>Дата окончания: {task.endDate}</p>
                            )}
                            {task.priority && <p>Приоритет: {task.priority}</p>}
                            {task.files && task.files.length > 0 && (
                              <p>Файлы: {task.files.join(", ")}</p>
                            )}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div>
                                <h5>Подзадачи:</h5>
                                {task.subtasks.map((subtask) => (
                                  <div key={subtask.id}>
                                    <span>{subtask.title}</span> -{" "}
                                    <span>{subtask.status}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <button onClick={() => handleViewTask(task)}>
                              Посмотреть
                            </button>
                          </div>
                        </SortableItem>
                      ))
                    ) : (
                      <p>Нет задач, удовлетворяющих условиаю поиск</p>
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <div style={{ padding: "10px", backgroundColor: "white" }}>
              {Object.values(tasks)
                .flat()
                .find((task) => task.id === activeId)?.title ??
                "Перетаскивание"}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default TaskBoard;
