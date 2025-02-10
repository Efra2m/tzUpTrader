import NewTaskModal from "../NewTaskModal/NewTaskModal";
import styles from "./HeaderCard.module.scss";

type TaskStatus = "queue" | "development" | "done";

interface Task {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  workingTime?: string;
  endDate?: string | null;
  priority?: string;
  files?: string[];
  status: TaskStatus;
  subtasks?: { id: number; title: string; status: string }[];
}

interface HeaderCardProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentTask: Task | null;
  handleSave: (task: Task) => void;
  onDelete: (taskId: number) => void;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  projectName: string;
}
export default function HeaderCard({
  isModalOpen,
  setIsModalOpen,
  currentTask,
  handleSave,
  setCurrentTask,
  onDelete,
  searchTerm,
  setSearchTerm,
  projectName,
}: HeaderCardProps) {
  const handleSaveWithQueueStatus = (task: Task) => {
    const taskWithQueueStatus: Task = {
      ...task,
      status: "queue" as TaskStatus,
    };
    handleSave(taskWithQueueStatus);
  };
  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.taskBoardContainer}>
      <div className={styles.headerCard}>
        <div className={styles.headerContent}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>{projectName}</h2>
          </div>
          <div className={styles.actionArea}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск задачи"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <i className={`${styles.searchIcon} fas fa-search`} />
            </div>
            <button className={styles.newTaskButton} onClick={handleAddTask}>
              <img src="/plus.png" alt="plus" />
              Новая задача
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modalBackdrop">
          <NewTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveWithQueueStatus}
            task={currentTask}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}
