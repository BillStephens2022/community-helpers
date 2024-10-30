import { useState } from "react";
import { createReply } from "../../_utils/api/messages";
import { MessageBody } from "../../_lib/types";
import Button from "../ui/Button";
import styles from "./messageReplyForm.module.css";

interface MessageReplyFormProps {
  parentMessageId: string;
  userId: string;
  onClose: () => void;
  onReplySuccess: (reply: MessageBody) => void;
}

const MessageReplyForm = ({
  parentMessageId,
  userId,
  onClose,
  onReplySuccess,
}: MessageReplyFormProps) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      success,
      reply,
      error: apiError,
    } = await createReply(parentMessageId, userId, messageText);

    if (success && reply) {
      onReplySuccess(reply); // Optimistically update state
      onClose();
    } else {
      setError(apiError || "Failed to send reply.");
    }

    setLoading(false);
  };

  return (
    <form className={styles.replyForm}>
      <div className={styles.replyContainer}>
        <textarea
          className={styles.replyTextarea}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your reply..."
          required
          rows={5}
        />
      </div>
      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.buttons_div}>
        <Button onClick={handleSubmit} type="button" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MessageReplyForm;
