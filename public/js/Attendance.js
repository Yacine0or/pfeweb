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


// Function to get students in a group
async function getStudentsInGroup(groupName) {
    try {
        const groupRef = doc(db, 'groups', groupName);
        const groupCollectionRef = collection(groupRef, 'grp');
        const groupQuerySnapshot = await getDocs(groupCollectionRef);

        const studentIds = groupQuerySnapshot.docs.map(doc => doc.id);
        return studentIds;
    } catch (error) {
        console.error('Error retrieving group sub-collection:', error);
        throw error;
    }
}

// Function to get séances for a group
async function getSeancesForGroup(branch, group) {
    try {
        const séancesCollectionRef = collection(db, 'séances');
        const séancesQuerySnapshot = await getDocs(query(séancesCollectionRef, where('branch', '==', branch)));

        const séances = [];
        séancesQuerySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.group.split(',').includes(group)) {
                séances.push({ id: doc.id, ...data });
            }
        });

        return séances;
    } catch (error) {
        console.error('Error retrieving séances:', error);
        throw error;
    }
}

// Function to populate the séances table
function populateSeancesTable(seances) {
    const seancesTableBody = document.getElementById("seances-body");
    seancesTableBody.innerHTML = '';

    seances.forEach(seance => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${seance.time}</td>
            <td>${seance.name}</td>
            <td>${seance.type}</td>
            <td>${seance.branch}</td>
            <td>${seance.group}</td>
            <td>${seance.room}</td>
        `;
        row.onclick = () => {
            showSeanceData(seance.id, seance.branch, seance.group);
        };
        seancesTableBody.appendChild(row);
    });
}

// Function to get present student IDs in a specific séance
async function getPresentStudentIdsInSeance(seanceId) {
    try {
        const seanceDocRef = doc(db, 'séances', seanceId);
        const presencesCollectionRef = collection(seanceDocRef, 'présences');
        const présencesQuerySnapshot = await getDocs(presencesCollectionRef);

        const studentIds = présencesQuerySnapshot.docs.map(doc => doc.data().etudiant);
        return studentIds;
    } catch (error) {
        console.error('Error retrieving presence sub-collection:', error);
        throw error;
    }
}

// Function to show group data when a group button is clicked
async function showGroupData(branch, group) {
    try {
        const seances = await getSeancesForGroup(branch, group);
        populateSeancesTable(seances);
    } catch (error) {
        console.error('Error retrieving group data:', error);
    }
}

// Function to show data for a specific séance
async function showSeanceData(seanceId, branch, group) {
    try {
        // Show the sections
        document.querySelector('.attendance-section').classList.remove('hidden');
        document.querySelector('.absence-section').classList.remove('hidden');
        document.querySelector('.print-section').classList.remove('hidden');

        // Split the group string into individual group identifiers
        const groupIds = group.split(',');

        // Initialize arrays to hold attendance and absence data
        let attendanceData = [];
        let absenceData = [];

        // Process each group identifier
        for (const groupId of groupIds) {
            const studentIdsInGroup = await getStudentsInGroup(`${branch}${groupId}`);
            const presentStudentIds = await getPresentStudentIdsInSeance(seanceId);

            const presentStudentPromises = presentStudentIds.map(studentId => getStudentInformationByMatEtudiant(studentId));
            const presentStudentInfoArray = await Promise.all(presentStudentPromises);

            const absentStudentIds = studentIdsInGroup.filter(id => !presentStudentIds.includes(id));
            const absentStudentPromises = absentStudentIds.map(studentId => getStudentInformationByMatEtudiant(studentId));
            const absentStudentInfoArray = await Promise.all(absentStudentPromises);

            // Add justificationPdf and justificationStatus fields to attendance and absence data
            const attendanceForGroup = presentStudentInfoArray.map(student => ({
                ...student,
                justificationPdf: '', // Add logic to fetch or link to justification PDF if it exists
                justificationStatus: 'pending' // Default status
            }));

            const absenceForGroup = absentStudentInfoArray.map(student => ({
                ...student,
                justificationPdf: '', // Add logic to fetch or link to justification PDF if it exists
                justificationStatus: 'pending' // Default status
            }));

            // Filter out duplicates based on mat_etudiant before concatenating
            attendanceData = [...attendanceData, ...filterDuplicates(attendanceForGroup)];
            absenceData = [...absenceData, ...filterDuplicates(absenceForGroup)];
        }

        // Filter out present students from absenceData
        const presentStudentIds = attendanceData.map(student => student.mat_etudiant);
        absenceData = absenceData.filter(student => !presentStudentIds.includes(student.mat_etudiant));

        // Populate tables with attendance and absence data
        populateStudentTable(attendanceData);
        populateAbsenceTable(absenceData, seanceId);

    } catch (error) {
        console.error('Error retrieving séance data:', error);
    }
}

// Helper function to filter out duplicates based on mat_etudiant
function filterDuplicates(studentArray) {
    const uniqueStudents = new Map();
    studentArray.forEach(student => {
        uniqueStudents.set(student.mat_etudiant, student);
    });
    return Array.from(uniqueStudents.values());
}

// Function to populate the student table
function populateStudentTable(studentInfoArray) {
    const studentTableBody = document.getElementById("attendance-body");
    studentTableBody.innerHTML = '';

    // Ensure unique students are displayed
    const uniqueStudents = filterDuplicates(studentInfoArray);

    uniqueStudents.forEach(student => {
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
async function populateAbsenceTable(absenceData, seanceId) {
    const absenceTableBody = document.getElementById("absence-body");
    absenceTableBody.innerHTML = '';

    try {
        // Get present student IDs in the séance
        const presentStudentIds = await getPresentStudentIdsInSeance(seanceId);
        console.log('presentStudentIds:',presentStudentIds);
        // Filter absence data to get only students who are absent
        const absentStudents = absenceData.filter(student => !presentStudentIds.includes(student.mat_etudiant));
        console.log('absentStudents:',absentStudents);
        // Populate the absence table with absent students
        absentStudents.forEach(student => {
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
    } catch (error) {
        console.error('Error populating absence table:', error);
    }
}

// Function to get student information by mat_etudiant
async function getStudentInformationByMatEtudiant(mat_etudiant) {
    try {
        // Query by document ID
        const studentDocRefById = doc(db, 'étudiants', mat_etudiant);
        const studentDocSnapshotById = await getDoc(studentDocRefById);

        if (studentDocSnapshotById.exists()) {
            return studentDocSnapshotById.data();
        }

        // Query by mat_etudiant field if document ID query doesn't match
        const studentsCollectionRef = collection(db, 'étudiants');
        const q = query(studentsCollectionRef, where('mat_etudiant', '==', mat_etudiant));
        const studentQuerySnapshot = await getDocs(q);

        if (!studentQuerySnapshot.empty) {
            return studentQuerySnapshot.docs[0].data();
        }

        throw new Error(`Student with mat_etudiant ${mat_etudiant} does not exist.`);
    } catch (error) {
        console.error('Error retrieving student information:', error);
        throw error;
    }
}


// Event listener for group buttons to switch between groups
document.addEventListener('DOMContentLoaded', async function() {
    const groupButtons = document.querySelector('.group-buttons');
    groupButtons.innerHTML = '';

    try {
        const groupsQuerySnapshot = await getDocs(collection(db, 'groups'));

        groupsQuerySnapshot.forEach(doc => {
            const { branch, group } = parseGroupName(doc.id);
            const button = document.createElement('button');
            button.classList.add('btn');
            button.textContent = doc.id;
            button.onclick = () => {
                showGroupData(branch, group);
            };
            groupButtons.appendChild(button);
        });

        if (groupsQuerySnapshot.size > 0) {
            const { branch, group } = parseGroupName(groupsQuerySnapshot.docs[0].id);
            showGroupData(branch, group);
        }
    } catch (error) {
        console.error('Error getting documents:', error);
    }
});

// Function to parse group name into branch and group number
function parseGroupName(groupName) {
    const match = groupName.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) {
        throw new Error(`Invalid group name format: ${groupName}`);
    }
    return { branch: match[1], group: match[2] };
}

// Function to view justification PDF
function viewJustification(pdfUrl) {
    window.open(pdfUrl, '_blank');
}