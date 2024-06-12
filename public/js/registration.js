import { collection, db, doc, getDocs, setDoc } from './../../js/firebase.js';

const teacherTable = document.getElementById('teacherTable');
const studentTable = document.getElementById('studentTable');

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
                <td></td>
                <td>${student.mat_etudiant}</td>
                <td><button class="remove-btn" data-student-id="${student.id}">Remove</button></td>
            `;
            studentTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

fetchStudents();