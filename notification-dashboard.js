// Real-time notification dashboard để xem thông báo thanh toán

const express = require('express');
const fs = require('fs');
const path = require('path');

// Tạo mini web dashboard để xem thông báo
function createNotificationDashboard() {
  const app = express();
  const PORT = 3001;
  
  // Static files
  app.use(express.static('public'));
  
  // API lấy transaction logs
  app.get('/api/notifications', (req, res) => {
    try {
      const logFile = path.join(__dirname, 'transaction-logs.txt');
      
      if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, 'utf8')
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (e) {
              return null;
            }
          })
          .filter(log => log !== null)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 50); // Lấy 50 logs gần nhất
        
        res.json({ success: true, data: logs });
      } else {
        res.json({ success: true, data: [] });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // HTML dashboard
  app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VietQR Notification Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
            }
            .header h1 {
                color: #333;
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .status {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            .status-item {
                text-align: center;
            }
            .status-value {
                font-size: 2em;
                font-weight: bold;
                color: #28a745;
            }
            .status-label {
                color: #666;
                font-size: 0.9em;
            }
            .notifications {
                margin-top: 20px;
            }
            .notification-item {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }
            .notification-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }
            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .amount {
                font-size: 1.5em;
                font-weight: bold;
                color: #28a745;
            }
            .time {
                color: #666;
                font-size: 0.9em;
            }
            .transaction-id {
                font-family: monospace;
                background: #f8f9fa;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.9em;
            }
            .content {
                margin: 10px 0;
                color: #333;
            }
            .details {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: #666;
            }
            .refresh-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #007bff;
                color: white;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .refresh-btn:hover {
                transform: scale(1.1);
            }
            .empty-state {
                text-align: center;
                padding: 50px;
                color: #666;
            }
            .loading {
                text-align: center;
                padding: 20px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 VietQR Payment Notifications</h1>
                <p>Real-time dashboard for payment notifications</p>
            </div>
            
            <div class="status">
                <div class="status-item">
                    <div class="status-value" id="totalNotifications">0</div>
                    <div class="status-label">Total Notifications</div>
                </div>
                <div class="status-item">
                    <div class="status-value" id="totalAmount">0</div>
                    <div class="status-label">Total Amount (VNĐ)</div>
                </div>
                <div class="status-item">
                    <div class="status-value" id="todayCount">0</div>
                    <div class="status-label">Today's Transactions</div>
                </div>
            </div>
            
            <div class="notifications" id="notifications">
                <div class="loading">📡 Loading notifications...</div>
            </div>
        </div>
        
        <button class="refresh-btn" onclick="loadNotifications()" title="Refresh">🔄</button>
        
        <script>
            async function loadNotifications() {
                try {
                    const response = await fetch('/api/notifications');
                    const result = await response.json();
                    
                    if (result.success) {
                        displayNotifications(result.data);
                        updateStats(result.data);
                    } else {
                        document.getElementById('notifications').innerHTML = 
                            '<div class="empty-state">❌ Error loading notifications</div>';
                    }
                } catch (error) {
                    document.getElementById('notifications').innerHTML = 
                        '<div class="empty-state">❌ Connection error</div>';
                }
            }
            
            function displayNotifications(notifications) {
                const container = document.getElementById('notifications');
                
                if (notifications.length === 0) {
                    container.innerHTML = '<div class="empty-state">📭 No notifications yet</div>';
                    return;
                }
                
                container.innerHTML = notifications.map(notif => \`
                    <div class="notification-item">
                        <div class="notification-header">
                            <div class="amount">\${Number(notif.amount).toLocaleString('vi-VN')} VNĐ</div>
                            <div class="time">\${new Date(notif.timestamp).toLocaleString('vi-VN')}</div>
                        </div>
                        <div class="content">\${notif.content}</div>
                        <div class="transaction-id">ID: \${notif.transactionId}</div>
                        <div class="details">
                            <span>Account: \${notif.bankAccount}</span>
                            <span>Ref: \${notif.refId}</span>
                            <span>Order: \${notif.orderId || 'N/A'}</span>
                        </div>
                    </div>
                \`).join('');
            }
            
            function updateStats(notifications) {
                const total = notifications.length;
                const totalAmount = notifications.reduce((sum, n) => sum + Number(n.amount), 0);
                const today = new Date().toDateString();
                const todayCount = notifications.filter(n => 
                    new Date(n.timestamp).toDateString() === today
                ).length;
                
                document.getElementById('totalNotifications').textContent = total;
                document.getElementById('totalAmount').textContent = totalAmount.toLocaleString('vi-VN');
                document.getElementById('todayCount').textContent = todayCount;
            }
            
            // Load on page start
            loadNotifications();
            
            // Auto refresh every 5 seconds
            setInterval(loadNotifications, 5000);
        </script>
    </body>
    </html>
    `);
  });
  
  app.listen(PORT, () => {
    console.log(`🎯 Notification Dashboard: http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  createNotificationDashboard();
}

module.exports = { createNotificationDashboard };
