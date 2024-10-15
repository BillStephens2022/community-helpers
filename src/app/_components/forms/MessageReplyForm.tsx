import { useState } from "react";
import { createReply } from "../../_utils/api/messages";

interface MessageReplyFormProps {
  parentMessageId: string;
  userId: string;
  onClose: () => void;
}

const MessageReplyForm = ({
  parentMessageId,
  userId,
  onClose,
}: MessageReplyFormProps) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { success, error } = await createReply(
      parentMessageId,
      userId,
      messageText
    );

    if (success) {
      alert("Reply sent successfully!");
      onClose(); // Close the modal on success
    } else {
      setError(error || "Failed to send reply.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your reply..."
          required
          rows={4}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reply"}
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MessageReplyForm;
