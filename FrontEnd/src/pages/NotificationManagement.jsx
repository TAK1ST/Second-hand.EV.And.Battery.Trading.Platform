import { Send } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const NotificationManagement = () => {
  // Use context to get the sendMessage function from the layout
  const { sendMessage } = useOutletContext();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    setFeedback('');
    try {
      await sendMessage(message);
      setFeedback('Notification sent successfully!');
      setMessage('');
    } catch (error) {
      setFeedback('Failed to send notification.');
    } finally {
      setIsSending(false);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manager Notification Panel</h1>
      <p className="text-gray-600 mb-6">Send a broadcast notification to all connected users.</p>
      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          disabled={isSending || !message.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          <Send className="h-5 w-5 mr-2" />
          {isSending ? 'Sending...' : 'Send Broadcast'}
        </button>
        {feedback && <p className={`text-sm mt-2 ${feedback.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{feedback}</p>}
      </div>
    </div>
  );
};
export default NotificationManagement