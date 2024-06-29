import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { collection, doc, getDocs, getDoc, getFirestore, setDoc , deleteDoc} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

    // Create the studentData object without the group field
    const studentData = {
        id: generateRandomId(),
        prenom_etudiant: formData.get('first_name'),
        nom_etudiant: formData.get('last_name'),
        motdepasse_etudiant: formData.get('user_password'),
        email_etudiant: formData.get('email'),
        mat_etudiant: formData.get('matricule')
    };

    try {
        // Add student to the main students collection
        await setDoc(doc(colRefEt), studentData, { merge: false });
        console.log("Student added to Firestore");

        // Add matricule to the specific group collection
        const groupName = formData.get('groupe');
        await setDoc(doc(collection(db, `groups/${groupName}/grp`), formData.get('matricule')), { matricule: formData.get('matricule') }, { merge: false });
        console.log("Matricule added to group collection in Firestore");

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
                    const teacherId = doc.id; 

                    const row = document.createElement('tr');
                    row.innerHTML = `
                      <td>${teacher.prenom_enseignant}</td>
                      <td>${teacher.nom_enseignant}</td>
                      <td>${teacher.departement}</td>
                      <td>${teacher.email_enseignant}</td>
                      <td><button class="remove-btn" data-teacher-id="${teacherId}">Remove</button></td>
                    `;
                    teacherTable.appendChild(row);
                    row.querySelector('.remove-btn').addEventListener('click', (event) => {
                        const teacherId = event.target.getAttribute('data-teacher-id');
                        removeTeacher(teacherId);
                      });
                });
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        }

        fetchTeachers();
    }
});
async function removeTeacher(teacherId) {
    try {
      const teacherDocRef = doc(db, 'enseignants', teacherId);
      await deleteDoc(teacherDocRef);
      console.log(`Teacher with ID ${teacherId} has been removed.`);
      document.querySelector(`button[data-teacher-id="${teacherId}"]`).closest('tr').remove();
    } catch (error) {
      console.error('Error removing teacher: ', error);
    }
  }

  
document.addEventListener('DOMContentLoaded', () => {
    const studentTable = document.querySelector('#studentTable tbody');

    if (studentTable) {
        async function fetchStudents() {
            try {
                const querySnapshot = await getDocs(collection(db, 'étudiants'));
                querySnapshot.forEach((doc) => {
                    const student = doc.data();
                    const studentId = doc.id; 
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.prenom_etudiant}</td>
                        <td>${student.nom_etudiant}</td>
                        <td>${student.mat_etudiant}</td>
                        <td>${student.email_etudiant}</td>
                        <td><button class="remove-btn" data-student-id="${studentId}">Remove</button></td>
                    `;
                    studentTable.appendChild(row);
                    row.querySelector('.remove-btn').addEventListener('click', (event) => {
                        const studentId = event.target.getAttribute('data-student-id');
                        removeStudent(studentId);
                      });
                });
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        fetchStudents();
    }
});
async function removeStudent(studentId) {
    try {
        // Reference to the student document in the 'étudiants' collection
        const studentDocRef = doc(db, 'étudiants', studentId);

        // Find the group the student belongs to by searching through all group collections
        const groupsSnapshot = await getDocs(collection(db, 'groups'));
        let groupName = null;

        for (const groupDoc of groupsSnapshot.docs) {
            const groupSubColRef = collection(db, `groups/${groupDoc.id}/grp`);
            const studentGroupDoc = await getDoc(doc(groupSubColRef, studentId));
            if (studentGroupDoc.exists()) {
                groupName = groupDoc.id;
                break;
            }
        }

        if (!groupName) {
            console.error('Group for the student not found.');
            return;
        }

        // Delete the student document from the 'étudiants' collection
        await deleteDoc(studentDocRef);
        console.log(`Student with ID ${studentId} has been removed from the 'étudiants' collection.`);

        // Delete the student document from the relevant group collection
        const groupDocRef = doc(db, `groups/${groupName}/grp`, studentId);
        await deleteDoc(groupDocRef);
        console.log(`Student with ID ${studentId} has been removed from the 'groups/${groupName}/grp' collection.`);

        // Remove the corresponding row from the HTML table
        document.querySelector(`button[data-student-id="${studentId}"]`).closest('tr').remove();
    } catch (error) {
        console.error('Error removing student: ', error);
    }
}
