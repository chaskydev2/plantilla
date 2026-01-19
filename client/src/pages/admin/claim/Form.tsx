import React, { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "@/hooks";
import { toastify } from "@/core/utils/toastify";
import { ScamAlertService as ItemService } from "@/core/services/homeowner/scamAlert.service";
import type { IScamAlert, ScamAlertStatus } from "@/core/types/IScamAlert";

type Props = {
    onSaved?: () => void;
    onClose?: () => void;
    initialClaim?: IScamAlert | null;
};

type FormState = {
    business_name: string;
    legal_name: string;
    business_owner: string;
    operating_states: string;
    complaint_location: string;
    amount_in_dispute: string;
    complaints_count: string;
    reason_for_listing: string;
    business_response: string;
    reported_at: string;
    status: ScamAlertStatus;
};

const today = new Date().toISOString().slice(0, 10);

const ClaimForm: React.FC<Props> = ({ onSaved, onClose, initialClaim }) => {
    const authUser = useAppSelector((state) => state.auth.user);
    const homeownerProfileId = useMemo(() => {
        const parsed = authUser?.id ? Number(authUser.id) : undefined;
        return Number.isFinite(parsed) ? parsed : undefined;
    }, [authUser?.id]);

    const [form, setForm] = useState<FormState>({
        business_name: "",
        legal_name: "",
        business_owner: "",
        operating_states: "",
        complaint_location: "",
        amount_in_dispute: "",
        complaints_count: "1",
        reason_for_listing: "",
        business_response: "",
        reported_at: today,
        status: "active",
    });

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (initialClaim) {
            setForm({
                business_name: initialClaim.business_name ?? "",
                legal_name: initialClaim.legal_name ?? "",
                business_owner: initialClaim.business_owner ?? "",
                operating_states: Array.isArray(initialClaim.operating_states)
                    ? initialClaim.operating_states.join(", ")
                    : initialClaim.operating_states ?? "",
                complaint_location: initialClaim.complaint_location ?? "",
                amount_in_dispute: initialClaim.amount_in_dispute?.toString() ?? "",
                complaints_count: initialClaim.complaints_count?.toString() ?? "1",
                reason_for_listing: initialClaim.reason_for_listing ?? "",
                business_response: initialClaim.business_response ?? "",
                reported_at: initialClaim.reported_at ?? today,
                status: initialClaim.status ?? "active",
            });
        }
    }, [initialClaim]);

    const handleChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.business_name.trim() || !form.reason_for_listing.trim() || !form.reported_at) {
            toastify.error("Business name, reason, and reported date are required");
            return;
        }

        const operatingStates = form.operating_states
            ? form.operating_states.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined;

        const payload: Partial<IScamAlert> = {
            business_name: form.business_name.trim(),
            legal_name: form.legal_name.trim() || undefined,
            business_owner: form.business_owner.trim() || undefined,
            operating_states: operatingStates && operatingStates.length ? operatingStates : undefined,
            complaint_location: form.complaint_location.trim() || undefined,
            amount_in_dispute: form.amount_in_dispute ? Number(form.amount_in_dispute) : undefined,
            complaints_count: form.complaints_count ? Number(form.complaints_count) : 1,
            reason_for_listing: form.reason_for_listing.trim(),
            business_response: form.business_response.trim() || undefined,
            reported_at: form.reported_at,
            status: form.status,
            homeowner_profile_id: homeownerProfileId,
        };

        setIsProcessing(true);
        try {
            const res = initialClaim
                ? await ItemService.update(initialClaim.id, payload)
                : await ItemService.create(payload);
            toastify.success(res?.message || (initialClaim ? "Claim updated" : "Claim created"));
            if (onSaved) onSaved();
            if (onClose) onClose();
        } catch (error: any) {
            toastify.error(error?.response?.data?.message || "Error saving claim");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Business name *</label>
                    <input
                        type="text"
                        value={form.business_name}
                        onChange={(e) => handleChange("business_name", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="Company LLC"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Legal name</label>
                    <input
                        type="text"
                        value={form.legal_name}
                        onChange={(e) => handleChange("legal_name", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="Registered legal name"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Business owner</label>
                    <input
                        type="text"
                        value={form.business_owner}
                        onChange={(e) => handleChange("business_owner", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="Owner name"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Operating states</label>
                    <input
                        type="text"
                        value={form.operating_states}
                        onChange={(e) => handleChange("operating_states", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="e.g., CA, TX, FL"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Comma-separated list.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Complaint location</label>
                    <input
                        type="text"
                        value={form.complaint_location}
                        onChange={(e) => handleChange("complaint_location", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="City, State"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Amount in dispute</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount_in_dispute}
                        onChange={(e) => handleChange("amount_in_dispute", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        placeholder="1000.00"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Complaints count</label>
                    <input
                        type="number"
                        min="1"
                        value={form.complaints_count}
                        onChange={(e) => handleChange("complaints_count", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Reported at *</label>
                    <input
                        type="date"
                        value={form.reported_at}
                        onChange={(e) => handleChange("reported_at", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    >
                        <option value="active">active</option>
                        <option value="resolved">resolved</option>
                        <option value="closed">closed</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Reason for listing *</label>
                <textarea
                    value={form.reason_for_listing}
                    onChange={(e) => handleChange("reason_for_listing", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    rows={4}
                    placeholder="Describe the issue"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Business response</label>
                <textarea
                    value={form.business_response}
                    onChange={(e) => handleChange("business_response", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Optional response from the business"
                />
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
                    {isProcessing ? "Saving..." : initialClaim ? "Update claim" : "Save claim"}
                </button>
            </div>
        </form>
    );
};

export default ClaimForm;
