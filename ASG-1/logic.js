const http = require('http');

const os = require('os');



const server = http.createServer((req, res) => {

    

    // 1. Calculate RAM %

    const free = os.freemem();

    const total = os.totalmem();

    const ramUsage = Math.round(((total - free) / total) * 100);



    // 2. Calculate Uptime

    const uptime = os.uptime();

    const hrs = Math.floor(uptime / 3600);

    const mins = Math.floor((uptime % 3600) / 60);



    // 3. Determine Health Status

    let healthStatus = "🟢 Excellent";

    if (ramUsage > 50) healthStatus = "🟡 Moderate";

    if (ramUsage > 80) healthStatus = "🔴 Critical";



    const studentInfo = {

        name: "NEELKAMAL BADANA",

        roll_no: "M25AI2026",

        course: "Virtualization and Cloud Computing",

        assignment: "Assignment 1: Use VirtualBox to Create Multiple VMs, Connect These VMs, and Host One Microservice-Based Application",

        

        // --- NEW STATS ---

        vm_name: "Logic-Service-VM",

        server_name: "Beauty (VM 2)",

        ip_address: "10.0.2.4",

        memory_usage: `${ramUsage}%`,

        uptime: `${hrs}h ${mins}m`,

        cpu_load: os.loadavg()[0].toFixed(2), // 1-minute Load Avg

        os_type: os.type() + " " + os.release(), // e.g. Linux 5.4...

        health: healthStatus

    };



    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(studentInfo));

});



server.listen(4000, () => console.log("Logic Service (Enhanced) Running..."));
