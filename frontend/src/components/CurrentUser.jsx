import { createContext, useContext, useState, useEffect } from "react";

const CurrentUserContext = createContext(null);

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchCurrentUser = async () => {
    setUserLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dash/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setCurrentUser(null);
        return;
      }
      const data = await res.json();
      setCurrentUser(data); // { userId, username, pp }
    } catch (err) {
      console.log(err);
      setCurrentUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, userLoading, refetchCurrentUser: fetchCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used inside <CurrentUserProvider>");
  }
  return ctx;
}
