import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { collection, doc, getDoc, getDocs, getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

// Function to get a sub-collection by document ID
async function getSubCollection(groupId) {
    try {
        const groupRef = doc(db, 'présences', groupId);
        const grpCollectionRef = collection(groupRef, 'grp');
        const grpQuerySnapshot = await getDocs(grpCollectionRef);

        const studentInfoArray = grpQuerySnapshot.docs.map(doc => doc.id);
        return studentInfoArray;
    } catch (error) {
        console.error('Error retrieving sub-collection:', error);
        throw error;
    }
}

// Function to get student information by ID
async function getStudentInformation(studentId) {
    try {
        const studentRef = doc(db, 'étudiants', studentId);
        const studentDoc = await getDoc(studentRef);

        if (!studentDoc.exists()) {
            throw new Error(`Student with ID ${studentId} does not exist.`);
        }

        return studentDoc.data();
    } catch (error) {
        console.error('Error retrieving student information:', error);
        throw error;
    }
}

// Function to populate the student table
function populateStudentTable(studentInfoArray) {
    const studentTableBody = document.getElementById("attendance-body");
    studentTableBody.innerHTML = '';

    studentInfoArray.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.prenom_etudiant}</td>
            <td>${student.nom_etudiant}</td>
            <td>${student.mat_etudiant}</td>
        `;
        studentTableBody.appendChild(row);
    });
}

// Function to fetch and show group data when a group button is clicked
async function showGroupData(groupName) {
    try {
        const studentIds = await getSubCollection(groupName);
        console.log('Students in sub-collection:', studentIds);

        const studentPromises = studentIds.map(studentId => getStudentInformation(studentId));
        const studentInfoArray = await Promise.all(studentPromises);
        console.log('Student information:', studentInfoArray);

        populateStudentTable(studentInfoArray);
    } catch (error) {
        console.error('Error retrieving group data:', error);
    }
}

// Event listener for group buttons to switch between groups
document.addEventListener('DOMContentLoaded', async function() {
    const groupButtons = document.querySelector('.group-buttons');
    groupButtons.innerHTML = '';

    try {
        const groupsQuerySnapshot = await getDocs(collection(db, 'groups'));

        groupsQuerySnapshot.forEach(doc => {
            const groupName = doc.id;
            const button = document.createElement('button');
            button.classList.add('btn');
            button.textContent = groupName;
            button.onclick = () => {
                showGroupData(groupName);
            };
            groupButtons.appendChild(button);
        });

        if (groupsQuerySnapshot.size > 0) {
            const firstGroupName = groupsQuerySnapshot.docs[0].id;
            showGroupData(firstGroupName);
        }
    } catch (error) {
        console.error('Error getting documents:', error);
    }
});