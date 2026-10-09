   
      document.addEventListener("DOMContentLoaded", () => {
                 const weekCards = document.querySelectorAll(".week-card");
                       const habitInputs = document.querySelectorAll(".habit-input");
                              const userSelect = document.getElementById("userSelect");
                            const addProfileBtn = document.getElementById("addProfileBtn");
          let isInitiallyLoading = false;

 
          const ctxWeekly = document.getElementById("weeklyChart").getContext("2d");
         const weeklyChart = new Chart(ctxWeekly, {

    type: "bar",

    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Completion %",
                  data: [0, 0, 0, 0],
                 backgroundColor: "#1b8730",
                 borderColor:   " #53ab62",
                   borderWidth: 1,
                borderRadius:  4,
        },
 
      ],
    },
    options: {
               responsive: true,
      scales: {
        y: {
                beginAtZero: true,
                max: 100,
          ticks: { color: "#808c9a" },
                 grid: { color: "#30363d" },
        },
        x: {
              ticks: { color: "#8b949e" },
          grid: { display: false },
         },
       },
      plugins: {
         legend: { display: false },
       },
    },
         });

 
  const ctxMonthly = document.getElementById("monthlyChart").getContext("2d");
                const monthlyChart = new Chart(ctxMonthly, {
     type: "bar",
    data: {
         labels: Array.from({ length: 10 }, (_, i) => `Habit ${i + 1}`),
             datasets: [
         {
           label: "Days Completed (out of 28)",
          backgroundColor: "#3380d7",
           borderRadius: 6,
          data: new Array(10).fill(0),
             
        },
           ],
      },
     options: {
             indexAxis: "y",
              responsive: true,
      scales: {
         x: {
                  beginAtZero: true,
          max: 28,
                   ticks: { color: "#5a636d" },
                  grid: { color: "#30363d" },
        },
        y: {
                   ticks: { color: "#8b949e" },
          grid: { display: false },
              },
      },
              plugins: {
              legend: { display: false },
       },

    },
  });

  
            function updateAnalytics() {
        const weeklyData = [];
                         weekCards.forEach((card) => {
             const checkboxes = card.querySelectorAll('input[type="checkbox"]');
                 const checkedCount = card.querySelectorAll('input[type="checkbox"]:checked').length;
             const totalCount = checkboxes.length;
                  const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
                weeklyData.push(percentage);

    });

              weeklyChart.data.datasets[0].data = weeklyData;
               weeklyChart.update();

                   const habitTotals = new Array(10).fill(0);
                        const habitLabels = [];

                  habitInputs.forEach((input, habitIndex) => {
                              const habitName = input.value.trim() !== "" ? input.value : `Habit ${habitIndex + 1}`;
                            habitLabels.push(habitName);

                  weekCards.forEach((card) => {
                        const rows = card.querySelectorAll(".habit-row");
                      if (rows[habitIndex]) {
                      const checkedInRow = rows[habitIndex].querySelectorAll('input[type="checkbox"]:checked').length;
                  habitTotals[habitIndex] += checkedInRow;
                }
          });


    });

               monthlyChart.data.labels = habitLabels;
                             monthlyChart.data.datasets[0].data = habitTotals;
                                         monthlyChart.update();

    if (!isInitiallyLoading) {

             saveProfileData(userSelect.value);
             }
                   }


  function saveProfileData(profileKey) {
              if (!profileKey) return;
             const habitNames = Array.from(habitInputs).map((input) => input.value);
    const checkboxStates = [];
       
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                 checkboxStates.push(cb.checked);

               });

              const profileData = {
                        habits: habitNames,
      checkboxes: checkboxStates,
              };

                   localStorage.setItem(`tracker_data_${profileKey}`, JSON.stringify(profileData));
                  localStorage.setItem("last_active_profile", profileKey);
  }


                    function loadProfileData(profileKey) {
    isInitiallyLoading = true;

    const savedData = localStorage.getItem(`tracker_data_${profileKey}`);
        
                  if (savedData) {
      const data = JSON.parse(savedData);
                  
      if (data.habits) {
                         habitInputs.forEach((input, i) => {
          input.value = data.habits[i] || "";
        });
      }

                            if (data.checkboxes) {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                 checkboxes.forEach((cb, i) => {
                      cb.checked = data.checkboxes[i] || false;
        });
      }
    } else {
                   habitInputs.forEach((input) => (input.value = ""));
             document.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    }

    isInitiallyLoading = false;
    updateAnalytics();
  }

  
  function loadProfilesList() {
               const profiles = JSON.parse(localStorage.getItem("tracker_profiles")) || ["default"];
                  const lastActive = localStorage.getItem("last_active_profile") || "default";

    userSelect.innerHTML = "";

                profiles.forEach((p) => {
            const option = document.createElement("option");
                 option.value = p;
              option.textContent = p === "default" ? "Default User" : p;
                  userSelect.appendChild(option);
    });

    userSelect.value = lastActive;
    loadProfileData(lastActive);
  }

 
  addProfileBtn.addEventListener("click",  ()=> {
               const name = prompt("Enter new profile name:");
    if (!name) return;

             const formattedName = name.trim().toLowerCase().replace( " _ ");
    let profiles = JSON.parse(localStorage.getItem("tracker_profiles")) || ["default"];
            
                          if (!profiles.includes(formattedName)) {
               profiles.push(formattedName);
               localStorage.setItem("tracker_profiles", JSON.stringify(profiles) );

                 const option = document.createElement("option ");
                 option.value = formattedName;
                option.textContent = name.trim();
              userSelect.appendChild(option);
                   userSelect.value = formattedName;
       
                    loadProfileData(formattedName);
    }
  });

  userSelect.addEventListener("change", (e) => {
           loadProfileData(e.target.value);
            });
 
           document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", updateAnalytics);

  });

                          habitInputs.forEach((input) => {
               input.addEventListener("input", updateAnalytics);
            });

  loadProfilesList();

                  });
