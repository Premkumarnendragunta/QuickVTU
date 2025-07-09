const stepsContainer = document.getElementById('steps-container');
const resources = {
  "3": {
    "AIDS": {
      "DBMS": [
        {
          name: "Module 1: Introduction to DBMS",
          video: "https://www.youtube.com/watch?v=SFyA_ExWhpM",
          notes: "DBMS qp.pdf"
        },
        {
          name: "Module 2: ER Model",
          video: "https://www.youtube.com/watch?v=Jz-hZT0mYk8",
          notes: "notes/3_aids_dbms_module2.pdf"
        },
        {
          name: "Module 3: Relational Model",
          video: "https://www.youtube.com/watch?v=Z_cY1BYu2q8",
          notes: "notes/3_aids_dbms_module3.pdf"
        },
        {
          name: "Module 4: SQL Queries",
          video: "https://www.youtube.com/watch?v=9Pzj7Aj25lw",
          notes: "notes/3_aids_dbms_module4.pdf"
        },
        {
          name: "Module 5: Normalization",
          video: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
          notes: "notes/3_aids_dbms_module5.pdf"
        }
      ],
    },
  },
  // You can add other semesters, branches, subjects here...
};

const semesters = [
  { id: 'Chemistry Cycle', name: 'Chemistry Cycle' },
  { id: 'Physics Cycle', name: 'Physics Cycle' },
  { id: '3', name: '3rd Semester' },
  { id: '4', name: '4th Semester' },
  { id: '5', name: '5th Semester' },
  { id: '6', name: '6th Semester' },
  { id: '7', name: '7th Semester' },
  { id: '8', name: '8th Semester' },
];

const branches = ['CSE', 'AIML', 'AIDS', 'CSDS', 'CIV', 'MECH'];

const subjects = {
  'Chemistry Cycle': ['Chemistry Basics', 'Lab Work', 'Scientific Method', 'Organic Chemistry'],
  'Physics Cycle': ['Physics Basics', 'Lab Work', 'Mechanics', 'Electromagnetism'],
  '3': ['Data Structures', 'Mathematics III', 'Digital Logic', 'Communication Systems', 'DBMS'],  // Added DBMS for 3rd sem
  '4': ['DBMS', 'Operating Systems', 'Theory of Computation', 'Computer Networks'],
  '5': ['Artificial Intelligence', 'Software Engineering', 'Web Technologies', 'Compiler Design'],
  '6': ['Machine Learning', 'Cloud Computing', 'Cyber Security', 'Big Data Analytics'],
  '7': ['Elective 1', 'Elective 2', 'Project Work', 'Seminar'],
  '8': ['Elective 3', 'Elective 4', 'Project Finalization', 'Internship'],
};

let selections = {
  semester: null,
  branch: null,
  subject: null,
};

function createStep(title, options, onSelect, allowBack = true) {
  const stepDiv = document.createElement('div');
  stepDiv.classList.add('step');

  const h2 = document.createElement('h2');
  h2.textContent = title;
  stepDiv.appendChild(h2);

  const selectedInfo = document.createElement('p');
  selectedInfo.className = 'selected-info';
  stepDiv.appendChild(selectedInfo);

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  stepDiv.appendChild(grid);

  options.forEach((opt) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = typeof opt === 'string' ? opt : opt.name;
    card.style.userSelect = 'none';
    card.onclick = () => {
      onSelect(typeof opt === 'string' ? opt : opt.id || opt.name);
      selectedInfo.textContent = `Selected: ${card.textContent}`;
      Array.from(grid.children).forEach((c) => c.classList.add('disabled'));
      card.classList.remove('disabled');
    };
    grid.appendChild(card);
  });

  if (allowBack) {
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.style.marginTop = '15px';
    backBtn.onclick = () => {
      while (stepsContainer.lastChild !== stepDiv) {
        stepsContainer.removeChild(stepsContainer.lastChild);
      }
      stepsContainer.removeChild(stepDiv);

      if (title === 'Select Branch') {
        selections.branch = null;
        selections.subject = null;
      } else if (title === 'Select Subject') {
        selections.subject = null;
      } else if (title === 'Select Semester') {
        selections.semester = null;
        selections.branch = null;
        selections.subject = null;
      }
    };
    stepDiv.appendChild(backBtn);
  }

  return stepDiv;
}

function clearSteps() {
  while (stepsContainer.firstChild) {
    stepsContainer.removeChild(stepsContainer.firstChild);
  }
  selections = { semester: null, branch: null, subject: null };
}

function showSemesters() {
  clearSteps();
  const step = createStep('Select Semester', semesters, (sem) => {
    selections.semester = sem;
    showBranches();
  }, false);
  stepsContainer.appendChild(step);
}

function showBranches() {
  const step = createStep('Select Branch', branches, (branch) => {
    selections.branch = branch;
    showSubjects();
  });
  stepsContainer.appendChild(step);
}

function showSubjects() {
  const subjectList = subjects[selections.semester] || ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
  const step = createStep('Select Subject', subjectList, (subject) => {
    selections.subject = subject;
    showModules();
  });
  stepsContainer.appendChild(step);
}

function showModules() {
  const stepDiv = document.createElement('div');
  stepDiv.classList.add('step');

  const h2 = document.createElement('h2');
  h2.textContent = `Modules for ${selections.subject}`;
  stepDiv.appendChild(h2);

  const grid = document.createElement('div');
  grid.className = 'card-grid module-grid';

  // Get modules data from resources object
  let modulesData = [];
  try {
    modulesData = resources[selections.semester][selections.branch][selections.subject];
  } catch (e) {
    modulesData = [];
  }

  if (modulesData && modulesData.length > 0) {
    modulesData.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        ${mod.name} <br>
        <a href="${mod.video}" target="_blank" rel="noopener noreferrer">📹 Video</a> |
        <a href="${mod.notes}" download>📄 Notes</a>
      `;
      grid.appendChild(card);
    });
  } else {
    grid.innerHTML = `<p>No modules found for this subject yet.</p>`;
  }

  stepDiv.appendChild(grid);

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.style.marginTop = '15px';
  backBtn.onclick = () => {
    stepsContainer.removeChild(stepDiv);
    selections.subject = null;
  };
  stepDiv.appendChild(backBtn);

  stepsContainer.appendChild(stepDiv);
}

function resetAll() {
  clearSteps();
  showSemesters();
  scrollToTop();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize the app
resetAll();
