import { useState } from "react";
import type { Gender, Passenger } from "../../model/passenger";

interface EditFormProps {
    selected: { index: number; data: Passenger } | null;
    onSave: (index: number, passenger: Passenger) => void;
    onClear: () => void;
}

export default function EditForm({ selected, onSave, onClear }: EditFormProps) {
    const [formData, setFormData] = useState<Passenger>(
        selected?.data ?? { firstName: '', lastName: '', gender: '' as Gender, dateOfBirth: null, nationality: '' }
    );
    const [errors, setErrors] = useState<string[]>([]);

    const hasError = (field: string) => errors.includes(field);

    const dateForInput = formData.dateOfBirth
        ? (() => {
            const d = new Date(formData.dateOfBirth);
            const day = String(d.getUTCDate()).padStart(2, '0');
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const year = d.getUTCFullYear();
            return `${year}-${month}-${day}`;
        })()
        : "";

    const validate = (): boolean => {
        const newErrors: string[] = [];

        if (!/^[A-Za-z]{1,20}$/.test(formData.firstName))
            newErrors.push("firstName");

        if (!/^[A-Za-z]{1,20}$/.test(formData.lastName))
            newErrors.push("lastName");

        if (!["Male", "Female", "Unknown"].includes(formData.gender?.toString() ?? ""))
            newErrors.push("gender");

        if (!formData.dateOfBirth || Number.isNaN(formData.dateOfBirth.getTime()))
            newErrors.push("dateOfBirth");
        else if (formData.dateOfBirth > new Date())
            newErrors.push("dateOfBirth");

        if (!/^[A-Z]{3}$/.test(formData.nationality))
            newErrors.push("nationality");

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        if (!selected) return;
        setErrors([]);
        onSave(selected.index, formData);
    };

    const handleClear = () => {
        setErrors([]);
        onClear();
    };

    const updateField = <K extends keyof Passenger>(key: K, value: Passenger[K]) => {
        setFormData((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                {/* First name */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-teal-700 whitespace-nowrap w-28 text-right">
                        First name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <input
                            id="firstName"
                            type="text"
                            maxLength={20}
                            value={formData.firstName}
                            onChange={(event) => updateField("firstName", event.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500
                        ${hasError('firstName') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className="text-red-500 text-sm min-h-5">
                            {hasError('firstName') ? 'Invalid First name' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-teal-700 whitespace-nowrap w-28 text-right">
                        Last name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <input
                            id="lastName"
                            type="text"
                            maxLength={20}
                            value={formData.lastName}
                            onChange={(event) => updateField("lastName", event.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500
                        ${hasError('lastName') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className="text-red-500 text-sm min-h-5">
                            {hasError('lastName') ? 'Invalid Last name' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-teal-700 whitespace-nowrap w-28 text-right">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <select
                            id="gender"
                            value={formData.gender ?? ""}
                            onChange={(event) => updateField("gender", event.target.value as Passenger["gender"])}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500
                        ${hasError('gender') ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                        <p className="text-red-500 text-sm min-h-5">
                            {hasError('gender') ? 'Invalid Gender' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-teal-700 whitespace-nowrap w-28 text-right">
                        Date of birth <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <input
                            id="dateOfBirth"
                            type="date"
                            value={dateForInput}
                            onChange={(event) => updateField("dateOfBirth", event.target.value ? new Date(event.target.value) : null)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500
                        ${hasError('dateOfBirth') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className="text-red-500 text-sm min-h-5">
                            {hasError('dateOfBirth') ? 'Invalid Date of birth' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-teal-700 whitespace-nowrap w-28 text-right">
                        Nationality <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <input
                            id="nationality"
                            type="text"
                            maxLength={3}
                            value={formData.nationality}
                            onChange={(event) => updateField("nationality", event.target.value.toUpperCase())}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500
                        ${hasError('nationality') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className="text-red-500 text-sm min-h-5">
                            {hasError('nationality') ? 'Invalid Nationality' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selected}
                        className="bg-teal-400 hover:bg-teal-500 text-white px-6 py-2 rounded disabled:opacity-40"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded border border-gray-300 disabled:opacity-40"
                    >
                        Clear
                    </button>
                </div>

            </div>
        </div>
    );
}