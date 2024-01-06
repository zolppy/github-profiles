const searchButton = document.querySelector("#search-button");


async function getUser(username) {
  const API_URL = "https://api.github.com/users";

  const response = await fetch(`${API_URL}/${username}`);
  const data = await response.json();

  return data;
}

function showProfileInfo(user) {
  const profileImageContainer = document.querySelector("#profile-img");
  const profileNameContainer = document.querySelector("#profile-name");
  const profileBioContainer = document.querySelector("#profile-bio");
  const profileFollowersContainer = document.querySelector("#profile-followers-number");
  const profileFollowingContainer = document.querySelector("#profile-following-number");
  const profileReposNumberContainer = document.querySelector("#profile-repos-number");

  let profileImage = user.avatar_url;
  let profileName = user.login;
  let profileBio = user.bio;
  let profileFollowers = user.followers;
  let profileFollowing = user.following;
  let profileReposNumber = user.public_repos;

  profileImageContainer.src = profileImage;
  profileNameContainer.textContent = profileName;
  profileBioContainer.textContent = profileBio;
  profileFollowersContainer.textContent = profileFollowers;
  profileFollowingContainer.textContent = profileFollowing;
  profileReposNumberContainer.textContent = profileReposNumber;
}

searchButton.addEventListener("click", async function() {
  // Pegando a entrada do usuário e limpando o campo
  const usernameInput = document.querySelector("#profile-name-input");
  let username = usernameInput.value;

  usernameInput.value = "";

  // Escondendo contêiner de busca
  const searchProfileContainer = this.closest("#search-profile");
  searchProfileContainer.classList.add("hidden");
  
  // Requisitando usuário à API
  const user = await getUser(username);

  // Mostrando dados do perfil
  showProfileInfo(user);

  // Mostrando lista de repositórios
  //showRepoList(user);

  // Mostrando contêiner de visão geral do perfil
  const profileOverviewContainer = document.querySelector("#profile-overview");
  profileOverviewContainer.classList.remove("hidden");
});