import { searchUsers } from "../model/SearchPopupModel.js";

$(document).ready(function () {
  //Add jwt token in the header
  let jwtToken = getJwtToken();
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

  let currentPage = 0;
  let isLoading = false;
  let hasMoreResults = true;
  let currentSearchTerm = "";

  const $searchInput = $("#searchInput");
  const $recentContainer = $(".recent-container");
  const $recentList = $(".recent-list");
  const $backButton = $(".back-button");

  function initEventListeners() {
    $searchInput.on("keypress", function (e) {
      if (e.which === 13) {
        e.preventDefault();
        handleSearch();
      }
    });

    $searchInput.on("input", function () {
      if ($(this).val().trim() === "") {
        resetSearch();
        showRecentSearches();
      }
    });

    $recentList.on("scroll", handleScroll);
    $recentList.on("click", ".recent-item", handleResultClick);
    $recentList.on("click", ".remove-btn", handleRemoveClick);

    $backButton.on("click", function () {
      // Backbutton function
      console.log("Back button clicked");
    });
  }

  function handleSearch() {
    const newSearchTerm = $searchInput.val().trim();
    if (newSearchTerm !== currentSearchTerm) {
      resetSearch();
      currentSearchTerm = newSearchTerm;
      if (currentSearchTerm) {
        $recentContainer.find("h2").text("Results");
        fetchAndDisplayResults();
      } else {
        $recentContainer.find("h2").text("Recent");
        showRecentSearches();
      }
    }
  }

  function resetSearch() {
    currentPage = 0;
    hasMoreResults = true;
    currentSearchTerm = "";
    clearResults();
    $recentContainer.find("h2").text("Recent");
  }

  function fetchAndDisplayResults() {
    if (isLoading || !hasMoreResults || !currentSearchTerm) return;

    isLoading = true;
    searchUsers(currentSearchTerm, currentPage)
      .then(function (results) {
        if (Array.isArray(results) && results.length > 0) {
          displayResults(results);
          currentPage++;
          hasMoreResults = results.length === 10;
        } else {
          hasMoreResults = false;
          displayNoResults();
        }
      })
      .catch(function (error) {
        console.error("Error fetching search results:", error);
        if (error.response && error.response.status === 404) {
          hasMoreResults = false;
          displayNoResults();
        } else {
          displayError();
        }
      })
      .finally(function () {
        isLoading = false;
      });
  }

  function displayResults(results) {
    $.each(results, function (index, user) {
      const listItem = $("<div>").addClass("recent-item").html(`
          <img src="${
            user.profileImg
              ? `data:image/png;base64,${user.profileImg}`
              : "/assets/image/profilePic.png"
          }" alt="${user.name}">
          <span>${user.name}</span>
          <button class="remove-btn">&times;</button>
        `);
      listItem.data("user", user);
      $recentList.append(listItem);
    });
  }

  function displayNoResults() {
    $recentList.html('<div class="recent-item">No results found</div>');
  }

  function displayError() {
    $recentList.html(
      '<div class="recent-item text-danger">An error occurred. Please try again.</div>'
    );
  }

  function clearResults() {
    $recentList.empty();
  }

  function handleScroll() {
    const scrollTop = $recentList.scrollTop();
    const scrollHeight = $recentList[0].scrollHeight;
    const clientHeight = $recentList.height();

    if (
      scrollTop + clientHeight >= scrollHeight - 5 &&
      !isLoading &&
      hasMoreResults
    ) {
      console.log("Loading more results");
      fetchAndDisplayResults();
    }
  }

  function handleResultClick(event) {
    const $clickedItem = $(event.currentTarget);
    const userData = $clickedItem.data("user");

    if (userData) {
      saveRecentSearch(userData);
      localStorage.setItem("selectedFriendEmail", userData.email);

      const $iframe = $(window.parent.document).find(
        "#homePage .homeWallComponent iframe"
      );

      $iframe.attr(
        "src",
        "../components/pages/wall/myFriendPostWallComponent.html"
      );
    }
  }

  function handleRemoveClick(event) {
    event.stopPropagation();
    const $clickedItem = $(event.target).closest(".recent-item");
    const userData = $clickedItem.data("user");

    if (userData) {
      removeRecentSearch(userData);
      $clickedItem.remove();
    }
  }

  function saveRecentSearch(userData) {
    let recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );

    const idExists = recentSearches.some((user) => user.name === userData.name);

    if (!idExists) {
      if (recentSearches.length === 5) {
        recentSearches.shift();
      }
      recentSearches.push(userData);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }

  function removeRecentSearch(userData) {
    let recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    recentSearches = recentSearches.filter(
      (user) => user.name !== userData.name
    );
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }

  function showRecentSearches() {
    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    clearResults();
    if (recentSearches.length > 0) {
      $recentContainer.find("h2").text("Recent");
      displayResults(recentSearches.reverse());
    } else {
      displayNoResults();
    }
  }

  initEventListeners();
  showRecentSearches();
});

function getJwtToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}
