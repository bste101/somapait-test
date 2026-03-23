import { useState } from "react";
import type { Passenger } from "../model/passenger";

interface EditFormProps {
    selected?: Passenger;
    onSave: (data: Passenger) => void;
    onClear: () => void;
}

export default function EditForm({ selected, onSave, onClear }: EditFormProps) {
    const [formData, setFormData] = useState<Passenger | null>(() => (
        selected ? { ...selected, dateOfBirth: selected.dateOfBirth ? new Date(selected.dateOfBirth) : null } : null
    ));
    const [error, setError] = useState("");

    if (!formData) return null;

    const dateForInput = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : "";

    const validate = (): string => {
        if (!/^[A-Za-z]{1,20}$/.test(formData.firstName))
            return "Invalid First name";

        if (!/^[A-Za-z]{1,20}$/.test(formData.lastName))
            return "Invalid Last name";

        if (!["Male", "Female", "Unknown"].includes(formData.gender?.toString() ?? ""))
            return "Invalid Gender";

        if (!/^[A-Z]{3}$/.test(formData.nationality))
            return "Invalid Nationality";

        if (formData.dateOfBirth && Number.isNaN(formData.dateOfBirth.getTime()))
            return "Invalid Date of birth";

        return "";
    };

    const handleSave = () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");
        onSave(formData);
    };

    const handleClear = () => {
        setError("");
        onClear();
    };

    const updateField = <K extends keyof Passenger>(key: K, value: Passenger[K]) => {
        setFormData((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    };

    return (
        <div className="edit-form-card">
            <div className="edit-form-grid">
                <div className="edit-form-field">
                    <label htmlFor="firstName">First name <span className="required">*</span></label>
                    <input
                        id="firstName"
                        type="text"
                        maxLength={20}
                        value={formData.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                    />
                </div>

                <div className="edit-form-field">
                    <label htmlFor="lastName">Last name <span className="required">*</span></label>
                    <input
                        id="lastName"
                        type="text"
                        maxLength={20}
                        value={formData.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                    />
                </div>

                <div className="edit-form-field">
                    <label htmlFor="gender">Gender <span className="required">*</span></label>
                    <select
                        id="gender"
                        value={formData.gender ?? ""}
                        onChange={(event) => updateField("gender", event.target.value as Passenger["gender"])}
                    >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unknown">Unknown</option>
                    </select>
                </div>

                <div className="edit-form-field">
                    <label htmlFor="dateOfBirth">Date of birth <span className="required">*</span></label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        value={dateForInput}
                        onChange={(event) => updateField("dateOfBirth", new Date(event.target.value))}
                    />
                </div>

                <div className="edit-form-field">
                    <label htmlFor="nationality">Nationality <span className="required">*</span></label>
                    <input
                        id="nationality"
                        type="text"
                        maxLength={3}
                        value={formData.nationality}
                        onChange={(event) => updateField("nationality", event.target.value.toUpperCase())}
                    />
                </div>

                <div className="edit-form-actions">
                    <button type="button" className="save-button" onClick={handleSave}>Save</button>
                    <button type="button" className="clear-button" onClick={handleClear}>Clear</button>
                </div>

                {error ? <p className="form-error">{error}</p> : null}
            </div>
        </div>
    );
}