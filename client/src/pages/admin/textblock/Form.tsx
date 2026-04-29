import React, { useState, useEffect } from "react";
import { toastify } from "@/core/utils/toastify";
import { TextBlockService } from "@/core/services/textblock/textblock.service";
import type { ITextBlock } from "@/core/types/ITextBlock";

type Props = {
    onSaved?: () => void;
    onClose?: () => void;
    initialData?: ITextBlock | null;
};

type FormState = {
    text_primary: string;
    text_secondary: string;
    text_tertiary: string;
};

const TextBlockForm: React.FC<Props> = ({ onSaved, onClose, initialData }) => {
    const [form, setForm] = useState<FormState>({
        text_primary: "",
        text_secondary: "",
        text_tertiary: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                text_primary: initialData.text_primary ?? "",
                text_secondary: initialData.text_secondary ?? "",
                text_tertiary: initialData.text_tertiary ?? "",
            });
        }
    }, [initialData]);

    const handleChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.text_primary.trim() || !form.text_secondary.trim() || !form.text_tertiary.trim()) {
            toastify.error("All fields are required");
            return;
        }

        const payload = {
            text_primary: form.text_primary.trim(),
            text_secondary: form.text_secondary.trim(),
            text_tertiary: form.text_tertiary.trim(),
        };

        setIsProcessing(true);
        try {
            const res = initialData
                ? await TextBlockService.update(initialData.id, payload)
                : await TextBlockService.create(payload);
            toastify.success(res?.message || (initialData ? "Text block updated" : "Text block created"));
            if (onSaved) onSaved();
            if (onClose) onClose();
        } catch (error: any) {
            toastify.error(error?.response?.data?.message || "Error saving text block");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Primary Text *
                </label>
                <textarea
                    value={form.text_primary}
                    onChange={(e) => handleChange("text_primary", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Enter primary text"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Secondary Text *
                </label>
                <textarea
                    value={form.text_secondary}
                    onChange={(e) => handleChange("text_secondary", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Enter secondary text"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Tertiary Text *
                </label>
                <textarea
                    value={form.text_tertiary}
                    onChange={(e) => handleChange("text_tertiary", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Enter tertiary text"
                    required
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="btn btn-ghost px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    {isProcessing ? "Saving..." : initialData ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
};

export default TextBlockForm;
