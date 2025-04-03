
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const googleClientId = "522857786366-bmgfn0d84fb0n4p9d5qdk0td1unrhtoc.apps.googleusercontent.com"

export const getEuropeanTimestamp = () => {
	const now = new Date();

	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const year = now.getFullYear();

	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	const timeStamp = `${day}/${month}/${year} ${hours}:${minutes}`;
	return timeStamp;
};

