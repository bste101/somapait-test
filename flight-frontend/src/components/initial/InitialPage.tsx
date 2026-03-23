import { useState } from 'react';
import type { UploadResponse } from '../../model/passenger';
import { uploadFile } from '../../services/api';

interface InitialPageProps {
    onSuccess: (data: UploadResponse) => void;
}

const FLIGHT_NO_REGEX = /^[A-Z]{2}\d{3,4}$/
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export default function InitialPage({ onSuccess }: InitialPageProps) {
    const [flightNo, setFlightNo] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (!selectedFile) {
            setFile(null);
            setFileName('');
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            alert("File size exceeds 1MB limit");
            e.target.value = '';
            return;
        }

        if (!selectedFile.name.endsWith('.xlsx')) {
            alert('File must be .xlsx only');
            e.target.value = '';
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const validate = (): boolean => {
        const newErrors: string[] = [];
        if (!flightNo) newErrors.push('flightNo');
        if (!file) newErrors.push('file');
        if (flightNo && !FLIGHT_NO_REGEX.test(flightNo)) {
            newErrors.push('flightNoFormat');
        }
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const result = await uploadFile(flightNo, file!);
            onSuccess(result);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'errors' in err) {
                setApiErrors((err as { errors: string[] }).errors);
            } else if (err && typeof err === 'object' && 'message' in err) {
                setApiErrors([(err as { message: string }).message]);
            } else {
                setApiErrors(['An error occurred while uploading']);
            }
        } finally {
            setLoading(false);
        }

    }

    const handleCancel = () => {
        setFlightNo('');
        setFile(null);
        setFileName('');
        setErrors([]);
        setApiErrors([]);
    };

    const hasError = (field: string) => errors.includes(field);

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-10">
            <div className={`bg-white rounded-lg p-6 w-full max-w-3xl
            border border-teal-300`}>

                <h2 className="text-xl font-bold text-purple-800 mb-6">Initial Page</h2>

                <div className={`p-2 flex items-start gap-4 mb-2 ${apiErrors.length > 0 ? 'border-3 border-red-500' : ''}`}>

                    <div className="flex items-center gap-2 ">
                        <label className="text-sm font-medium whitespace-nowrap">
                            Flight no <span className="text-red-500">*</span>
                        </label>
                        <div>
                            <input
                                className={`border rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-teal-500
                                ${hasError('flightNo') || hasError('flightNoFormat') ? 'border-red-500' : 'border-gray-300'}`}
                                value={flightNo}
                                onChange={e => setFlightNo(e.target.value)}
                            />
                            {hasError('flightNo') && (
                                <p className="text-red-500 text-sm mt-1">This field is required</p>
                            )}
                            {hasError('flightNoFormat') && (
                                <p className="text-red-500 text-sm mt-1">Invalid flight no format</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                        <label className="text-sm font-medium whitespace-nowrap">
                            Excel file <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-1">
                            <div className="flex">
                                <input
                                    className={`flex-1 border rounded-l px-3 py-2 focus:outline-none
                                    ${hasError('file') ? 'border-red-500' : 'border-gray-300'}`}
                                    value={fileName}
                                    
                                    readOnly
                                    placeholder=""
                                />
                                <input
                                    type="file"
                                    accept=".xlsx"
                                    className="hidden"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-r font-medium"
                                >
                                    Browse
                                </button>
                            </div>
                            {hasError('file') && (
                                <p className="text-red-500 text-sm mt-1">This field is required</p>
                            )}
                        </div>
                    </div>
                </div>

                {apiErrors.map((err, i) => (
                    <p key={i} className="text-red-500 text-sm mb-1">{err}</p>
                ))}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded border border-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}