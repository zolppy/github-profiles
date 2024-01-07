const searchButton = document.querySelector("#search-button");
const showReposButton = document.querySelector("#show-repos-button");
const hiddenReposButton = document.querySelector("#hidden-repos-button");

async function getProfile(profileName) {
  const API_URL = "https://api.github.com/users";

  const response = await fetch(`${API_URL}/${profileName}`);
  const data = await response.json();

  return data;
}

async function getRepos(profileName) {
  const API_URL = `https://api.github.com/users/${profileName}/repos`;

  const response = await fetch(API_URL);
  const data = await response.json();

  return data;
}

function showProfileInfo(profile) {
  const profileImageContainer = document.querySelector("#profile-img");
  const profileNameContainer = document.querySelector("#profile-name");
  const profileBioContainer = document.querySelector("#profile-bio");
  const profileFollowersContainer = document.querySelector("#profile-followers-number");
  const profileFollowingContainer = document.querySelector("#profile-following-number");
  const profileReposNumberContainer = document.querySelector("#profile-repos-number");

  let profileImage = profile.avatar_url;
  let profileName = profile.login;
  let profileBio = profile.bio;
  let profileFollowers = profile.followers;
  let profileFollowing = profile.following;
  let profileReposNumber = profile.public_repos;

  profileImageContainer.src = profileImage;
  profileNameContainer.textContent = profileName;
  profileBioContainer.textContent = profileBio;
  profileFollowersContainer.textContent = profileFollowers;
  profileFollowingContainer.textContent = profileFollowing;
  profileReposNumberContainer.textContent = profileReposNumber;
}

function showRepoList(repos) {
  const repoListContainer = document.querySelector("#repo-list");

  const currentRepos = repoListContainer.querySelectorAll(".repo");

  for (const repo of currentRepos) {
    repo.remove();
  }

  for (const repo of repos) {
    const repoElement = `
      <div class="repo">
        <p class="repo-name">Nome: ${repo.name}</p>
        <p class="repo-description">Descrição: ${repo.description}</p>
        <p class="repo-language">Linguagem: ${repo.language}</p>
        <p class="repo-topics">Tópicos: ${[...repo.topics]}</p>
        <p class="repo-link">Link: <a href="${repo.html_url}">Abrir</a></p>
      </div>
    `;

    repoListContainer.innerHTML += repoElement;
  }
}

searchButton.addEventListener("click", async function() {
  // Pegando a entrada do usuário e limpando o campo
  const profileNameInput = document.querySelector("#profile-name-input");
  let profileName = profileNameInput.value;

  profileNameInput.value = "";
  
  // Requisitando usuário à API
  const profile = await getProfile(profileName);

  // Mostrando dados do perfil
  showProfileInfo(profile);

  const repos = await getRepos(profileName);

  // Mostrando lista de repositórios
  showRepoList(repos);

  // Mostrando contêiner de visão geral do perfil
  const profileOverviewContainer = document.querySelector("#profile-overview");
  profileOverviewContainer.classList.remove("hidden");
});

showReposButton.addEventListener("click", function() {
  const repoListContainer = document.querySelector("#repo-list");

  repoListContainer.classList.remove("hidden");
  this.classList.add("hidden");
  hiddenReposButton.classList.remove("hidden");
});

hiddenReposButton.addEventListener("click", function() {
  const repoListContainer = document.querySelector("#repo-list");

  repoListContainer.classList.add("hidden");
  this.classList.add("hidden");
  showReposButton.classList.remove("hidden");
});