# User Management Dashboard

This is a coding task solution for a user management dashboard built using React, TypeScript, MUI, and Redux Toolkit with RTK Query.

The application allows users to view, add, edit, and delete user records fetched from a mock API, showcasing proficiency in modern frontend state management and component architecture.

---

## 🚀 Live Demo

will be hosting soon

---

## ✅ Evaluation Criteria Met

The following criteria have been successfully implemented:

### Core Requirements
* **User Display:** Fetches users from `jsonplaceholder.typicode.com/users` and displays Name, Email, Username, and Actions (Edit/Delete) in an MUI Table.
* **CRUD Operations:** Implements Add (POST), Edit (PUT/PATCH), and Delete (DELETE) actions using RTK Query mutations.
* **Data Persistence Logic:** Utilizes **Optimistic Updates** and custom Redux configuration to enforce client-side persistence against the non-persistent mock API.
* **UI/UX:** Uses MUI Dialogs for Add/Edit/Delete confirmation and handles loading/error states gracefully.

### Bonus Features (Impressive)
* **Search Functionality:** Includes a functional search bar that filters users by Name, Username, and Email.
* **Notifications:** Implements Snackbar notifications for success and error feedback on all CRUD operations.

---

## ⚙️ Setup and Installation

### Prerequisites
* Node.js (v18+)
* npm or Yarn

### Steps
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/atharv2196/typeScript_task.git](https://github.com/atharv2196/typeScript_task.git)
    cd typeScript_task
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Run the application:**
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5173/` (or similar address).

---

## 🧱 Tech Stack

* **Frontend:** React.js
* **Language:** TypeScript
* **Styling:** MUI (Material UI)
* **State Management:** Redux Toolkit
* **API Layer:** RTK Query