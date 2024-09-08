import { searchUsers } from "../model/SearchPopupModel.js";

$(document).ready(function () {
  let currentPage = 0;
  let isLoading = false;
  let hasMoreResults = true;
  let currentSearchTerm = "";

  const $searchInput = $("#search-for-friends");
  const $searchPopup = $("#searchPopUp");
  const $searchPopupList = $("#searchPopupList");
  const $recentList = $("#recent-list");
  const $searchTitle = $("#search-title");

  function initEventListeners() {
    $searchInput.on("click", function () {
      showSearchPopup();
    });

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

    $(document).on("click", function (event) {
      if (
        !$(event.target).closest("#search-for-friends, #searchPopUp").length
      ) {
        $searchPopup.hide();
      }
    });

    $recentList.on("scroll", handleScroll);
    $recentList.on("click", ".search-result", handleResultClick);
  }

  function showSearchPopup() {
    showRecentSearches();
    $searchPopup.show();
  }

  function handleSearch() {
    const newSearchTerm = $searchInput.val().trim();
    if (newSearchTerm !== currentSearchTerm) {
      resetSearch();
      currentSearchTerm = newSearchTerm;
      if (currentSearchTerm) {
        $searchPopup.show();
        $searchTitle.text("Results");
        fetchAndDisplayResults();
      } else {
        $searchTitle.text("Recent");
        showRecentSearches();
      }
    }
  }

  function resetSearch() {
    currentPage = 0;
    hasMoreResults = true;
    currentSearchTerm = "";
    clearResults();
    $searchTitle.text("Recent");
    adjustPopupHeight(0);
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
          adjustPopupHeight($recentList.children().length);
        } else {
          hasMoreResults = false;
          displayNoResults();
          adjustPopupHeight(1);
        }
      })
      .catch(function (error) {
        console.error("Error fetching search results:", error);
        if (error.response && error.response.status === 404) {
          hasMoreResults = false;
          displayNoResults();
          adjustPopupHeight(1);
        } else {
          displayError();
          adjustPopupHeight(1);
        }
      })
      .finally(function () {
        isLoading = false;
      });
  }

  function displayResults(results) {
    $.each(results, function (index, user) {
      const listItem = $("<li>").addClass(
        "d-flex justify-content-between align-items-center"
      ).html(`
            <div class="search-result d-flex gap-3 align-items-center">
              <img src="${
                user.profileImg
                  ? `data:image/png;base64,${user.profileImg}`
                  : "/assets/image/profilePic.png"
              }" class="avatar"/>
              <span class="name">${user.name}</span>
            </div>
            <button id="remove-search-result" class="remove-btn bg-transparent border-0">&times;</button>
          `);
      listItem.data("user", user);
      $recentList.append(listItem);
    });
  }

  function displayNoResults() {
    $recentList.html('<li class="text-center">No results found</li>');
  }

  function displayError() {
    $recentList.html(
      '<li class="text-center text-danger">An error occurred. Please try again.</li>'
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

  function adjustPopupHeight(resultCount) {
    const baseHeight = 100;
    const itemHeight = 50;
    const maxHeight = 400;

    let newHeight = baseHeight + resultCount * itemHeight;
    newHeight = Math.min(newHeight, maxHeight);

    $searchPopupList.css("height", `${newHeight}px`);
  }

  function handleResultClick(event) {
    const $clickedItem = $(event.currentTarget).closest("li");
    const userData = $clickedItem.data("user");

    if (userData) {
      saveRecentSearch(userData);
      //Navigation logic to the selected users profile should implement here
      console.log("Clicked on user:", userData);
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

  function showRecentSearches() {
    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    clearResults();
    if (recentSearches.length > 0) {
      $searchTitle.text("Recent");
      displayResults(recentSearches.reverse());
      adjustPopupHeight(recentSearches.length);
    } else {
      displayNoResults();
      adjustPopupHeight(1);
    }
  }

  initEventListeners();
});
