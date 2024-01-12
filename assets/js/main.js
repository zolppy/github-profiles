/* Elementos com eventos associados */

const searchButton = document.querySelector("#search-button");
const showReposButton = document.querySelector("#show-repos-button");
const hiddenReposButton = document.querySelector("#hidden-repos-button");
const inputField = document.querySelector("#profile-name-input");

/* Funções */

async function getProfile(profileName) {
  const API_URL = "https://api.github.com/users";

  const response = await fetch(`${API_URL}/${profileName}`);

  if (response.ok) {
    const data = await response.json();
    
    return data;
  }
    
  return null;
}

async function getRepos(profileName) {
  const API_URL = `https://api.github.com/users/${profileName}/repos`;

  const response = await fetch(API_URL);
  const data = await response.json();

  return data;
}

function formatDate(date) {
  /* Formata data no estilo "aaaa-mm-dd" para "dd/mm/aaaa" */
  var part = date.split("-");
  
  var formatedDate = part[2] + "/" + part[1] + "/" + part[0];
  
  return formatedDate;
}

function showProfileInfo(profile) {
  const profileImageContainer = document.querySelector("#profile-img");
  const profileNameContainer = document.querySelector("#profile-name");
  const profileBioContainer = document.querySelector("#profile-bio");
  const profileFollowersContainer = document.querySelector("#profile-followers-number");
  const profileFollowingContainer = document.querySelector("#profile-following-number");
  const profileCreationDateContainer = document.querySelector("#creation-date-date");
  const profileReposNumberContainer = document.querySelector("#profile-repos-number");
  const profileCompanyNameContainer = document.querySelector("#profile-company-name");

  let profileImage = profile.avatar_url;
  let profileName = profile.name;
  let profileBio = profile.bio;
  let profileFollowers = profile.followers;
  let profileFollowing = profile.following;
  let creationDate = formatDate(profile.created_at.slice(0, 10));
  let profileReposNumber = profile.public_repos;
  let profileCompanyName = profile.company;

  profileImageContainer.src = profileImage;
  profileNameContainer.textContent = profileName;
  profileBioContainer.textContent = profileBio;
  profileFollowersContainer.textContent = profileFollowers;
  profileFollowingContainer.textContent = profileFollowing;
  profileCreationDateContainer.textContent = creationDate;
  profileReposNumberContainer.textContent = profileReposNumber;
  profileCompanyNameContainer.textContent = profileCompanyName;
}

function showRepoList(repos) {
  let repoId = 0;
  const repoListContainer = document.querySelector("#repo-list");
  const currentRepos = repoListContainer.querySelectorAll(".repo");

  for (const repo of currentRepos) {
    repo.remove();
  }

  for (const repo of repos) {
    repoId++;
    let repoName = repo.name;
    let repoDescription = repo.description;
    let repoLanguage = repo.language;
    let repoUrl = repo.html_url;
    let repoTopics = repo.topics;

    if (repo.topics.length > 0) {
      repoTopics = String(repoTopics);
  
      if (repoTopics.includes(",")) {
        repoTopics = repoTopics.replaceAll(",", ", ");
      }
    } else {
      repoTopics = "";
    }

    const repoElement = `
      <div class="repo" id="repo-${repoId}">
        <p class="repo-name">Nome: <span class="repo-detail">${repoName}</span></p>
        <p class="repo-description">Descrição: <span class="repo-detail">${repoDescription}</span></p>
        <p class="repo-language">Linguagem: <span class="repo-detail">${repoLanguage}</span></p>
        <p class="repo-topics">Tópicos: <span class="repo-detail">${repoTopics}</span></p>
        <p class="repo-link">Link: <span class="repo-detail"><a href="${repoUrl}">Abrir</a></span></p>
      </div>
    `;

    repoListContainer.innerHTML += repoElement;

    const thisRepo = document.querySelector(`#repo-${repoId}`);

    !repoDescription && thisRepo.querySelector(".repo-description").remove();
    !repoLanguage && thisRepo.querySelector(".repo-language").remove();
    !repoTopics && thisRepo.querySelector(".repo-topics").remove();
  }
}

function showErrorMessage() {
  const errorMessageContainer = document.querySelector("#error-message");

  errorMessageContainer.classList.remove("hidden");

  setTimeout(() => {
    errorMessageContainer.classList.add("hidden");
  }, 1500);
}

/* Função principal */

async function main() {
  const repoListContainer = document.querySelector("#repo-list");
  const profileOverviewContainer = document.querySelector("#profile-overview");
  const loading = document.querySelector(".loading");

  if (!profileOverviewContainer.classList.contains("hidden")) {
    profileOverviewContainer.classList.add("hidden");
  }

  if (showReposButton.classList.contains("hidden")) {
    showReposButton.classList.remove("hidden");
    hiddenReposButton.classList.add("hidden");
    repoListContainer.classList.add("hidden");
  }

  // Pegando a entrada do usuário e limpando o campo
  const profileNameInput = document.querySelector("#profile-name-input");
  let profileName = profileNameInput.value;

  profileNameInput.value = "";
  
  loading.classList.remove("hidden");

  // Requisitando usuário à API
  const profile = await getProfile(profileName);
  
  if (!profile) {
    showErrorMessage();
    profileOverviewContainer.classList.add("hidden");
    loading.classList.add("hidden");
    return;
  }

  // Mostrando dados do perfil
  showProfileInfo(profile);

  const repos = await getRepos(profileName);

  // Mostrando lista de repositórios
  showRepoList(repos);

  loading.classList.add("hidden");

  // Mostrando contêiner de visão geral do perfil
  profileOverviewContainer.classList.remove("hidden");
}

/* Eventos */

searchButton.addEventListener("click", main);
inputField.addEventListener("keyup", async function(event) {
  event.key === "Enter" && main();
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
