import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import styles from "./DroppableColumn.module.scss";

interface DroppableColumnProps {
  id: string;
  items: number[];
  children: ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: { column: id },
  });

  return (
    <div ref={setNodeRef} className={styles.droppableColumn}>
      {children}
    </div>
  );
};

export default DroppableColumn;
