import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

type AuthContextType = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
};

export const AuthContext = createContext({} as AuthContextType);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser({
          uid: userAuth.uid,
          name: userAuth.displayName,
          email: userAuth.email,
        });
      } else {
        setUser(null);
      }

      setLoadingAuth(false);
    });

    return () => unsub();
  }, []);

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({ name, email, uid });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, handleInfoUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
