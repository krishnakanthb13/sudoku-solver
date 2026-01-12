# Contributing to Sudoku Solver

First off, thank you for considering contributing to Sudoku Solver! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

## 🐛 How to Report Bugs
1. **Search existing issues**: Check if the bug has already been reported.
2. **Open a new issue**: Use a clear title and provide as much detail as possible:
   - Steps to reproduce the bug.
   - Expected behavior vs. actual behavior.
   - Screenshots if applicable.
   - Your browser and OS details.

## 💡 How to Suggest Features
We love new ideas! To suggest a feature:
1. Open an issue and label it as an `enhancement`.
2. Describe the feature and why it would be useful.
3. If possible, provide examples or sketches of how it might work.

## 🛠️ Development Setup
To start contributing code:

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/krishnakanthb13/sudoku-solver.git
   cd sudoku-solver
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🚀 Submitting Your Changes
1. **Commit your changes**: Write clear, descriptive commit messages.
2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request (PR)**:
   - Provide a summary of the changes.
   - Reference any related issues (e.g., `Closes #123`).
   - Wait for review and feedback!

## ✅ Testing Checklist
Before submitting a PR, please ensure:
- [ ] The Sudoku grid still solves correctly using the "Solve" button.
- [ ] Switching between 6x6 and 9x9 works flawlessly.
- [ ] "Hint" system reveals the correct next move.
- [ ] New solves are correctly added to the History Log.
- [ ] Dark/Light mode transitions are smooth.
- [ ] The app remains responsive on mobile views.

## 📄 License
By contributing, you agree that your contributions will be licensed under its **GNU General Public License v3.0**.

---
*Happy Coding!*
