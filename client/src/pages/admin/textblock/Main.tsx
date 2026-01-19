import { useState, useEffect } from "react";
import { Pencil, FileText, RefreshCw } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Modal from "@/components/modal/Modal";
import { toastify } from "@/core/utils/toastify";
import { TextBlockService } from "@/core/services/textblock/textblock.service";
import type { ITextBlock } from "@/core/types/ITextBlock";
import TextBlockForm from "./Form";

export default function TextBlockMain() {
    const [textBlock, setTextBlock] = useState<ITextBlock | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchTextBlock = async () => {
        setLoading(true);
        try {
            const response = await TextBlockService.getFirst();
            setTextBlock(response.data || null);
        } catch (error: any) {
            console.error("Error fetching text block:", error);
            toastify.error(error?.response?.data?.message || "Error loading text block");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTextBlock();
    }, []);

    const handleFormSaved = () => {
        fetchTextBlock();
        setIsFormOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-6">
                <PageBreadcrumb pageTitle="Text Block Settings" />
                <button
                    className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 font-semibold flex items-center gap-2 rounded-xl py-3 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => fetchTextBlock()}
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {!textBlock ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Text Block Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Create the first text block to display on your site.
                        </p>
                        <button
                            className="bg-gray-900 text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-700 transition"
                            onClick={() => setIsFormOpen(true)}
                        >
                            Create Text Block
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Current Text Block
                            </h3>
                            <button
                                className="bg-gray-900 text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-700 transition flex items-center gap-2"
                                onClick={() => setIsFormOpen(true)}
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                    Primary Text
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {textBlock.text_primary}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                    Secondary Text
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {textBlock.text_secondary}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                    Tertiary Text
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {textBlock.text_tertiary}
                                </p>
                            </div>

                            {textBlock.created_at && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    Created: {new Date(textBlock.created_at).toLocaleString()}
                                    {textBlock.updated_at && (
                                        <span className="ml-4">
                                            Last updated: {new Date(textBlock.updated_at).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={textBlock ? "Edit Text Block" : "Create Text Block"}
                size="lg"
            >
                <TextBlockForm
                    initialData={textBlock}
                    onClose={() => setIsFormOpen(false)}
                    onSaved={handleFormSaved}
                />
            </Modal>
        </div>
    );
}
