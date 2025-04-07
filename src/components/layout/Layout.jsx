import logo from "../../assets/logo.svg";
import UserBadge from "./UserBadge";

export default function Layout({ children }) {
	return (
		<div className="fixed inset-0 bg-white p-2 sm:p-4 overflow-hidden">
			<div className="h-full w-full bg-gray-50 rounded-xl flex flex-col">
				{/* Top bar */}
				<div className="flex justify-between items-center p-4 sm:p-6">
					<img src={logo} alt="Logo" className="h-8 sm:h-10" />
					<UserBadge />
				</div>

				{/* Page content */}
				<div className="flex-1 overflow-auto px-2 sm:px-3 pb-8">
					<div className="w-4/5 mx-auto">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
