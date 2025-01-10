import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GitHubContext } from "../context/githubContext";

const Followers = () => {
  const { followers, setInputValue, setUserData, setRepos } =
    useContext(GitHubContext);
  const { username } = useParams();
  const navigate = useNavigate();

  const handleFollowerClick = (followerUsername) => {
    setInputValue(followerUsername);
    setUserData(null);
    setRepos([]);
    navigate(`/followers/${followerUsername}/repositories`);
  };

  if (!followers.length) {
    return <p>No followers found for {username}.</p>;
  }

  return (
    <div>
      <h1>Followers of {username}</h1>
      <ul>
        {followers.map((follower) => (
          <li
            key={follower.id}
            onClick={() => handleFollowerClick(follower.login)}
          >
            <img
              src={follower.avatar_url}
              alt={follower.login}
              width="50"
              style={{
                borderRadius: "50%",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            {follower.login}

            <span style={{ cursor: "pointer" }}>{follower.login}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default Followers;
