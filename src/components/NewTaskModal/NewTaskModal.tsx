import { useState, ChangeEvent, useEffect } from "react";
import styles from "./NewTaskModal.module.scss";
import CommentsSection from "../CommentData/CommentData";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
  onDelete: (taskId: number) => void;
}

interface NewTask {
  id: number;
  taskNumber?: string;
  title: string;
  description: string;
  createdAt?: string;
  workingTime?: string;
  dueDate?: string;
  priority?: string;
  files?: string[];
  status?: string;
  subtasks?: { id: number; title: string; status: string }[];
}

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

interface Subtask {
  id: number;
  title: string;
  status: string;
}

interface Task extends NewTask {
  id: number;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  onDelete,
}) => {
  const [taskNumber, setTaskNumber] = useState(task?.taskNumber ?? "");
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [createdAt, setCreatedAt] = useState(task?.createdAt ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "medium");
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(
    task?.status ?? "queue"
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks ?? []);
  const [files, setFiles] = useState<string[]>(task?.files ?? []);
  const [workingTime, setWorkingTime] = useState(task?.workingTime ?? "");

  useEffect(() => {
    if (task) {
      setTaskNumber(task.taskNumber ?? "");
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setCreatedAt(task.createdAt ?? "");
      setDueDate(task.dueDate ?? "");
      setPriority(task.priority ?? "medium");
      setCurrentStatus(task.status ?? "Открыта");
      setSubtasks(task.subtasks ?? []);
      setFiles(task.files ?? []);
      setWorkingTime(task.workingTime ?? "");
    } else {
      setTaskNumber("");
      setTitle("");
      setDescription("");
      setCreatedAt("");
      setDueDate("");
      setPriority("medium");
      setCurrentStatus("queue");
      setSubtasks([]);
      setFiles([]);
      setWorkingTime("");
    }
  }, [task]);

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: Date.now(),
      title: "",
      status: "",
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubtask = (index: number) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  const handleSave = () => {
    const newTask: Task = {
      ...task,
      id: task ? task.id : Date.now(),
      taskNumber,
      title,
      description,
      createdAt,
      dueDate,
      priority,
      subtasks,
      files,
      workingTime,
      status: currentStatus,
    };
    onSave(newTask);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const fileNames = selectedFiles.map((file: File) => file.name);
      setFiles(fileNames);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteTask = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className={styles.modalBackground} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {task ? "Редактировать задачу" : "Новая задача"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Номер задачи</label>
              <input
                type="text"
                placeholder="Feat/dev-1"
                value={taskNumber}
                onChange={(e) => setTaskNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>Заголовок</label>
              <input
                type="text"
                placeholder="Введите заголовок задачи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={styles.label}>Описание</label>
            <textarea
              placeholder="Введите описание задачи"
              value={description}
              className={styles.textarea}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.grids}>
            <div>
              <label className={styles.label}>Дата создания</label>
              <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>Время в работе</label>
              <input
                type="text"
                placeholder="0ч 0м"
                value={workingTime}
                onChange={(e) => setWorkingTime(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>Дата окончания</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Приоритет</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">Важные</option>
                <option value="medium">Срочные</option>
                <option value="low">Менее срочные</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Статус</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as TaskStatus)}
              >
                <option>Открыта</option>
                <option>В процессе</option>
                <option>Ревью</option>
                <option>Тестирование</option>
              </select>
            </div>
          </div>
          <div className={styles.subtasksContainer}>
            <label className={styles.subtasksLabel}>Подзадачи</label>
            <div className={styles.subtasksList}>
              {subtasks.map((subtask, index) => (
                <div key={index} className={styles.subtaskRow}>
                  <input
                    type="text"
                    placeholder={`Подзадача ${index + 1}`}
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  />
                  <button onClick={() => handleRemoveSubtask(index)}>
                    <img
                      src="/delete.webp"
                      alt="Логотип Входа"
                      className={styles.logo}
                    />
                  </button>
                </div>
              ))}
            </div>
            <button
              className={styles.addSubtaskButton}
              onClick={handleAddSubtask}
            >
              + Добавить подзадачу
            </button>
          </div>
          <div className={styles.container}>
            <label className={styles.label}>Вложенные файлы</label>
            <div className={styles.uploadArea}>
              <div className={styles.uploadContent}>
                <i className={`${styles.icon} fas fa-cloud-upload-alt`}></i>
                <div>
                  <label className={styles.fileLabel}>
                    <span>Загрузить файл</span>
                    <input
                      className={styles.srOnly}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className={styles.helperText}>PNG, JPG, PDF до 10MB</p>
              </div>
            </div>
          </div>
          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((fileName, index) => (
                <div key={index} className={styles.fileListItem}>
                  {fileName}
                </div>
              ))}
            </div>
          )}
          <CommentsSection taskId={task ? task.id : 0} />
          {task && (
            <div className={styles.modalActions}>
              <button
                className={styles.deleteButton}
                onClick={handleDeleteTask}
              >
                Удалить задачу
              </button>
            </div>
          )}
          <div className={styles.modalButtons}>
            <button onClick={onClose}>Отмена</button>
            <button onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
