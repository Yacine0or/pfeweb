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
const colRefNot = collection(db, 'notifications');

function generateRandomId(length = 10) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

async function addNotificationAdmin() {
    const form = document.querySelector('#notification-form-admin');
    const formData = new FormData(form);

    const notificationData = {
        id: generateRandomId(),
        recipient: formData.get('recipient'),
        notification_text: formData.get('message'),
        from: 'admin',
    };

    try {
        await setDoc(doc(colRefNot, notificationData.id), notificationData, { merge: false });
        
        form.reset();
    } catch (error) {
        console.error("Error adding notification to Firestore: ", error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const formNotif = document.querySelector('#notification-form-admin');

    if (formNotif) {
        formNotif.addEventListener('submit', (e) => {
            e.preventDefault();
            addNotificationAdmin();
        });
    }

  
    
});

document.addEventListener("DOMContentLoaded", function() {
    const sentNotifications = document.getElementById("sent-notifications-admin");
    if (sentNotifications) {
        async function fetchNotifsAdmin() {
            try {
                const querySnapshot = await getDocs(collection(db, 'notifications'));
                querySnapshot.forEach((doc) => {
                    const notifications = doc.data();
                    if(notifications.from === 'admin'){
                    const newNotification = document.createElement("div");
                    newNotification.className = "notification";
                    newNotification.textContent = `To: ${notifications.recipient} - Message: ${notifications.notification_text}`;
                    sentNotifications.appendChild(newNotification);
                }
                });
            } catch (error) {
                console.error("Error fetching notifs:", error);
            }
        }

        fetchNotifsAdmin();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const receiveNotifications = document.getElementById("notification-list-admin");
    if (receiveNotifications) {
        async function fetchNotifsAdmin() {
            try {
                const querySnapshot = await getDocs(collection(db, 'notifications'));
                querySnapshot.forEach((doc) => {
                    const notifications = doc.data();
                    if(notifications.from !== 'admin' && (notifications.recipient ==='both' || notifications.recipient ==='admin')){
                    const notification = document.createElement("div");
                    notification.className = "notification";
                    notification.innerHTML = `
                    <strong>From:</strong> ${notifications.from}<br>
                    <strong>Message:</strong> ${notifications.notification_text}`;
                    receiveNotifications.appendChild(notification);
                }
                });
            } catch (error) {
                console.error("Error fetching notifs:", error);
            }
        }

        fetchNotifsAdmin();
    }
});



async function addNotificationTeacher() {
    const form = document.querySelector('#notification-form-teacher');
    const formData = new FormData(form);

    const notificationData = {
        id: generateRandomId(),
        recipient: formData.get('recipient'),
        notification_text: formData.get('message'),
        from: 'teacher',
    };

    try {
        await setDoc(doc(colRefNot, notificationData.id), notificationData, { merge: false });
        
        form.reset();
    } catch (error) {
        console.error("Error adding notification to Firestore: ", error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const formNotif = document.querySelector('#notification-form-teacher');

    if (formNotif) {
        formNotif.addEventListener('submit', (e) => {
            e.preventDefault();
            addNotificationTeacher();
        });
    }

  
    
});

document.addEventListener("DOMContentLoaded", function() {
    const sentNotifications = document.getElementById("sent-notifications-teacher");
    if (sentNotifications) {
        async function fetchNotifsTeacher() {
            try {
                const querySnapshot = await getDocs(collection(db, 'notifications'));
                querySnapshot.forEach((doc) => {
                    const notifications = doc.data();
                    if(notifications.from === 'teacher'){
                    const newNotification = document.createElement("div");
                    newNotification.className = "notification";
                    newNotification.textContent = `To: ${notifications.recipient} - Message: ${notifications.notification_text}`;
                    sentNotifications.appendChild(newNotification);
                }
                });
            } catch (error) {
                console.error("Error fetching notifs:", error);
            }
        }

        fetchNotifsTeacher();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const receiveNotifications = document.getElementById("notification-list-teacher");
    if (receiveNotifications) {
        async function fetchNotifsAdmin() {
            try {
                const querySnapshot = await getDocs(collection(db, 'notifications'));
                querySnapshot.forEach((doc) => {
                    const notifications = doc.data();
                    if(notifications.from !== 'teacher' && (notifications.recipient ==='both' || notifications.recipient ==='teachers')){
                    const notification = document.createElement("div");
                    notification.className = "notification";
                    notification.innerHTML = `
                    <strong>From:</strong> ${notifications.from}<br>
                    <strong>Message:</strong> ${notifications.notification_text}`;
                    receiveNotifications.appendChild(notification);
                }
                });
            } catch (error) {
                console.error("Error fetching notifs:", error);
            }
        }

        fetchNotifsAdmin();
    }
});

