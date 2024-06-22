import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

// Function to get students by attendance status
async function getStudentsByAttendanceStatus(groupId, status) {
    try {
        const groupRef = doc(db, 'présences', groupId);
        const grpCollectionRef = collection(groupRef, 'grp');
        const q = query(grpCollectionRef, where('etudiant_present', '==', status));
        const grpQuerySnapshot = await getDocs(q);

        const studentInfoArray = grpQuerySnapshot.docs.map(doc => doc.id);
        return studentInfoArray;
    } catch (error) {
        console.error('Error retrieving sub-collection by attendance status:', error);
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

// Function to populate the absence table with "View PDF" and justification status
function populateAbsenceTable(absenceData) {
    const absenceTableBody = document.getElementById("absence-body");

    absenceTableBody.innerHTML = '';
    absenceData.forEach(student => {
        const row = document.createElement("tr");

        const justificationStatusColor = 
            student.justificationStatus === "accepted" ? "green" :
            student.justificationStatus === "rejected" ? "red" :
            "black";
        row.innerHTML = `
            <td>${student.prenom_etudiant}</td>
            <td>${student.nom_etudiant}</td>
            <td>${student.mat_etudiant}</td>
            <td><button class="btn" onclick="viewJustification('${student.justificationPdf}')">View PDF</button></td>
            <td style="color: ${justificationStatusColor};">
                <input type="radio" name="justification-${student.mat_etudiant}" value="accepted"> Accepted
                <input type="radio" name="justification-${student.mat_etudiant}" value="rejected"> Rejected
            </td>
        `;

        // Attach event listeners to radio buttons
        row.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                student.justificationStatus = radio.value;
                const color = radio.value === "accepted" ? "green" : "red";
                row.querySelector('td:last-child').style.color = color;
            });
        });

        absenceTableBody.appendChild(row);
    });
}

// Function to fetch and show group data when a group button is clicked
async function showGroupData(groupName) {
    try {
        const presentStudentIds = await getStudentsByAttendanceStatus(groupName, true); 
        const absentStudentIds = await getStudentsByAttendanceStatus(groupName, false); 

        const presentStudentPromises = presentStudentIds.map(studentId => getStudentInformation(studentId));
        const presentStudentInfoArray = await Promise.all(presentStudentPromises);
        
        const absentStudentPromises = absentStudentIds.map(studentId => getStudentInformation(studentId));
        const absentStudentInfoArray = await Promise.all(absentStudentPromises);

        populateStudentTable(presentStudentInfoArray);
        populateAbsenceTable(absentStudentInfoArray);
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
