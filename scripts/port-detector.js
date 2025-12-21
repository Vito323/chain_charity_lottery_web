import net from 'net';

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

async function findAvailablePort() {
  const ports = [3010, 3020, 3030, 3040, 3050];
  
  for (const port of ports) {
    if (await isPortAvailable(port)) {
      console.log(port);
      return;
    }
  }
  
  // 如果所有端口都被占用，使用随机端口
  console.log(0);
}

findAvailablePort();
