
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const googleClientId = "522857786366-bmgfn0d84fb0n4p9d5qdk0td1unrhtoc.apps.googleusercontent.com"