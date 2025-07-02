import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/userSlice";

export default function PrivateRoute({ children }) {
	const user = useSelector(selectUser);
	if (!user || !user.email) {
		return <Navigate to="/" replace />;
	}
	return children;
}
