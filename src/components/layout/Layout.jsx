import logo from "../../assets/logo.svg";
import UserBadge from "./userBadge";

export default function Layout({ children }) {
	return (
		<div className="fixed inset-0 bg-white p-2 sm:p-4 overflow-hidden">
			<div className="h-full w-full bg-gray-50 rounded-xl flex flex-col">
				{/* Top bar */}
				<div className="flex justify-between items-center p-2 sm:p-3">
					<img src={logo} alt="Logo" className="h-6 sm:h-8" />
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
