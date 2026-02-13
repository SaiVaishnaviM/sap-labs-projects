// Student Management App
const form = document.getElementById('studentForm');
const studentsTableBody = document.querySelector('#studentsTable tbody');
const totalStudentsEl = document.getElementById('totalStudents');
const classAvgEl = document.getElementById('classAvg');
const clearAllBtn = document.getElementById('clearAll');
const clearFormBtn = document.getElementById('clearForm');

let students = [];

// load from localStorage
function load() {
  try {
    const raw = localStorage.getItem('students');
    if (raw) students = JSON.parse(raw);
  } catch(e){ students = [] }
}

function save(){ localStorage.setItem('students', JSON.stringify(students)) }

// grade calculation using if-else
function calculateGrade(percentage){
  if (percentage >= 90) return 'A+';
  else if (percentage >= 80) return 'A';
  else if (percentage >= 70) return 'B';
  else if (percentage >= 60) return 'C';
  else if (percentage >= 50) return 'D';
  else return 'F';
}

// add student
form.addEventListener('submit', function(e){
  e.preventDefault();
  const roll = document.getElementById('roll').value.trim();
  const name = document.getElementById('name').value.trim();
  const subjects = ['math','physics','chemistry','english','computer'];
  const marks = [];
  let valid = true;

  // simple validation
  if (!roll){ document.getElementById('rollError').textContent = 'Roll required'; valid = false } else document.getElementById('rollError').textContent = '';
  if (!name){ document.getElementById('nameError').textContent = 'Name required'; valid = false } else document.getElementById('nameError').textContent = '';

  for (let i=0;i<subjects.length;i++){
    const v = document.getElementById(subjects[i]).value;
    const n = Number(v);
    if (v === '' || isNaN(n) || n < 0 || n > 100){
      alert('Please enter valid marks (0-100) for all subjects.');
      valid = false; break;
    }
    marks.push(n);
  }

  if (!valid) return;

  // calculate total & percentage using loop
  let total = 0;
  for (let i=0;i<marks.length;i++) total += marks[i];
  const percentage = (total / (marks.length * 100)) * 100;
  const grade = calculateGrade(percentage);

  const student = { roll, name, marks, total, percentage: +percentage.toFixed(2), grade };

  // push into array and save
  students.push(student);
  save();
  render();
  form.reset();
});

// render table
function render(){
  studentsTableBody.innerHTML = '';
  for (let i=0;i<students.length;i++){
    const s = students[i];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td>${s.marks[0]}</td>
      <td>${s.marks[1]}</td>
      <td>${s.marks[2]}</td>
      <td>${s.marks[3]}</td>
      <td>${s.marks[4]}</td>
      <td>${s.total}</td>
      <td>${s.percentage}%</td>
      <td>${s.grade}</td>
      <td><button class="action-btn del" data-index="${i}">Delete</button></td>
    `;
    studentsTableBody.appendChild(tr);
  }

  // update stats
  totalStudentsEl.textContent = students.length;
  let avg = 0;
  if (students.length){
    let sum = 0;
    for (let i=0;i<students.length;i++) sum += students[i].percentage;
    avg = +(sum / students.length).toFixed(2);
  }
  classAvgEl.textContent = avg + '%';
}

// delete handler (event delegation)
studentsTableBody.addEventListener('click', function(e){
  if (e.target.matches('.del')){
    const idx = Number(e.target.dataset.index);
    if (!Number.isNaN(idx)){
      students.splice(idx,1);
      save(); render();
    }
  }
});

// clear all
clearAllBtn.addEventListener('click', function(){
  if (!confirm('Clear all student records?')) return;
  students = [];
  save(); render();
});

clearFormBtn.addEventListener('click', function(){ form.reset(); document.getElementById('rollError').textContent=''; document.getElementById('nameError').textContent=''; });

// initial load
load(); render();
