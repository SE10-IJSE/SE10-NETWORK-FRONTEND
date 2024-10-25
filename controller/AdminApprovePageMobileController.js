$(document).on("click", "#FormSwitch h2", function () {
  const subtitleText = $(this).text().trim();

  if (subtitleText === "Approve") {
    $(parent.document)
      .find("#homePage .homeWallComponent iframe")
      .attr("src", "/pages/adminApprovePageMobile.html");
  } else {
    $(parent.document)
      .find("#homePage .homeWallComponent iframe")
      .attr("src", "mobileHomePage.html");
  }
});
