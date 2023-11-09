import { createContext } from "react";
import { ICurrentUser } from "../types/types";

const currentUserContext = createContext<ICurrentUser | null>(null);
export default currentUserContext;
