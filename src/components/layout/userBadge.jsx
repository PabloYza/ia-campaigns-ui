import { LogOut as LogOutIcon } from "lucide-react";
import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/userSlice";
import { COLORS } from "@/lib/utils";


export default function UserBadge() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();


	const { name = "Usuario", email = "" } = user;

	const avatarColor = useMemo(() => {
		const index = name.charCodeAt(0) % COLORS.length;
		return COLORS[index];
	}, [name]);

	const handleLogout = () => {
		dispatch(clearUser());
		window.location.href = "/login";
	};

	const firstName = name.split(" ")[0];
	const initial = firstName.charAt(0).toUpperCase();
	const lastName = name.split(" ")[1] || "";

	return (
		<div className="flex items-center space-x-3 px-3 py-2 relative">
			<div className="relative">
				<div
					className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
					style={{ backgroundColor: avatarColor }}
				>
					{initial}
				</div>

			</div>
			<div className="flex flex-col">

				<span className="text-sm font-medium text-gray-800">{firstName} {lastName}</span>
				<span className="text-xs text-gray-500">{email}</span>
			</div>
			<button
				onClick={handleLogout}
				title="Cerrar sesión"
				className="absolute -top-1 -right-1 bg-white rounded-full p-[2px] shadow hover:bg-gray-100"
			>
				<LogOutIcon size={14} className="text-gray-700" />
			</button>
		</div>
	);
}
