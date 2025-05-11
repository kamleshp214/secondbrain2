import { db, Subject, Topic } from './schema';

// Initialize the database with seed data if it's empty
export async function initializeDB() {
  const subjectCount = await db.subjects.count();

  // Only seed if the database is empty
  if (subjectCount === 0) {
    console.log("Initializing database with seed data...");

    // Generate seed data for subjects
    const subjects: Subject[] = [
      {
        id: "cs-601",
        name: "Machine Learning (CS-601)",
        examDate: new Date("2025-06-05")
      },
      {
        id: "cs-602",
        name: "Computer Network (CS-602)",
        examDate: new Date("2025-06-11")
      },
      {
        id: "cs-603",
        name: "Compiler Design (CS-603)",
        examDate: new Date("2025-06-16")
      },
      {
        id: "cs-604",
        name: "Project Management (CS-604)",
        examDate: new Date("2025-06-20")
      }
    ];

    // Generate seed data for topics
    const topics: Topic[] = [
      // Machine Learning (CS-601) topics
      {
        id: "cs-601-1",
        subjectId: "cs-601",
        name: "UNIT-1",
        description: "Introduction to machine learning, scope and limitations, regression, probability, statistics and linear algebra for machine learning, convex optimization, data visualization, hypothesis function and testing, data distributions, data preprocessing, data augmentation, normalizing data sets, machine learning models, supervised and unsupervised learning.",
        completed: false
      },
      {
        id: "cs-601-2",
        subjectId: "cs-601",
        name: "UNIT-2",
        description: "Linearity vs non-linearity, activation functions like sigmoid, ReLU etc., weights and bias, loss function, gradient descent, multilayer network, backpropagation, weight initialization, training, testing, unstable gradient problem, auto encoders, batch normalization, dropout, L1 and L2 regularization, momentum, tuning hyper parameters.",
        completed: false
      },
      {
        id: "cs-601-3",
        subjectId: "cs-601",
        name: "UNIT-3",
        description: "Convolutional neural network, flattening, subsampling, padding, stride, convolution layer, pooling layer, loss layer, dense layer, 1×1 convolution, inception network, input channels, transfer learning, one shot learning, dimension reductions, implementation of CNN like TensorFlow, Keras etc.",
        completed: false
      },
      {
        id: "cs-601-4",
        subjectId: "cs-601",
        name: "UNIT-4",
        description: "Recurrent neural network, Long short-term memory, gated recurrent unit, translation, beam search and width, BLEU score, attention model, Reinforcement Learning, RL-framework, MDP, Bellman equations, Value Iteration and Policy Iteration, Actor-critic model, Q-learning, SARSA.",
        completed: false
      },
      {
        id: "cs-601-5",
        subjectId: "cs-601",
        name: "UNIT-5",
        description: "Support Vector Machines, Bayesian learning, application of machine learning in computer vision, speech processing, natural language processing etc., Case Study: ImageNet Competition.",
        completed: false
      },

      // Computer Network (CS-602) topics
      {
        id: "cs-602-1",
        subjectId: "cs-602",
        name: "UNIT-1",
        description: "Computer Network: Definitions, goals, components, Architecture, Classifications & Types, Layered Architecture: Protocol hierarchy, Design Issues, Interfaces and Services, Connection Oriented & Connectionless Services, Service primitives, Design issues & its functionality, ISO/OSI Reference Model: Principle, Model, Descriptions of various layers and its comparison with TCP/IP, Principles of physical layer: Media, Bandwidth, Data rate and Modulations.",
        completed: false
      },
      {
        id: "cs-602-2",
        subjectId: "cs-602",
        name: "UNIT-2",
        description: "Data Link Layer: Need, Services Provided, Framing, Flow Control, Error control, Data Link Layer Protocol: Elementary & Sliding Window protocol: 1-bit, Go-Back-N, Selective Repeat, Hybrid ARQ, Protocol verification: Finite State Machine Models & Petri net models, ARP/RARP/GARP.",
        completed: false
      },
      {
        id: "cs-602-3",
        subjectId: "cs-602",
        name: "UNIT-3",
        description: "MAC Sub layer: MAC Addressing, Binary Exponential Back-off (BEB) Algorithm, Distributed Random Access Schemes/Contention Schemes: for Data Services (ALOHA and Slotted ALOHA), for Local-Area Networks (CSMA, CSMA/CD, CSMA/CA), Collision Free Protocols: Basic Bit Map, BRAP, Binary Count Down, MLMA Limited Contention Protocols: Adaptive Tree Walk, Performance Measuring Metrics, IEEE Standards 802 series & their variant.",
        completed: false
      },
      {
        id: "cs-602-4",
        subjectId: "cs-602",
        name: "UNIT-4",
        description: "Network Layer: Need, Services Provided, Design issues, Routing algorithms: Least Cost Routing algorithm, Dijkstra's algorithm, Bellman-Ford algorithm, Hierarchical Routing, Broadcast Routing, Multicast Routing, IP Addresses, Header format, Packet forwarding, Fragmentation and reassembly, ICMP, Comparative study of IPv4 & IPv6.",
        completed: false
      },
      {
        id: "cs-602-5",
        subjectId: "cs-602",
        name: "UNIT-5",
        description: "Transport Layer: Design Issues, UDP: Header Format, Per-Segment Checksum, Carrying Unicast/Multicast Real-Time Traffic, TCP: Connection Management, Reliability of Data Transfers, TCP Flow Control, TCP Congestion Control, TCP Header Format, TCP Timer Management, Application Layer: WWW and HTTP, FTP, SSH, Email (SMTP, MIME, IMAP), DNS, Network Management (SNMP).",
        completed: false
      },

      // Compiler Design (CS-603) topics
      {
        id: "cs-603-1",
        subjectId: "cs-603",
        name: "UNIT-1",
        description: "Introduction of Compiler, Major data Structure in compiler, types of Compiler, Front-end and Back-end of compiler, Compiler structure: analysis-synthesis model of compilation, various phases of a compiler, Lexical analysis: Input buffering, Specification & Recognition of Tokens, Design of a Lexical Analyzer Generator, LEX.",
        completed: false
      },
      {
        id: "cs-603-2",
        subjectId: "cs-603",
        name: "UNIT-2",
        description: "Syntax analysis: CFGs, Top down parsing, Brute force approach, recursive descent parsing, transformation on the grammars, predictive parsing, bottom up parsing, operator precedence parsing, LR parsers (SLR, LALR, LR), Parser generation, Syntax directed definitions: Construction of Syntax trees, Bottom up evaluation of S-attributed definition, L-attribute definition, Top down translation, Bottom Up evaluation of inherited attributes, Recursive Evaluation, Analysis of Syntax-Directed Definitions.",
        completed: false
      },
      {
        id: "cs-603-3",
        subjectId: "cs-603",
        name: "UNIT-3",
        description: "Type checking: type system, specification of simple type checker, equivalence of expression types, type conversion, overloading of functions and operations, polymorphic functions, Run time Environment: storage organization, Storage allocation strategies, parameter passing, dynamic storage allocation, Symbol table, Error Detection & Recovery, Ad-Hoc and Systematic Methods.",
        completed: false
      },
      {
        id: "cs-603-4",
        subjectId: "cs-603",
        name: "UNIT-4",
        description: "Intermediate code generation: Declarations, Assignment statements, Boolean expressions, Case statements, Back patching, Procedure calls, Code Generation: Issues in the design of code generator, Basic block and flow graphs, Register allocation and assignment, DAG representation of basic blocks, peephole optimization, generating code from DAG.",
        completed: false
      },
      {
        id: "cs-603-5",
        subjectId: "cs-603",
        name: "UNIT-5",
        description: "Introduction to Code optimization: sources of optimization of basic blocks, loops in flow graphs, dead code elimination, loop optimization, Introduction to global data flow analysis, Code Improving transformations, Data flow analysis of structure flow graph, Symbolic debugging of optimized code.",
        completed: false
      },

      // Project Management (CS-604) topics
      {
        id: "cs-604-1",
        subjectId: "cs-604",
        name: "UNIT-1",
        description: "Evolution of software economics, Improving software economics: reducing product size, software processes, team effectiveness, automation through software environments, Principles of modern software management.",
        completed: false
      },
      {
        id: "cs-604-2",
        subjectId: "cs-604",
        name: "UNIT-2",
        description: "Framework: Life cycle phases - inception, elaboration, construction and training phase, Artifacts of the process - the artifact sets, management artifacts, engineering artifacts, pragmatics artifacts, Model based software architectures, Workflows of the process, Checkpoints of the process.",
        completed: false
      },
      {
        id: "cs-604-3",
        subjectId: "cs-604",
        name: "UNIT-3",
        description: "Iterative process planning, Project organisations and responsibilities, Process automation, Project control And process instrumentation - core metrics, management indicators, life cycle expectations, Process discriminants.",
        completed: false
      }
    ];

    // Insert data into the database
    await db.transaction('rw', db.subjects, db.topics, async () => {
      await db.subjects.bulkAdd(subjects);
      await db.topics.bulkAdd(topics);
    });

    console.log("Database initialized successfully!");
  } else {
    console.log("Database already initialized.");
  }
}
