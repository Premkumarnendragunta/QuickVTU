const stepsContainer = document.getElementById('steps-container');

const resources = {
  "4": {
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
      "Discrete Mathematics": [
        {
          name: "Module 1: Fundamentals of logic",
          video: "https://www.youtube.com/watch?v=SFyA_ExWhpM",
          notes: "DBMS qp.pdf"
        },
        {
          name: "Module 2: Properties of integers ",
          video: "https://www.youtube.com/watch?v=Jz-hZT0mYk8",
          notes: "notes/3_aids_dbms_module2.pdf"
        },
        {
          name: "Module 3: Relations and functions",
          video: "https://www.youtube.com/watch?v=Z_cY1BYu2q8",
          notes: "notes/3_aids_dbms_module3.pdf"
        },
        {
          name: "Module 4: Inclusion and exclusion Principle",
          video: "https://www.youtube.com/watch?v=9Pzj7Aj25lw",
          notes: "notes/3_aids_dbms_module4.pdf"
        },
        {
          name: "Module 5: Introduction to groups Theory",
          video: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
          notes: "notes/3_aids_dbms_module5.pdf"
        }
      ]
    }
  }
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

let selections = {
  semester: null,
  branch: null,
  subject: null
};

// ⛔ Remove all steps after a certain index (used to keep only the current level)
function removeStepsAfter(index) {
  while (stepsContainer.children.length > index + 1) {
    stepsContainer.removeChild(stepsContainer.lastChild);
  }
}

function createStep(title, options, onSelect, onBack = null) {
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
    };

    grid.appendChild(card);
  });

  if (onBack) {
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.style.marginTop = '15px';
    backBtn.onclick = onBack;
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
    removeStepsAfter(0);
    showBranches();
  });
  stepsContainer.appendChild(step);
}

function showBranches() {
  const step = createStep('Select Branch', branches, (branch) => {
    selections.branch = branch;
    removeStepsAfter(1);
    showSubjects();
  }, () => {
    selections.branch = null;
    removeStepsAfter(0);
  });

  if (stepsContainer.children.length > 1) {
    removeStepsAfter(0);
  }
  stepsContainer.appendChild(step);
}

function showSubjects() {
  let subjectList = [];
  const availableSubjects = resources[selections.semester]?.[selections.branch];
  subjectList = availableSubjects ? Object.keys(availableSubjects) : ['Subject 1', 'Subject 2'];

  const step = createStep('Select Subject', subjectList, (subject) => {
    selections.subject = subject;
    removeStepsAfter(2);
    showModules();
  }, () => {
    selections.subject = null;
    removeStepsAfter(1);
  });

  if (stepsContainer.children.length > 2) {
    removeStepsAfter(1);
  }

  stepsContainer.appendChild(step);
}

function showModules() {
  removeStepsAfter(2);
  const stepDiv = document.createElement('div');
  stepDiv.classList.add('step');

  const h2 = document.createElement('h2');
  h2.textContent = `Modules for ${selections.subject}`;
  stepDiv.appendChild(h2);

  const grid = document.createElement('div');
  grid.className = 'card-grid module-grid';

  const modulesData = resources[selections.semester]?.[selections.branch]?.[selections.subject] || [];

  if (modulesData.length > 0) {
    modulesData.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        ${mod.name}<br>
        <a href="${mod.video}" target="_blank">📹 Video</a> |
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
    selections.subject = null;
    removeStepsAfter(1);
    showSubjects();
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

// Start
resetAll();
