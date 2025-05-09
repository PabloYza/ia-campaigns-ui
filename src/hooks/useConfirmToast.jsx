import toast from 'react-hot-toast';
import React from 'react';

export default function showConfirmToast({ message, onConfirm, confirmText = "Sí, eliminar", cancelText = "Cancelar" }) {
	toast((t) => (
		<div className="flex flex-col space-y-2 text-sm">
			<span>{message}</span>
			<div className="flex gap-2 justify-end">
				<button
					onClick={async () => {
						await onConfirm();
						toast.dismiss(t.id);
					}}
					className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
				>
					{confirmText}
				</button>
				<button
					onClick={() => toast.dismiss(t.id)}
					className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs hover:bg-gray-300"
				>
					{cancelText}
				</button>
			</div>
		</div>
	));
}
