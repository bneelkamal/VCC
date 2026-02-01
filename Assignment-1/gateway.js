const http = require('http');

const os = require('os');



const VM2_IP = '10.0.2.4'; 

let totalRequests = 0;



// --- Helper Functions ---

function getRAM() {

    const free = os.freemem();

    const total = os.totalmem();

    return Math.round(((total - free) / total) * 100);

}



function getStats() {

    const s = os.uptime();

    const h = Math.floor(s / 3600);

    const m = Math.floor((s % 3600) / 60);

    

    // Health Logic

    const ram = getRAM();

    let health = "🟢 Excellent";

    if (ram > 50) health = "🟡 Moderate";

    if (ram > 80) health = "🔴 Critical";



    return {

        ram: ram + "%",

        uptime: `${h}h ${m}m`,

        load: os.loadavg()[0].toFixed(2),

        os: os.type() + " " + os.release(), 

        health: health

    };

}



const server = http.createServer((req, res) => {

    if (req.url === '/') {

        totalRequests++;



        // 1. Get VM 1 Stats

        const stats = getStats();

        const vm1 = {

            vm_name: "User-Gateway-VM",

            server_name: "Beast (VM 1)",

            ip: "10.0.2.15",

            ...stats,

            desc: "<strong>API Gateway:</strong> Securely routes external traffic."

        };



        // 2. Fetch VM 2 Data

        http.get({ host: VM2_IP, port: 4000 }, (backendRes) => {

            let body = '';

            backendRes.on('data', chunk => body += chunk);

            

            backendRes.on('end', () => {

                const vm2 = JSON.parse(body);

                vm2.desc = "<strong>Business Logic:</strong> Processes data in isolation.";



                const html = `

                <!DOCTYPE html>

                <html lang="en">

                <head>

                    <meta charset="UTF-8">

                    <title>${vm2.name} - System Monitor</title>

                    <meta http-equiv="refresh" content="3">

                    <style>

                        body { background: #f0f2f5; color: #333; font-family: 'Segoe UI', sans-serif; text-align: center; padding: 30px; }

                        

                        /* ANIMATIONS */

                        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                        .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; animation: pulse 2s infinite; }

                        

                        /* LAYOUT */

                        .header { margin-bottom: 30px; }

                        .pill { background: white; padding: 8px 20px; border-radius: 50px; border: 1px solid #ddd; display: inline-block; margin: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

                        .blue-txt { color: #0d6efd; font-weight: bold; }



                        /* ASSIGNMENT TASK BOX */

                        .task-box {

                            background: #e9ecef;

                            color: #495057;

                            display: inline-block;

                            padding: 10px 30px;

                            border-radius: 8px;

                            margin-top: 15px;

                            font-size: 0.95rem;

                            border: 1px solid #ced4da;

                            max-width: 800px;

                        }



                        .container { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 30px; }



                        /* CARDS */

                        .card { width: 420px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; text-align: left; transition: transform 0.2s; border: 1px solid #e0e0e0; }

                        .card:hover { transform: translateY(-5px); }



                        .card-head { padding: 15px 25px; color: white; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }

                        .bg-1 { background: linear-gradient(135deg, #0d6efd, #0043a8); }

                        .bg-2 { background: linear-gradient(135deg, #6610f2, #4d00ba); }



                        .card-body { padding: 25px; }

                        .server-name { font-size: 2rem; font-weight: 800; color: #212529; margin-bottom: 5px; }

                        .desc { font-size: 0.9rem; color: #666; margin-bottom: 20px; background: #f8f9fa; padding: 10px; border-radius: 6px; border-left: 4px solid #ccc; }



                        /* STAT ROWS */

                        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }

                        .label { color: #888; font-weight: 600; font-size: 0.85rem; }

                        .val { font-family: monospace; font-weight: bold; color: #333; font-size: 1rem; }

                        

                        .os-info { font-size: 0.75rem; color: #999; text-align: right; margin-top: 10px; font-family: monospace; }

                    </style>

                </head>

                <body>

                    <h1>Microservices System Monitor</h1>

                    

                    <div class="header">

                        <div class="pill">Student: <strong>${vm2.name}</strong></div>

                        <div class="pill">Roll: <strong>${vm2.roll_no}</strong></div>

                        <div class="pill">Course: <span class="blue-txt">${vm2.course}</span></div>

                        <br>

                        

                        <div class="task-box">

                            <strong>Task:</strong> ${vm2.assignment}

                        </div>

                        <br>



                        <div class="pill" style="background:#212529; color:#4ade80; margin-top:15px;">

                            <span class="dot" style="background:#4ade80"></span> LIVE TRAFFIC: ${totalRequests} REQUESTS

                        </div>

                    </div>



                    <div class="container">

                        <div class="card">

                            <div class="card-head bg-1">🖥️ ${vm1.vm_name}</div>

                            <div class="card-body">

                                <div class="server-name">${vm1.server_name}</div>

                                <div class="desc">${vm1.desc}</div>

                                

                                <div class="row"><span class="label">IP ADDRESS</span> <span class="val">${vm1.ip}</span></div>

                                <div class="row"><span class="label">CPU LOAD (1m)</span> <span class="val">${vm1.load}</span></div>

                                <div class="row"><span class="label">MEMORY USAGE</span> <span class="val">${vm1.ram}</span></div>

                                <div class="row"><span class="label">SYSTEM UPTIME</span> <span class="val">${vm1.uptime}</span></div>

                                <div class="row"><span class="label">HEALTH</span> <span class="val">${vm1.health}</span></div>



                                <div class="os-info">KERNEL: ${vm1.os}</div>

                            </div>

                        </div>



                        <div class="card">

                            <div class="card-head bg-2">⚙️ ${vm2.vm_name}</div>

                            <div class="card-body">

                                <div class="server-name">${vm2.server_name}</div>

                                <div class="desc">${vm2.desc}</div>

                                

                                <div class="row"><span class="label">IP ADDRESS</span> <span class="val">${vm2.ip_address}</span></div>

                                <div class="row"><span class="label">CPU LOAD (1m)</span> <span class="val">${vm2.cpu_load}</span></div>

                                <div class="row"><span class="label">MEMORY USAGE</span> <span class="val">${vm2.memory_usage}</span></div>

                                <div class="row"><span class="label">SYSTEM UPTIME</span> <span class="val">${vm2.uptime}</span></div>

                                <div class="row"><span class="label">HEALTH</span> <span class="val">${vm2.health}</span></div>



                                <div class="os-info">KERNEL: ${vm2.os_type}</div>

                            </div>

                        </div>

                    </div>

                </body>

                </html>

                `;

                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

                res.end(html);

            });

        });

    }

});



server.listen(3000, () => console.log("Final Monitor Running..."));
