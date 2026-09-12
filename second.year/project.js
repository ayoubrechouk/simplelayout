let students = [
  { id: 1, name: "Ahmed", age: 20, grades: [12, 15, 17] },
  { id: 2, name: "Fatima", age: 22, grades: [8, 9, 10] },
  { id: 3, name: "Youssef", age: 21, grades: [14, 18, 16] },
  { id: 4, name: "Ahmed", age: 19, grades: [7, 6, 8] }
];
// 1. ajoute
const addStudent = (newaStudent) => {
    students = [...students, newaStudent];
    return students;
};
// 2. supprime
const deleteStudent = (id) => {
    students = students.filter(student => student.id !== id);
    return students;
};
// 3recherche par id
const searchStudent = (id) => {
    return students.filter(student => student.id === id);
};
// par nom 
const searchStudentByName = (name) => {
    return students.filter(student => student.name === name);
};
// 4. moyenne des notes
const averageGrades = (id) => {
    const student = students.find(student => student.id === id);
    if (student) {
        const total = student.grades.reduce((acc, grade) => acc + grade, 0);
        return total / student.grades.length;
    }
    return null;
};
// 6 moyenne >= 10
const studentsWithAverageAboveTen = () => {
    return students.filter(student => averageGrades(student.id) >= 10);
};
// 7. Trouver l'étudiant ayant la meilleure moyenne (utilisation de sort)
const getTopStudent = () => {
  if (students.length === 0) return null;
  // [...students] crée une copie pour ne pas modifier le tableau d'origine
  const sorted = [...students].sort((a, b) => calculateAverage(b.grades) - calculateAverage(a.grades));
  return sorted[0];
};

// 8. Trier les étudiants par moyenne par ordre décroissant (utilisation de sort)
const sortStudentsByAverage = () => {
  return [...students].sort((a, b) => calculateAverage(b.grades) - calculateAverage(a.grades));
};

// ==========================================
// EXEMPLES D'UTILISATION ET TESTS
// ==========================================

console.log("--- 1. Ajout d'un étudiant ---");
addStudent({ id: 5, name: "Sara", age: 20, grades: [16, 17, 19] });
console.log(students);

console.log("\n--- 2. Suppression de l'étudiant id: 2 ---");
deleteStudent(2);
console.log(students);

console.log("\n--- 3. Recherche de l'étudiant avec id: 1 ---");
console.log(findStudentById(1));

console.log("\n--- 4. Recherche des étudiants nommés 'Ahmed' ---");
console.log(findStudentsByName("Ahmed"));

console.log("\n--- 5. Calcul de la moyenne de l'étudiant id: 1 ---");
const ahmed = findStudentById(1);
console.log(`Moyenne de ${ahmed.name} : ${calculateAverage(ahmed.grades)}`);

console.log("\n--- 6. Étudiants ayant une moyenne >= 10 ---");
console.log(getPassedStudents());

console.log("\n--- 7. Étudiant avec la meilleure moyenne ---");
console.log(getTopStudent());

console.log("\n--- 8. Liste des étudiants triés par moyenne (décroissante) ---");
console.log(sortStudentsByAverage());

import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "error",
      "no-console": "warn",
      "prefer-const": "error"
    }
  }
];