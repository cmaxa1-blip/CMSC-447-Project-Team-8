 const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleBtn");
  const backdrop = document.getElementById("backdrop");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    if (sidebar.classList.contains("open")) {
      sidebar.style.width = "250px";
      backdrop.classList.add("show");
    } else {
      sidebar.style.width = "0";
      backdrop.classList.remove("show");
    }
  });

  // Close sidebar when clicking backdrop
  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebar.style.width = "0";
    backdrop.classList.remove("show");
  });