# Welcome to Habit Tracker App 👋

This is your dedicated mobile application for cultivating and maintaining positive habits.

## Overview

The **Habit Tracker App** is a robust and intuitive mobile application designed to help users cultivate and maintain positive habits effortlessly. Built with a focus on simplicity and powerful functionality, it allows you to define and manage daily, weekly, or monthly routines, providing clear visual feedback and analytics on your progress. **Authentication** is a core feature, ensuring your data is secure and personal.

## Features

This app comes packed with features to make habit tracking a breeze:

* **Flexible Habit Creation**:
    * **Create habits** that are **daily**, **weekly**, or **monthly** recurrent.
* **Intuitive Swipe Gestures**:
    * **Swipe right** on a habit to instantly **delete** it from your list.
    * **Swipe left** on a habit to **mark it as completed** for the current day/period. Swiping again (if already completed) will unmark it.
* **Secure User Authentication**:
    * **Authentication** is mandatory. Users must **sign in** to access and manage their habits, ensuring data privacy and personalization.
* **Comprehensive Data Management**:
    * Leverages **CRUD operations** (Create, Read, Update, Delete) to manage your habits efficiently.
* **Insightful Analytics**: Track your progress with detailed analytics on your habits.

## Screens

The app is structured around three main, easy-to-navigate screens:

1.  **Today's Habit**:
    * This is your main dashboard.
    * It displays **all the habits you have created** that are relevant for the current day/period.
    * Here, you can actively **swipe right to delete** habits or **swipe left to mark them as completed**.

2.  **Streaks**:
    * Dive deep into your habit performance.
    * This screen provides **analytics of your habits**, showcasing your **best habits**, **total habits completed**, completion rates, and other insightful statistics to keep you motivated.

3.  **Add Habit**:
    * Your dedicated screen to **create new habits**.
    * Define the habit's name, frequency (daily, weekly, monthly), and any other relevant details.

## Technologies Used

This application is built with a modern and robust technology stack:

* **Expo**: A powerful framework for universal React applications, enabling rapid development for iOS, Android, and web.
* **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality, readability, and maintainability.
* **Appwrite**: A self-hosted backend-as-a-service platform providing:
    * **Authentication**: Secure user sign-up and sign-in functionality.
    * **CRUD operations**: For managing all habit-related data in a scalable database.

## Get started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (LTS version recommended)
* npm or Yarn
* Expo CLI (`npm install -g expo-cli`)
* An Appwrite instance (local or hosted)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Alimisolution/Habit-Tracker-App.git](https://github.com/Alimisolution/Habit-Tracker-App.git)
    cd Habit-Tracker-App
    ```

2.  **Install dependencies**
    ```bash
    npm install # or yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root of your project and add your Appwrite credentials:

    ```
    EXPO_PUBLIC_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT
    EXPO_PUBLIC_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
    EXPO_PUBLIC_APPWRITE_PLATFORM=YOUR_APPWRITE_PLATFORM # e.g., "io.appwrite.habittrackerapp" or your package name
    EXPO_PUBLIC_DB_ID=YOUR_DATABASE_ID
    EXPO_PUBLIC_HABIT_COLLECTION_ID=YOUR_HABIT_COLLECTION_ID
    EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=YOUR_COMPLETIONS_COLLECTION_ID
    ```
    *Replace the placeholder values with your actual Appwrite project details. You'll need to set up your Appwrite database and collections.*

### Running the App

1.  **Start the Expo development server**
    ```bash
    npx expo start
    ```
    In the output, you'll find options to open the app in a
    * [development build](https://docs.expo.dev/develop/development-builds/introduction/)
    * [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
    * [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
    * [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

    You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Contributing

Contributions are welcome! If you have suggestions or want to improve the app, please feel free to open an issue or submit a pull request.
