import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const COLORS = ["#FFC107", "#03A9F4", "#4CAF50", "#FF5722", "#9C27B0", "#00BCD4", "#8BC34A"];

export default function UserBadge() {
	const user = useSelector((state) => state.user);

	const { name = "Usuario", email = "" } = user;

	const avatarColor = useMemo(() => {
		const index = name.charCodeAt(0) % COLORS.length;
		return COLORS[index];
	}, [name]);

	const firstName = name.split(" ")[0];
	const initial = firstName.charAt(0).toUpperCase();
	const lastName = name.split(" ")[1] || "";

	return (
		<div className="flex items-center space-x-3 px-3 py-2">
			<div
				className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
				style={{ backgroundColor: avatarColor }}
			>
				{initial}
			</div>
			<div className="flex flex-col">
				<span className="text-sm font-medium text-gray-800">{firstName} {lastName} </span>
				<span className="text-xs text-gray-500">{email}</span>
			</div>
		</div>
	);
}
