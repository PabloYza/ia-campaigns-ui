import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Copy, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import useConfirmToast from "@/hooks/useConfirmToast";

export default function CampaignActions({ campaign, onDuplicate, onDelete }) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef(null);

	const handleDelete = () => {
		useConfirmToast({
			message: "¿Eliminar esta campaña?",
			onConfirm: () => onDelete(campaign),
		});
		setOpen(false);
	};

	const handleDuplicate = () => {
		onDuplicate(campaign);
		setOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative inline-block text-left" ref={menuRef}>
			<Button
				variant="ghost"
				className="p-1 h-8 w-8"
				onClick={() => setOpen((prev) => !prev)}
			>
				<MoreVertical className="h-4 w-4" />
			</Button>

			{open && (
				<div className="absolute right-0 z-10 mt-2 w-32 rounded-md shadow-lg bg-white border border-gray-200">
					<ul className="py-1 text-sm text-gray-700">
						<li>
							<button
								onClick={handleDuplicate}
								className="flex w-full items-center px-3 py-2 hover:bg-gray-100"
							>
								<Copy className="w-4 h-4 mr-2" />
								Duplicar
							</button>
						</li>
						<li>
							<button
								onClick={handleDelete}
								className="flex w-full items-center px-3 py-2 text-red-600 hover:bg-gray-100"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								Eliminar
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
