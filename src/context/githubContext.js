import React, { createContext, useState } from "react";

// Create the context
export const GitHubContext = createContext();

// Create the provider
export const GitHubProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]); 
  const [inputValue, setInputValue] = useState("");
  const [followers, setFollowers] = useState([]);

  return (
    <GitHubContext.Provider
      value={{
        userData,
        setUserData,
        repos,
        setRepos,
        inputValue,
        setInputValue,
        followers,
        setFollowers,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};
