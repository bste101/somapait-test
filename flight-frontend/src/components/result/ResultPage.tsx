import { useState } from "react";
import type { Passenger, UploadResponse } from "../../model/passenger";
import EditForm from "./EditForm";
import ResultTable from "./ResultTable";

interface UploadPageProps {
    result: UploadResponse;
    onCancel: () => void;
}

export default function ResultPage({ result, onCancel }: UploadPageProps) {
    const [passengers, setPassengers] = useState<Passenger[]>(result.passengers);
    const [selected, setSelected] = useState<{ index: number; data: Passenger } | null>(null);

    const handleEdit = (index: number, passenger: Passenger) => {
        setSelected({ index, data: passenger });
    };
    const handleSave = (index: number, passenger: Passenger) => {
        const updated = [...passengers];
        updated[index] = passenger;
        setPassengers(updated);
    };
    const handleDownload = () => {
        if (!result.fileObject) return;

        const url = URL.createObjectURL(result.fileObject);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-10">
            <div className="bg-white border border-teal-300 rounded-lg p-6 w-full max-w-4xl">

                <h2 className="text-xl font-bold text-purple-800 mb-6">Result</h2>
                <EditForm
                    key={selected ? selected.index : 'empty'}
                    selected={selected}
                    onSave={handleSave}
                    onClear={() => setSelected(null)}
                />
                <ResultTable
                    passengers={passengers}
                    fileName={result.fileName}
                    onEdit={handleEdit}
                    onCancel={onCancel}
                    onDownload={handleDownload}
                />
            </div>
        </div>
    );
}