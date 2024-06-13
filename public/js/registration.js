import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { collection, doc, getDocs, getFirestore, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCDkt1cjZcdIgC0CW8Ysbdu5YWQuaIOYR8",
  authDomain: "flutterfirebase-d1c32.firebaseapp.com",
  projectId: "flutterfirebase-d1c32",
  storageBucket: "flutterfirebase-d1c32.appspot.com",
  messagingSenderId: "596243185568",
  appId: "1:596243185568:web:017ee2a632219c06b3aec5",
  measurementId: "G-Q5HTZWQFS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Collection reference
const colRefEt = collection(db, 'étudiants');
const colRefEn = collection(db, 'enseignants');

function generateRandomId(length = 10) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

async function addStudent() {
    const form = document.querySelector('#addStudent');
    const formData = new FormData(form);

    const studentData = {
        id: generateRandomId(),
        prenom_etudiant: formData.get('first_name'),
        nom_etudiant: formData.get('last_name'),
        motdepasse_etudiant: formData.get('user_password'),
        email_etudiant: formData.get('email'),
        mat_etudiant: formData.get('matricule'),
    };

    try {
        await setDoc(doc(colRefEt, formData.get('matricule')), studentData, { merge: false });
        console.log("student added to Firestore");
        
        form.reset();
    } catch (error) {
        console.error("Error adding student to Firestore: ", error);
    }
}



async function addTeacher() {
    const form = document.querySelector('#addTeacher');
    const formData = new FormData(form);

    const teacherData = {
        id: generateRandomId(),
        prenom_enseignant : formData.get('first_name'),
        nom_enseignant: formData.get('last_name'),
        motdepasse_enseignant: formData.get('user_password'),
        email_enseignant: formData.get('email'),
        departement: formData.get('department'),
    };

    try {
        await setDoc(doc(colRefEn, teacherData.id), teacherData, { merge: false });
        console.log("teacher added to Firestore");
        
        form.reset();
    } catch (error) {
        console.error("Error adding teacher to Firestore: ", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formStudent = document.querySelector('#addStudent');
    const formTeacher = document.querySelector('#addTeacher');

    if (formStudent) {
        formStudent.addEventListener('submit', (e) => {
            e.preventDefault();
            addStudent();
        });
    }

    if (formTeacher) {
        formTeacher.addEventListener('submit', (e) => {
            e.preventDefault();
            addTeacher();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const teacherTable = document.querySelector('#teacherTable tbody');

    if (teacherTable) {
        async function fetchTeachers() {
            try {
                const querySnapshot = await getDocs(collection(db, 'enseignants'));
                querySnapshot.forEach((doc) => {
                    const teacher = doc.data();
                    console.log("Teacher:", teacher);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${teacher.prenom_enseignant}</td>
                        <td>${teacher.nom_enseignant}</td>
                        <td>${teacher.departement}</td>
                        <td>${teacher.email_enseignant}</td>
                        <td><button class="remove-btn" data-teacher-id="${teacher.id}">Remove</button></td>
                    `;
                    teacherTable.appendChild(row);
                });
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        }

        fetchTeachers();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const studentTable = document.querySelector('#studentTable tbody');

    if (studentTable) {
        async function fetchStudents() {
            try {
                const querySnapshot = await getDocs(collection(db, 'étudiants'));
                querySnapshot.forEach((doc) => {
                    const student = doc.data();
                    console.log("Student:", student);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.prenom_etudiant}</td>
                        <td>${student.nom_etudiant}</td>
                        <td>${student.mat_etudiant}</td>
                        <td>${student.email_etudiant}</td>
                        <td><button class="remove-btn" data-student-id="${student.id}">Remove</button></td>
                    `;
                    studentTable.appendChild(row);
                });
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        fetchStudents();
    }
});

