# Seating Distribution Optimizer

This repository contains code that implements a simple genetic algorithm to find an optimized seating distribution that considers the teacher's and students' preferences. This code assumes a rectangular grid of students where the last row may not be fully filled.

### The questionnaires

The preferences are provided using Google Forms questionnaires, one to be filled out the teacher and one by the students, both with a very similar structure. These must then be exported as a CSV file.

The students' questionnaire (which is optional) must consist of:
* A drop-down menu to select their name.
* One 1-n (by default 1-5) linear scale question for each student in that class (with the name of a student as the title) to select their preference to sit next to that student.

The teacher's questionnaire must consist of:
* A drop-down menu to select the name of a student.
* One 1-n (by default 1-5) linear scale question for each student in that class (with the name of a student as the title) to select the preference of those two students sitting near each other.

Any unanswered numeric selection is taken as the value in the middle such as to ease the process of filling out the forms for the teacher. It is also important to fill in the students' names correctly, as any mismatch may cause issues.

### The inputs

The main input parameters are the following:
* The teacher's CSV file.
* The weight of the teacher's perferences.
* The students' CSV file (optional).
* The weight of the students' preferences.
* The number of rows of chairs.

The weights indicate the relative importance each preferences have. For example, if the teacher's weight is four times larger, their score is four times as important as the score of the students combined.

There also are some advanced settings that can be modified. These are:
* The weights for each preference value
* The number of parallel distributions
* The mutation rate
* The death rate

The weights allow to map the 1-n values provided by the questionnaires to a different set of values, allowing for example to set negative values to those options below the midpoint or to increase the values at the extremes.

The number of parallel distributions controls the number of seating distributions that are considered at the same time. This is a relatively important parameter: the higher the number the higher the chance that one of the distributions is especially good, but the slower it is to execute each iteration of the algorithm.

The mutation and death rate are probabilities, so they have to be between 0 and 1. The mutation rate represents the probability that the best distribution in a specific generation disappears in the next generation. Analogously, given that a specific distribution is to be modified, the mutation rate represents the probability of the student with the best score being switched seats.

### Generating a distribution

Once all of the inputs have been set, it is time to generate the distributions. In order to do so, choose a number of iterations to execute. Note that during the time that the computer is running the selected iterations it will not show any information, so start with a reasonable number (e.g. 1000) and gauge how much time it takes. Note that (barring randomness), the same output will be produced running 10000 steps at once than in block of 1000.

After each block of iterations is executed, the best distribution of the last iteration will be shown on screen together with its score, the median score and the minimum score of the last iteration.

### An overview of the algorithm

The first step is to generate a set number of random seating distributions. Then, these distributions are scored by adding the scores of each student in the distribution. The scoring for each student is done taking into account the teacher's and students' preferences and weights and the distance between students.

Once that is all done, half of the distributions are eliminated randomly. However, not all of them have the same chance of being eliminated, those with higher scores are more likely to remain while those with lower scores are less likely to.

Now, the algorithm creates new distributions until there are as many as there were originally. To do so, each remaining distribution is copied and mutated. This mutation is done similarly to how the eliminations were handled, some students are randomly selected according to their score and permutated with each other (this time without following any criterion).

After this, the distributions are scored and the process starts all over.

### Comments

This was created as a high project without much (or any) formal knowledge on JavaScript, HTML or CSS, so the code may be far from optimal and may not follow best practices. For that same reason, it was coded in Spanish. I would like to translate both the UI and the code into English, but unfortunately I doubt I will get to it.
