import React, { useState, useEffect } from "react";
import styles from "./CommentData.module.scss";

interface Reply {
  id: number;
  name: string;
  text: string;
}

interface CommentProps {
  id: number;
  name: string;
  text: string;
  replies: Reply[];
}

interface CommentsMap {
  [taskId: number]: CommentProps[];
}

const CommentsSection: React.FC<{ taskId: number }> = ({ taskId }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      try {
        const commentsMap: CommentsMap = JSON.parse(storedComments);
        setComments(commentsMap[taskId] || []);
      } catch (error) {
        console.error("Ошибка при парсинге комментариев:", error);
      }
    }
  }, [taskId]);

  const saveCommentsToLocalStorage = (commentsMap: CommentsMap) => {
    localStorage.setItem("comments", JSON.stringify(commentsMap));
  };

  const addComment = () => {
    if (commentText.trim() && name.trim()) {
      const newComment: CommentProps = {
        id: Date.now(),
        name,
        text: commentText,
        replies: [],
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      updateLocalStorage(updatedComments);
      setCommentText("");
      setName("");
      setShowModal(false);
    }
  };

  const updateLocalStorage = (updatedComments: CommentProps[]) => {
    const storedComments = localStorage.getItem("comments");
    const commentsMap: CommentsMap = storedComments
      ? JSON.parse(storedComments)
      : {};
    commentsMap[taskId] = updatedComments;
    saveCommentsToLocalStorage(commentsMap);
  };

  const addReply = (commentId: number) => {
    if (replyText.trim() && name.trim()) {
      const newComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              { id: Date.now(), name, text: replyText },
            ],
          };
        }
        return comment;
      });
      setComments(newComments);
      updateLocalStorage(newComments);
      setReplyText("");
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => setShowModal(true)}>Добавить комментарий</button>
      {showModal && (
        <div className={styles.modal}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Комментарий"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={addComment}>Отправить</button>
          <button onClick={() => setShowModal(false)}>Закрыть</button>
        </div>
      )}
      <div>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <strong>{comment.name}:</strong> {comment.text}
              <div>
                {comment.replies.map((reply) => (
                  <div key={reply.id}>
                    <strong>{reply.name}:</strong> {reply.text}
                  </div>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Ответ"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button onClick={() => addReply(comment.id)}>Ответить</button>
              </div>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
