# SSH Shared Grocery Prototype

## Overview

This project is a group order management web application prototype designed for the LI SWE module, done by the group SWE International Coders. The app is built with **Next.js** and **Supabase**, featuring a clean and intuitive user interface that allows users to manage their group orders efficiently.

## Live Deployment

The application is deployed and accessible at:  
[https://lh-swe-project.vercel.app/](https://lh-swe-project.vercel.app/)

---

## Pages and Features

### **1. Login Page**  
**URL:** [https://lh-swe-project.vercel.app/login](https://lh-swe-project.vercel.app/login)  

The login page allows existing users to authenticate using their email and password. Upon successful login, users are redirected to the **Home Page** to view their group orders.

- **Features:**
  - User authentication via Supabase.
  - Redirects to the home page upon successful login.

---

### **2. Register Page**  
**URL:** [https://lh-swe-project.vercel.app/register](https://lh-swe-project.vercel.app/register)  

New users can create an account by providing their email, password, and name. Once registered, they are redirected to the **Home Page**.

- **Features:**
  - Account creation with validation for email, password, and name fields.
  - Automatic creation of a corresponding database entry for the user in the `students` table.

---

### **3. Home Page**  
**URL:** [https://lh-swe-project.vercel.app/](https://lh-swe-project.vercel.app/)  

The home page displays all the group orders the logged-in user is involved in. It includes filtering options to view ongoing or completed orders.

- **Features:**
  - **List of Group Orders:** Displays group orders associated with the user.
  - **Filter Options:** Toggle between "Ongoing" and "Completed" group orders for easy navigation.
  - **Create New Group Order:** A button to navigate to the "New Group Order" page for creating a new order.

---

### **4. New Group Order Page**  
**URL:** [https://lh-swe-project.vercel.app/new_order](https://lh-swe-project.vercel.app/new_order)  

This page allows users to create a new group order by specifying the group order title and details.

- **Features:**
  - Form to specify the group order title.
  - Automatically associates the current user as the host of the new group order.
  - Redirects back to the **Home Page** upon successful creation.

---

### **5. Group Order Details Page**  
**URL:** [https://lh-swe-project.vercel.app/order/[id]](https://lh-swe-project.vercel.app/order/[id])  

The group order details page provides in-depth information about a specific group order. Users can manage items and participants in the order.

- **Features:**
  - **Add Items:** Users can add items to the group order, including the item name, quantity, and associated participants.
  - **Delete Items:**: Users can delete items that they created in the group order.
  - **Add Participants:** Users can invite others to the group order by providing their student IDs.
  - **Overview:** Displays all items added to the group order along with participant contributions and price summary at the top.

---

## How to Navigate the Website

1. **Login or Register:** Start by logging in or creating an account via the login or register page.
2. **Home Page:** Once logged in, view all your group orders and filter between ongoing and completed orders.
3. **Create Group Order:** Use the "Create Order" button on the home page to add a new group order.
4. **View Group Order Details:** Click on a group order from the home page to view or manage its details.
5. **Add Items or Participants:** Use the group order details page to add items or participants as needed.

---

# Developers Guide

This guide provides a step-by-step process to set up and run the project locally. It also includes the details for CI/CD configuration and environment variables.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js v20** or higher
- **npm** (comes with Node.js)
- **PostgreSQL** (for the database)
- **Prisma CLI** (optional, but useful for managing the database schema. alternatively, run `npx prisma studio`)

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/LH-SWE-international-coders/finalproject.git
cd your-repository
```

---

### 2. Install Dependencies

Install the required dependencies by running:

```bash
npm ci
```
---

### 3. Environment Variables

Create a `.env` file in the root directory of the project and populate it with the following variables:

```env
DATABASE_URL=your_database_url_here
DIRECT_URL=your_direct_database_url_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Use the live website's URL when deploying
```

---

### 4. Set Up the Database

Ensure your PostgreSQL database is running and the `DATABASE_URL` points to the correct database. Run the following command to apply the database schema:

```bash
npx prisma migrate dev
```

This command will:

1. Create the necessary tables and fields as per the schema.
2. Apply any pending migrations.

Generate the Prisma client:

```bash
npm run generate
```

This will create the Prisma client for interacting with the database.

---

### 5. Run the Development Server

Start the development server locally:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to view the application.

---

## CI/CD Pipeline

### Overview

The CI/CD pipeline ensures that the code is tested and built properly before being deployed. Here's a breakdown of the pipeline, which you can see the code for under `.github/workflows/main.yml`:

1. **Checkout Code:** Fetch the repository using `actions/checkout`.
2. **Set Up Node.js:** Configure Node.js environment using `actions/setup-node`.
3. **Install Dependencies:** Run `npm ci` to install the required dependencies.
4. **Generate Prisma Client:** Generate the Prisma client and `.prisma` folder with `npm run generate`.
5. **Run Tests:** Execute Jest tests to validate the codebase using `npm test`.
6. **Build:** Build the Next.js application using `npm run build`.

---
## Testing

Run tests locally to ensure your code is functioning correctly:

```bash
npm test
```

---

## Deployment

The application is deployed using Vercel. To deploy:

1. Push the changes to the `main` branch.
2. Ensure your `.env` variables are updated in the Vercel environment settings.

---