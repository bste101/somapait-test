import type { Passenger } from "../../model/passenger"

interface ResultTableProps {
    passengers: Passenger[];
    fileName: string;
    onEdit: (index: number, passenger: Passenger) => void;
    onCancel: () => void;
    onDownload: () => void;
}

export default function ResultTable({ passengers, fileName, onEdit, onCancel, onDownload }: ResultTableProps) {

    const formatDate = (date: Date | null | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${day}-${month}-${year}`;
    };
    return (
        <div className="w-full">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="bg-teal-600 text-white px-4 py-3 text-center w-12">No.</th>
                        <th className="bg-teal-600 text-white px-4 py-3 w-10"></th>
                        <th className="bg-teal-600 text-white px-4 py-3 text-left">First name</th>
                        <th className="bg-teal-600 text-white px-4 py-3 text-left">Last name</th>
                        <th className="bg-teal-600 text-white px-4 py-3 text-left">Gender</th>
                        <th className="bg-teal-600 text-white px-4 py-3 text-left">Date of birth</th>
                        <th className="bg-teal-600 text-white px-4 py-3 text-left">Nationality</th>
                    </tr>
                </thead>
                <tbody>
                    {passengers.map((p, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                            <td className="px-4 py-3 text-center text-teal-700">{i + 1}</td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => onEdit(i, p)}
                                    className="text-gray-600 hover:text-teal-700"
                                >
                                    ✏️
                                </button>
                            </td>
                            <td className="px-4 py-3 text-teal-700">{p.firstName}</td>
                            <td className="px-4 py-3 text-teal-700">{p.lastName}</td>
                            <td className="px-4 py-3 text-teal-700">{p.gender}</td>
                            <td className="px-4 py-3 text-teal-700">{formatDate(p.dateOfBirth)}</td>
                            <td className="px-4 py-3 text-teal-700">{p.nationality}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-4 text-sm">
                <span className="text-gray-600 mr-1">File &gt;&gt;</span>
                <span
                    onClick={onDownload}
                    className="text-teal-600 underline cursor-pointer hover:text-teal-800"
                >
                    {fileName}
                </span>
            </div>

            <div className="flex justify-end mt-3">
                <button
                    onClick={onCancel}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}