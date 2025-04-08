# Pokédex

A dynamic Pokedex web application built with Next.js (App Router), TypeScript, and Tailwind CSS, leveraging the public PokeAPI (v2). It allows users to browse, filter, sort Pokémon, and view detailed information including stats and evolution chains.

> Developed by **Kyle Nathaniel P. Vinuya** for **Old.St Labs**

Live Site: https://pokedex-navy-two.vercel.app

---

## ✨ Features

- **Pokémon List View:**
  - Displays Pokémon cards with ID, Name, Image, and Types.
  - **Infinite Scrolling:** Automatically loads more Pokémon as you scroll down.
  - **Filtering:**
    - By Search Term: Filter Pokémon by name or exact ID (e.g., "charizard", "6", "#006").
    - By Type: Select one or multiple types to filter the list (e.g., "fire", "flying").
  - **Sorting:** Sort the list by:
    - ID (Ascending/Descending)
    - Name (Ascending/Descending)
  - **Loading & Status Indicators:** Shows loading spinners, status messages (e.g., "End of List"), and error messages.
  - **Smooth Animations:** Staggered card entrance animations using `motion`.
- **Detailed Pokémon View:**
  - Accessible by clicking on a Pokémon card.
  - Displays in a modal overlay.
  - Shows comprehensive details of each Pokémon
  - Handles its own loading and error states.
- **Responsive Design:** Adapts to different screen sizes using Tailwind CSS.

---

## Screenshots

![image](https://github.com/user-attachments/assets/c9cc7ed9-9594-49fc-a18a-063615c9d349)
![image](https://github.com/user-attachments/assets/182e64d5-6ea0-4308-b857-38a045c459b3)
![image](https://github.com/user-attachments/assets/b917106b-f356-4c78-a5fd-dca04b105300)
![image](https://github.com/user-attachments/assets/17861b43-fbdb-4df0-88a2-0e27820ca16c)

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Motion One (React Client)](https://motion.dev/react/quick-start)
- **API:** [PokeAPI v2](https://pokeapi.co/)

---

## 🚀 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kyleBSCS/pokedex.git
    cd pokedex
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) (or your configured port) in your browser to see the application.

---

## Further Improvements
1. Smoother loading when user scrolls too fast.
2. Skeletons when loading instead of explicit loading modal.
3. Pre-load repetitive images (such as the BG pokedex on detail modal).
4. Actual caching of both pokemon list and details to local storage.

---

## 📜 License

This project is for educational and personal use only.

> Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and The Pokémon Company.
> © 2025 Kyle Nathaniel P. Vinuya. All rights reserved.

_This README was created with the help of AI._
