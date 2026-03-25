export interface ModuleQuestion {
  q: string;
  options: string[];
  correct: number;
}

export const moduleQuestions: Record<string, ModuleQuestion[]> = {
  "c1": [
    { q: "What is the most common indicator of a phishing email?", options: ["Suspicious sender address", "Proper grammar", "Official company logo", "Correct timing"], correct: 0 },
    { q: "Which URL is most likely a phishing attempt?", options: ["google.com", "google-secure.com", "mail.google.com", "accounts.google.com"], correct: 1 },
    { q: "What should you do if you receive a suspicious email?", options: ["Click the link to verify", "Reply asking for clarification", "Report it to IT security", "Forward to colleagues"], correct: 2 }
  ],
  "c2": [
    { q: "What is the primary function of a firewall?", options: ["Speed up internet", "Block unauthorized access", "Store passwords", "Encrypt files"], correct: 1 },
    { q: "Which type of firewall examines data packets?", options: ["Packet-filtering", "Proxy", "VPN-only", "Application-level"], correct: 0 },
    { q: "What port does HTTPS typically use?", options: ["80", "443", "8080", "21"], correct: 1 }
  ],
  "c3": [
    { q: "What is SQL injection?", options: ["A network attack", "Malicious SQL code insertion", "Database backup", "Server overload"], correct: 1 },
    { q: "Which method helps prevent SQL injection?", options: ["Using admin credentials", "Parameterized queries", "Disabling errors", "Faster queries"], correct: 1 },
    { q: "What is input validation?", options: ["Checking user speed", "Sanitizing user input", "Logging actions", "Caching data"], correct: 1 }
  ],
  "c4": [
    { q: "What is malware?", options: ["Valid software", "Malicious software", "Network protocol", "Hardware component"], correct: 1 },
    { q: "What is a sandbox in malware analysis?", options: ["Physical container", "Isolated test environment", "Network router", "Storage device"], correct: 1 },
    { q: "Which is a sign of possible malware?", options: ["System updates", "Unexpected pop-ups", "Regular backups", "Normal startup"], correct: 1 }
  ],
  "c5": [
    { q: "What is network sniffing?", options: ["Packet filtering", "Capturing network traffic", "Encrypting data", "Blocking connections"], correct: 1 },
    { q: "Which tool is commonly used for packet sniffing?", options: ["Microsoft Word", "Wireshark", "Excel", "PowerPoint"], correct: 1 },
    { q: "What is a packet capture?", options: ["Email recording", "Capturing data packets", "Firewall rule", "User login"], correct: 1 }
  ],
  "c6": [
    { q: "What is Zero Trust security?", options: ["Trust all users", "Never trust, always verify", "Disable firewalls", "Allow all traffic"], correct: 1 },
    { q: "Zero Trust requires verification:", options: ["Once at login", "Continuously", "Never", "Only on weekends"], correct: 1 },
    { q: "What principle does Zero Trust follow?", options: ["Implicit trust", "Least privilege", "Open access", "Default allow"], correct: 1 }
  ],
  "p1": [
    { q: "Which is NOT a primitive data type in JavaScript?", options: ["String", "Number", "Array", "Boolean"], correct: 2 },
    { q: "What does 'const' declare?", options: ["A mutable variable", "An immutable variable", "A function", "A loop"], correct: 1 },
    { q: "What is the result of typeof null?", options: ["null", "undefined", "object", "string"], correct: 2 }
  ],
  "p2": [
    { q: "Which sorting algorithm has O(n log n) average complexity?", options: ["Bubble Sort", "Quick Sort", "Linear Search", "Insertion into array"], correct: 1 },
    { q: "What does the sort() method default to?", options: ["Numeric order", "Unicode order", "Random order", "Reverse order"], correct: 1 },
    { q: "Which method creates a new sorted array?", options: ["sort()", "sorted()", "Both sort() and sorted()", "Neither"], correct: 0 }
  ],
  "p3": [
    { q: "What is required for a recursive function?", options: ["A loop", "A base case", "An array", "A global variable"], correct: 1 },
    { q: "What causes infinite recursion?", options: ["No return statement", "Missing base case", "Too many parameters", "Small input"], correct: 1 },
    { q: "What is the call stack?", options: ["A data structure for function calls", "A display device", "A network protocol", "A storage method"], correct: 0 }
  ],
  "p4": [
    { q: "What does API stand for?", options: ["Application Programming Interface", "Automatic Program Interaction", "Applied Process Integration", "Array Programming Item"], correct: 0 },
    { q: "What HTTP method is used to retrieve data?", options: ["POST", "GET", "PUT", "DELETE"], correct: 1 },
    { q: "What is a JSON?", options: ["A programming language", "Data format", "An operating system", "A database"], correct: 1 }
  ],
  "p5": [
    { q: "What does 'asynchronous' mean?", options: ["Sequential execution", "Non-blocking execution", "No execution", "Faster execution"], correct: 1 },
    { q: "Which is used to handle async results?", options: ["try/catch only", "callbacks, promises, async/await", "while loops", "goto statements"], correct: 1 },
    { q: "What is a Promise in JavaScript?", options: ["A guarantee", "Represents future value", "A loop type", "A variable"], correct: 1 }
  ],
  "p6": [
    { q: "What is the Singleton pattern?", options: ["Creates many objects", "One instance only", "Deletes objects", "Copies objects"], correct: 1 },
    { q: "What does the Observer pattern do?", options: ["Deletes observers", "Notifies changes to subscribers", "Hides data", "Encrypts code"], correct: 1 },
    { q: "What is Dependency Injection?", options: ["Deleting dependencies", "Providing dependencies externally", "Hardcoding values", "Ignoring errors"], correct: 1 }
  ],
  "n1": [
    { q: "How many layers are in the OSI model?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Which layer handles routing?", options: ["Data Link", "Network", "Transport", "Session"], correct: 1 },
    { q: "What layer is TCP at?", options: ["Layer 3", "Layer 4", "Layer 5", "Layer 6"], correct: 1 }
  ],
  "n2": [
    { q: "What does subnet mask determine?", options: ["IP address", "Network vs host portion", "MAC address", "Port number"], correct: 1 },
    { q: "What is a /24 subnet mask?", options: ["255.255.0.0", "255.255.255.0", "255.255.255.255", "255.0.0.0"], correct: 1 },
    { q: "How many usable hosts in a /30?", options: ["4", "2", "6", "8"], correct: 1 }
  ],
  "n3": [
    { q: "Which protocol is connectionless?", options: ["TCP", "UDP", "Both", "Neither"], correct: 1 },
    { q: "Which is faster?", options: ["TCP", "UDP", "Both equal", "Depends on size"], correct: 1 },
    { q: "Which guarantees delivery?", options: ["UDP", "TCP", "Neither", "Both"], correct: 1 }
  ],
  "n4": [
    { q: "What is a default gateway?", options: ["Firewall", "Network exit point", "DNS server", "DHCP server"], correct: 1 },
    { q: "What does DHCP do?", options: ["Transfers files", "Assigns IP addresses", "Encrypts traffic", "Monitors network"], correct: 1 },
    { q: "What is NAT?", options: ["Network Address Translation", "New Technology", "Network Analysis Tool", "Node Access Table"], correct: 0 }
  ],
  "n5": [
    { q: "What protocol is BGP?", options: ["Link-state", "Path vector", "Distance-vector", "Hybrid"], correct: 1 },
    { q: "What is a BGP neighbor called?", options: ["Friend", "Peer", "Server", "Client"], correct: 1 },
    { q: "What is BGP used for?", options: ["Local networks", "Border Gateway routing", "Wireless connections", "Email routing"], correct: 1 }
  ],
  "h1": [
    { q: "What is the CPU?", options: ["Memory unit", "Processing unit", "Storage unit", "Network unit"], correct: 1 },
    { q: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Run Application Memory", "Remote Access Module"], correct: 1 },
    { q: "What is the GPU?", options: ["General Processing Unit", "Graphics Processing Unit", "Global Processing Unit", "Graphical Power Unit"], correct: 1 }
  ],
  "h2": [
    { q: "What connects CPU to motherboard?", options: ["SATA cable", "PCIe slot", "Power connector", "USB port"], correct: 1 },
    { q: "What drives store data long-term?", options: ["RAM", "SSD/HDD", "CPU", "GPU"], correct: 1 },
    { q: "What provides power to components?", options: ["Motherboard", "Power Supply", "CPU cooler", "Case fan"], correct: 1 }
  ],
  "h3": [
    { q: "What is RAM speed measured in?", options: ["Volts", "MHz or GB/s", "Watts", "Cores"], correct: 1 },
    { q: "What is XMP in RAM?", options: ["Memory profile", "Extreme Memory Profile", "Extended Module Protocol", "Execution Mode Power"], correct: 1 },
    { q: "What happens when RAM is overclocked?", options: ["It slows down", "It runs faster", "It turns off", "It deletes data"], correct: 1 }
  ],
  "h4": [
    { q: "What is thermal paste used for?", options: ["Electrical conduction", "Heat transfer", "Glue components", "Prevent static"], correct: 1 },
    { q: "How much thermal paste should be used?", options: ["Pea-sized amount", "Full coverage", "None", "Thin layer only"], correct: 0 },
    { q: "What happens without thermal paste?", options: ["Better cooling", "CPU overheats", "No change", "Faster performance"], correct: 1 }
  ],
  "c7": [
    { q: "What does SIEM stand for?", options: ["Secure Identity Event Management", "Security Information and Event Management", "System Integrity and Endpoint Monitoring", "Security Interface Event Module"], correct: 1 },
    { q: "What is the first step in alert triage?", options: ["Ignore low severity", "Validate alert context and source", "Shut down the server", "Notify all users"], correct: 1 },
    { q: "A high-fidelity SIEM alert usually means:", options: ["Likely false positive", "Likely actionable signal", "Network is down", "Logs are missing"], correct: 1 }
  ],
  "c8": [
    { q: "What is the main goal of incident containment?", options: ["Delete all logs", "Stop spread and limit damage", "Turn off antivirus", "Reinstall OS immediately"], correct: 1 },
    { q: "Which phase comes after containment?", options: ["Eradication", "Preparation", "Identification", "Escalation"], correct: 0 },
    { q: "Why is an incident playbook useful?", options: ["Avoid documentation", "Standardize response actions", "Bypass approvals", "Delay notifications"], correct: 1 }
  ],
  "c9": [
    { q: "What principle should IAM policies follow?", options: ["Maximum access", "Least privilege", "Temporary admin by default", "Shared root account"], correct: 1 },
    { q: "Which control best protects cloud admin accounts?", options: ["No password expiry", "MFA enforcement", "Public access keys", "Single shared login"], correct: 1 },
    { q: "What is risky in cloud IAM?", options: ["Role-based access", "Long-lived unused credentials", "Audit logging enabled", "Scoped service roles"], correct: 1 }
  ],
  "p7": [
    { q: "What problem does state management solve?", options: ["Compiling code", "Coordinating UI data flow", "Generating APIs", "Encrypting traffic"], correct: 1 },
    { q: "A derived state should be:", options: ["Stored twice everywhere", "Computed from source state", "Fetched every render", "Hard-coded in components"], correct: 1 },
    { q: "When should global state be used?", options: ["For every variable", "For data shared across distant components", "Only for styles", "Never"], correct: 1 }
  ],
  "p8": [
    { q: "Why use TypeScript interfaces?", options: ["To style components", "To define data shapes", "To replace runtime", "To minify bundles"], correct: 1 },
    { q: "What does strictNullChecks help prevent?", options: ["Slow builds", "Null/undefined runtime errors", "Large arrays", "Infinite loops"], correct: 1 },
    { q: "Best way to model fixed options in TS?", options: ["any", "union literal types", "unknown[]", "string[] only"], correct: 1 }
  ],
  "p9": [
    { q: "What is memoization used for?", options: ["Persisting to DB", "Caching expensive computations", "Tree shaking", "Compiling faster"], correct: 1 },
    { q: "A common frontend bottleneck is:", options: ["Unused comments", "Unnecessary re-renders", "Long variable names", "Short functions"], correct: 1 },
    { q: "Which metric reflects visual stability?", options: ["CLS", "FPS", "CPU usage", "Heap size"], correct: 0 }
  ],
  "n6": [
    { q: "What is a VLAN used for?", options: ["Speeding DNS", "Logical network segmentation", "Replacing routers", "Encrypting packets"], correct: 1 },
    { q: "Inter-VLAN communication requires:", options: ["Layer 2 switch only", "Layer 3 routing", "No gateway", "Only DHCP"], correct: 1 },
    { q: "Main security benefit of VLANs is:", options: ["Broadcast containment", "Higher CPU speed", "Faster disks", "No firewalls needed"], correct: 0 }
  ],
  "n7": [
    { q: "A site-to-site VPN primarily connects:", options: ["Single user to internet", "Two private networks securely", "Two browsers", "Only Wi-Fi clients"], correct: 1 },
    { q: "What protocol family is common for secure tunnels?", options: ["IPsec", "FTP", "SMTP", "SNMP"], correct: 0 },
    { q: "If VPN tunnel is up but traffic fails, first check:", options: ["Wallpaper settings", "Route and ACL configuration", "Keyboard layout", "Browser cache"], correct: 1 }
  ],
  "n8": [
    { q: "What is a load balancer's core job?", options: ["Encrypt local files", "Distribute traffic across servers", "Assign static IPs", "Replace DNS entirely"], correct: 1 },
    { q: "Health checks are used to:", options: ["Increase fan speed", "Detect unhealthy backends", "Block all traffic", "Reset TLS certs"], correct: 1 },
    { q: "Round-robin balancing means:", options: ["Always one server", "Requests rotate among servers", "Random DNS records", "Only backup node used"], correct: 1 }
  ],
  "h5": [
    { q: "What is a key sign of PSU instability?", options: ["Frequent random shutdowns", "Brighter monitor", "Faster boot", "Lower noise always"], correct: 0 },
    { q: "80 PLUS certification indicates:", options: ["CPU compatibility", "Power efficiency tier", "RAM latency", "Disk lifespan"], correct: 1 },
    { q: "Using an undersized PSU can cause:", options: ["Better thermals", "System crashes under load", "More USB ports", "Silent fans"], correct: 1 }
  ],
  "h6": [
    { q: "RAID 1 provides:", options: ["Striping without redundancy", "Mirroring for redundancy", "No redundancy", "Parity across 3 disks only"], correct: 1 },
    { q: "RAID 0 is best for:", options: ["Maximum redundancy", "Maximum performance with risk", "Cold backup", "Long-term archival"], correct: 1 },
    { q: "What should you still do with RAID?", options: ["Skip backups", "Maintain regular backups", "Disable monitoring", "Avoid SMART checks"], correct: 1 }
  ],
  "h7": [
    { q: "What does BIOS/UEFI update often improve?", options: ["Case color", "Hardware compatibility and stability", "Internet speed", "App icons"], correct: 1 },
    { q: "Before changing BIOS settings, you should:", options: ["Disable cooling", "Document current settings", "Unplug storage", "Clear all profiles"], correct: 1 },
    { q: "A safe BIOS tuning approach is:", options: ["Change many options at once", "Incremental changes with testing", "Max every voltage", "Disable thermal limits"], correct: 1 }
  ]
};
