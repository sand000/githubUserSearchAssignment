import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const RepositoryDetails = () => {
  const { username, repoName } = useParams();
  const [repoDetails, setRepoDetails] = useState(null);
  const [error, setError] = useState(null);

    useEffect(() => {
      const fetchRepoDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${username}/${repoName}`
          );
          setRepoDetails(response.data);
          setError(null);
        } catch (err) {
          setError("Repository details could not be fetched.");
        }
      };

      fetchRepoDetails();
    }, [username, repoName]);
 console.log("user name", username);
  return (
    <div>
      <h1>Repository Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {repoDetails ? (
        <div>
          <h2>{repoDetails.name}</h2>
          <p>{repoDetails.description || "No description provided."}</p>
          <p>
            <strong>Owner:</strong> {repoDetails.owner.login}
          </p>
          <p>
            <strong>Stars:</strong> {repoDetails.stargazers_count}
          </p>
          <p>
            <strong>Forks:</strong> {repoDetails.forks_count}
          </p>
          <p>
            <strong>Language:</strong> {repoDetails.language || "Not specified"}
          </p>
          <a
            href={repoDetails.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Link to="/">Go Back</Link>
    </div>
  );
};

export default RepositoryDetails;
