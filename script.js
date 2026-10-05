document.addEventListener("DOMContentLoaded", () => {
  const weekCards = document.querySelectorAll(".week-card");
  const habitInputs = document.querySelectorAll(".habit-input");

  // 1. Weekly Chart Configuration
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
          borderColor: "#53ab62",
          borderWidth: 1,
          borderRadius: 4,
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

  // 2. Monthly Chart Configuration
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

  // 3. Update Function
  function updateAnalytics() {
    // Calculate Weekly Completion %
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

    // Calculate Habit Totals Across All 4 Weeks
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
  }

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateAnalytics);
  });

  habitInputs.forEach((input) => {
    input.addEventListener("input", updateAnalytics);
  });

 
  updateAnalytics();
});
