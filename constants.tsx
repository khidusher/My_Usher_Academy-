
import { Lesson, Badge, LevelQuiz } from './types.ts';

export const LESSONS: Lesson[] = [
  // LEVEL 1: VILLAGE ENTRANCE (THE FOUNDATION)
  {
    id: 'l1-t1',
    title: 'The Legend of Python',
    region: 'Level 1: Village Entrance',
    description: 'Where did it all begin?',
    concept: "Akwaaba! Did you know Python wasn't named after a snake? In 1991, a man named Guido van Rossum created it. He loved a funny show called 'Monty Python’s Flying Circus'. He wanted a language that was as easy to read as a storybook. Today, it's the most popular language in the world!",
    example: '# Use the print function to show text\nprint("Python is legendary!")',
    challenge: 'Show the world your first code! Use the print() function to display the message: "Python is legendary!"',
    initialCode: '# Print the message below:\n',
    solution: 'print("Python is legendary!")',
    testCases: [{ expected: 'Python is legendary!', hint: 'Type print("Python is legendary!")' }],
    xp: 30
  },
  {
    id: 'l1-t2',
    title: 'The Golden Tool',
    region: 'Level 1: Village Entrance',
    description: 'Why Python matters in Ghana.',
    concept: "Why are we learning this? Python is the 'Golden Tool' of the Digital Coast. It powers everything from Mobile Money (MoMo) apps to AI that helps farmers in the Northern Region. Learning Python is like getting a key to every Innovation Hub in Accra!",
    example: 'print("Python is my key")',
    challenge: 'Print the message "I am a future Champion" to show your intent!',
    initialCode: '# Declare your goal:\n',
    solution: 'print("I am a future Champion")',
    testCases: [{ expected: 'I am a future Champion', hint: 'Use print("I am a future Champion")' }],
    xp: 30
  },
  {
    id: 'l1-t3',
    title: 'Code Manners (Syntax)',
    region: 'Level 1: Village Entrance',
    description: 'Following the rules of the road.',
    concept: "Just like we have manners when greeting elders, Python has 'Syntax' — rules for how code must be written. If you miss a bracket or a quote, Python will get confused (SyntaxError). It's not a mistake, it's just Python asking for better manners!",
    example: 'print("Correct Manners") # Works!\n# print "Wrong Manners" # Fails!',
    challenge: 'Fix this code! It is missing parentheses. Print the word "Syntax".',
    initialCode: '# Fix me:\nprint "Syntax"',
    solution: 'print("Syntax")',
    testCases: [{ expected: 'Syntax', hint: 'Add ( and ) around the text.' }],
    xp: 30
  },
  {
    id: 'l1-t4',
    title: 'Talking in Strings (Quotes)',
    region: 'Level 1: Village Entrance',
    description: 'Wrapping your text.',
    concept: "When we want Python to handle text, we call it a 'String'. You must wrap Strings in quotation marks \" \" or ' '. Without them, Python thinks you are talking about a variable (which we learn later).",
    example: 'print("Waakye is life")\nprint(\'Jollof is also life\')',
    challenge: 'Print your favorite Ghanaian dish using single quotes \' \'.',
    initialCode: '# Use single quotes:\n',
    solution: "print('Banku')",
    testCases: [{ expected: '', hint: "Use print('YourFood')" }],
    xp: 30
  },
  {
    id: 'l1-t5',
    title: 'Magic Words (Functions)',
    region: 'Level 1: Village Entrance',
    description: 'Intro to reusable commands.',
    concept: "A 'Function' is a magic word that tells Python to perform a specific task. 'print()' is our first function! The parentheses () are like the mouth of the function, where you feed it information to process.",
    example: 'print("This is a function call")',
    challenge: 'Call the print function to display the word "Function".',
    initialCode: '# Call the print function:\n',
    solution: 'print("Function")',
    testCases: [{ expected: 'Function', hint: 'Type print("Function")' }],
    xp: 40
  },

  // LEVEL 2: CORE BASICS
  {
    id: 'l2-t1',
    title: 'The Storage Bowl',
    region: 'Level 2: Core Basics',
    description: 'Naming variables.',
    concept: "A variable is like a storage bowl. You give it a name (a label) and put something inside. We use '=' to assign a value. For example: food = 'Kelewele'.",
    example: 'food = "Yam"\nprint(food)',
    challenge: 'Create a variable named "city" and set it to "Kumasi". Then print it.',
    initialCode: '# Create city variable:\n',
    solution: 'city = "Kumasi"\nprint(city)',
    testCases: [{ expected: 'Kumasi', hint: 'city = "Kumasi" then print(city)' }],
    xp: 50
  },
  {
    id: 'l2-t2',
    title: 'MoMo Math',
    region: 'Level 2: Core Basics',
    description: 'Basic arithmetic.',
    concept: "Python can do math instantly. Use + (add), - (subtract), * (multiply), and / (divide). Let's calculate a wallet balance!",
    example: 'wallet = 100\nspent = 20\nprint(wallet - spent)',
    challenge: 'Start with "balance" of 500. Subtract "fee" of 5. Print the result.',
    initialCode: 'balance = 500\nfee = 5\n# Print new balance:\n',
    solution: 'balance = 500\nfee = 5\nprint(balance - fee)',
    testCases: [{ expected: '495', hint: 'Use balance - fee' }],
    xp: 50
  }
];

export const QUIZZES: LevelQuiz[] = [
  {
    levelId: 'Level 1: Village Entrance',
    levelName: 'Village Entrance Exam',
    questions: [
      {
        id: 'q1-1',
        question: "Who is the creator of Python?",
        options: ["Bill Gates", "Guido van Rossum", "Mark Zuckerberg", "Kofi Annan"],
        correctIndex: 1,
        explanation: "Guido van Rossum created Python in 1991!"
      },
      {
        id: 'q1-2',
        question: "Why was the language named 'Python'?",
        options: ["After a snake", "After a comedy show", "After a mountain", "It's a secret"],
        correctIndex: 1,
        explanation: "It was named after 'Monty Python’s Flying Circus'!"
      },
      {
        id: 'q1-3',
        question: "What is 'Syntax' in programming?",
        options: ["The cost of code", "The rules of the language", "A type of error", "A keyboard key"],
        correctIndex: 1,
        explanation: "Syntax is the set of rules defining how code must be written."
      },
      {
        id: 'q1-4',
        question: "Which function makes Python 'speak'?",
        options: ["talk()", "say()", "print()", "echo()"],
        correctIndex: 2,
        explanation: "The print() function displays output to the console."
      },
      {
        id: 'q1-5',
        question: "How do you wrap a 'String'?",
        options: ["With brackets []", "With quotes \" \"", "With hashes #", "With stars *"],
        correctIndex: 1,
        explanation: "Strings must be wrapped in single or double quotation marks."
      },
      {
        id: 'q1-6',
        question: "What year was Python born?",
        options: ["1980", "1991", "2000", "2010"],
        correctIndex: 1,
        explanation: "Python was first released in 1991."
      },
      {
        id: 'q1-7',
        question: "What does Python use to group code together?",
        options: ["Parentheses ()", "Colons :", "Indentation (Spaces)", "Semicolons ;"],
        correctIndex: 2,
        explanation: "Python uses indentation (spaces at the start of lines) to group code blocks."
      },
      {
        id: 'q1-8',
        question: "Is Python difficult to learn?",
        options: ["Yes, very", "Only for geniuses", "No, it's designed to be readable", "Only on Mondays"],
        correctIndex: 2,
        explanation: "Python was designed to be clear and easy to read, making it great for beginners."
      },
      {
        id: 'q1-9',
        question: "What is a 'Function'?",
        options: ["A party", "A reusable command", "A computer virus", "A type of snake"],
        correctIndex: 1,
        explanation: "A function is a block of code that performs a specific task when called."
      },
      {
        id: 'q1-10',
        question: "What is a SyntaxError?",
        options: ["A computer virus", "Breaking a language rule", "A hardware failure", "A power cut"],
        correctIndex: 1,
        explanation: "A SyntaxError happens when you don't follow Python's writing rules."
      }
    ]
  },
  {
    levelId: 'Level 2: Core Basics',
    levelName: 'Makola Market Math',
    questions: [
      {
        id: 'q2-1',
        question: "What is a Variable?",
        options: ["A type of math", "A storage container for data", "A computer error", "A keyboard key"],
        correctIndex: 1,
        explanation: "Variables store information that we can use and change later."
      },
      {
        id: 'q2-2',
        question: "Which symbol do we use to 'assign' a value to a variable?",
        options: ["==", "=>", "=", ":="],
        correctIndex: 2,
        explanation: "The single equals sign (=) is used for assignment."
      }
    ]
  }
];

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Completed your first lesson!', icon: '👣' },
  { id: 'momo-pro', name: 'MoMo Pro', description: 'Mastered variables and math!', icon: '💰' },
  { id: 'logic-king', name: 'Logic King/Queen', description: 'Conquered conditionals!', icon: '🧠' },
  { id: 'tech-royalty', name: 'Tech Royalty', description: 'Unlocked the Tech Kingdom!', icon: '👑' },
];