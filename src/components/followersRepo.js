import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FollowerRepositories = () => {
  const { followerUsername } = useParams(); // Get the follower's username from URL
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowerRepos = async () => {
      try {
        setError(null); // Reset the error message
        const reposResponse = await axios.get(
          `https://api.github.com/users/${followerUsername}/repos`
        );
        setRepos(reposResponse.data); // Set the repositories for the follower
      } catch (err) {
        setError("Error fetching repositories.");
      }
    };

    fetchFollowerRepos();
  }, [followerUsername]);

  return (
    <div>
      <h1>Repositories of {followerUsername}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {repos.length > 0 ? (
          repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </li>
          ))
        ) : (
          <p>No repositories found for this user.</p>
        )}
      </ul>
    </div>
  );
};

export default FollowerRepositories;
