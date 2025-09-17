"use client";

import { useEffect, useState } from "react";
import { Bar, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  Title, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement,
  RadialLinearScale, BarElement
);

export default function Page() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/students.json")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  if (students.length === 0) return <p>Loading...</p>;

  // Overview stats
  const avgScore = (
    students.reduce((a, s) => a + s.assessment_score, 0) / students.length
  ).toFixed(2);

  // Bar chart: average skill vs score
  const skillLabels = ["comprehension","attention","focus","retention","engagement_time"];
  const skillAvgs = skillLabels.map(f =>
    students.reduce((a, s) => a + s[f], 0) / students.length
  );

  const barData = {
    labels: skillLabels,
    datasets: [{
      label: "Average Skill Level",
      data: skillAvgs,
      backgroundColor: "rgba(75,192,192,0.6)"
    }]
  };

  // Scatter plot: attention vs performance
  const scatterData = {
    datasets: [{
      label: "Students",
      data: students.map(s => ({ x: s.attention, y: s.assessment_score })),
      backgroundColor: "rgba(255,99,132,0.6)"
    }]
  };

  // Radar chart: profile of first student
  const first = students[0];
  const radarData = {
    labels: skillLabels,
    datasets: [{
      label: `${first.name} (ID: ${first.student_id})`,
      data: skillLabels.map(f => first[f]),
      backgroundColor: "rgba(153,102,255,0.4)",
      borderColor: "rgba(153,102,255,1)"
    }]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cognitive Skills & Student Performance Dashboard</h1>

      <h2>Overview</h2>
      <p>Total Students: {students.length}</p>
      <p>Average Score: {avgScore}</p>

      <h2>Charts</h2>
      <div style={{ width: "600px", marginBottom: "40px" }}>
        <Bar data={barData} />
      </div>
      <div style={{ width: "600px", marginBottom: "40px" }}>
        <Scatter data={scatterData} />
      </div>
      <div style={{ width: "600px", marginBottom: "40px" }}>
        <Radar data={radarData} />
      </div>

      <h2>Student Table</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Class</th><th>Score</th><th>Attention</th><th>Focus</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.assessment_score}</td>
              <td>{s.attention}</td>
              <td>{s.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Insights</h2>
      <ul>
        <li>Higher attention generally correlates with higher performance.</li>
        <li>Focus and retention are key predictors of assessment score.</li>
        <li>Radar charts help visualize individual student strengths.</li>
      </ul>
    </div>
  );
}
