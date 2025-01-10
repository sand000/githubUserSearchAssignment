import React, { useContext, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GitHubContext } from "../context/githubContext";

const GitHubUserSearch = () => {
  const {
    userData,
    setUserData,
    repos,
    setRepos,
    followers,
    setFollowers,
    inputValue,
    setInputValue,
  } = useContext(GitHubContext);

  const { user_name } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchGitHubData = async () => {
      const userToSearch = user_name || inputValue;

      if (!userToSearch.trim()) return;

      try {
        setUserData(null);
        setRepos([]);
        setFollowers([]);

        const userResponse = await axios.get(
          `https://githubusersearchassignment.onrender.com/api/v1/github-user/search-user?user_name=${userToSearch}`
        );

        const reposResponse = await axios.get(
          `https://api.github.com/users/${userToSearch}/repos`
        );

        const followersResponse = await axios.get(
          `https://api.github.com/users/${userToSearch}/followers`
        );

        setUserData(userResponse.data.user); 
        setRepos(reposResponse.data); 
        setFollowers(followersResponse.data); 
      } catch (err) {
        if (isMounted) {
          setUserData(null);
          setRepos([]);
          setFollowers([]);
        }
      }
    };

    if (user_name || inputValue) {
      fetchGitHubData();
    }

  }, [user_name, inputValue, setFollowers, setRepos, setUserData]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      setInputValue(inputValue);
      navigate(`/repository/${inputValue}`);
    }
  };

  return (
    <div>
      <h1>GitHub User Search</h1>

      {!user_name && (
        <div>
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}


      {/* Display user information */}
      {userData && (
        <div>
          <h2>{userData.user_name}</h2>
          <img src={userData.avatar_url} alt={userData.user_name} width="100" />
          <p>{userData.bio}</p>
          <p>
            <strong>Location:</strong> {userData.location || "Not provided"}
          </p>
          <p>
            <strong>Public Repos:</strong> {userData.public_repos}
          </p>
          <p>
            <strong>Followers:</strong> {userData.followers}
          </p>
          <p>
            <strong>Following:</strong> {userData.following}
          </p>

          {/* Button/Link to followers page */}
          <Link to={`/followers/${userData.user_name}`}>
            <button>View Followers</button>
          </Link>
        </div>
      )}

      {/* Display repository list */}
      <h3>Repositories:</h3>
      {repos.length > 0 ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={`/repository/${repo.owner.login}/${repo.name}`}>
                {repo.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        userData && <p>No repositories found.</p>
      )}

      {/* Back button for navigating to the previous user's repositories */}
      {user_name && (
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
          Go Back
        </button>
      )}
    </div>
  );
};

export default GitHubUserSearch;
