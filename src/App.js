// GitHubUserSearch.js
import Followers from "./components/followers";
import FollowerRepositories from "./components/followersRepo";
import RepositoryDetails from "./components/repoDetails";
import GitHubUserSearch from "./components/searchUser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GitHubUserSearch />} />
        <Route path="/repository/:username" element={<GitHubUserSearch />} />
        <Route
          path="/repository/:username/:repoName"
          element={<RepositoryDetails />}
        />
        <Route path="/followers/:username" element={<Followers />} />
        <Route
          path="/followers/:followerUsername/repositories"
          element={<FollowerRepositories />}
        />
      </Routes>
    </Router>
  );
};

export default App;
