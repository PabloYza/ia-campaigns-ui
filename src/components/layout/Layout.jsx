import logo from "../../assets/logo.svg";
import UserBadge from "./userBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
	return (
		<div className="fixed inset-0 bg-white p-2 sm:p-4 overflow-hidden">
			<div className="h-full w-full bg-gray-50 rounded-xl flex flex-col">
				<div className="flex justify-between items-center p-2 sm:p-3 border-b">
					<div className="flex items-center gap-4">
						<img src={logo} alt="Logo" className="h-6 sm:h-8" />
						<Link to="/clients">
							<Button variant="outline" size="sm">Clientes</Button>
						</Link>
					</div>
					<UserBadge />
				</div>
				<div className="flex-1 overflow-auto px-2 sm:px-3 pb-8">
					<div className="w-4/5 mx-auto mt-4">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}