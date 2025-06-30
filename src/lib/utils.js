
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const googleClientId = "522857786366-hiar5d6s1b4dlbag8npojvvgmuqd5amg.apps.googleusercontent.com"

export const getEuropeanTimestamp = () => {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	// PostgreSQL/Supabase-friendly format: YYYY-MM-DD HH:MM:SS
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const COLORS = ["#FFC107", "#03A9F4", "#4CAF50", "#FF5722", "#9C27B0", "#00BCD4", "#8BC34A"];