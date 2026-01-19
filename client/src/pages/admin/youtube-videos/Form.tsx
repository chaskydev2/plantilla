import { useEffect, useState } from "react";
import { toastify } from "@/core/utils/toastify";
import { YouTubeVideoService } from "@/core/services/youtube/youtubeVideo.service";
import type { IYouTubeVideo } from "@/core/types/IYouTubeVideo";

type Props = {
  onSaved?: () => void;
  onClose?: () => void;
  initialData?: IYouTubeVideo | null;
};

type FormState = {
  title: string;
  youtube_url: string;
  description: string;
  category: string;
  topic: string;
};

const YouTubeVideoForm: React.FC<Props> = ({ onSaved, onClose, initialData }) => {
  const [form, setForm] = useState<FormState>({
    title: "",
    youtube_url: "",
    description: "",
    category: "",
    topic: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? "",
        youtube_url: initialData.youtube_url ?? "",
        description: initialData.description ?? "",
        category: initialData.category ?? "",
        topic: initialData.topic ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.youtube_url.trim()) {
      toastify.error("YouTube URL is required");
      return;
    }

    const payload = {
      title: form.title.trim() || undefined,
      youtube_url: form.youtube_url.trim(),
      description: form.description.trim() || undefined,
      category: form.category.trim() || undefined,
      topic: form.topic.trim() || undefined,
    };

    setIsProcessing(true);
    try {
      const res = initialData
        ? await YouTubeVideoService.update(initialData.id, payload)
        : await YouTubeVideoService.create(payload);
      toastify.success(res?.message || (initialData ? "Video updated" : "Video created"));
      onSaved?.();
      onClose?.();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || "Error saving video");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            placeholder="Optional title"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">YouTube URL *</label>
          <input
            type="url"
            value={form.youtube_url}
            onChange={(e) => handleChange("youtube_url", e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            placeholder="Optional category"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Topic</label>
          <input
            type="text"
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            placeholder="Optional topic"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-gray-900 text-white rounded-xl px-5 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? "Saving..." : initialData ? "Update video" : "Create video"}
        </button>
      </div>
    </form>
  );
};

export default YouTubeVideoForm;
