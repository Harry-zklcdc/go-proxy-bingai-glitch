var exec = require('child_process').exec;
const path = require('path');
const spawn = require('child_process').spawn;

var gpbProcess = null;
var cfztProcess = null;

function init() {
  exec('bash init.sh', function (err, stdout, stderr) {
    if (err) {
      console.log('Init | 初始化错误:' + err);
    } else {
      console.log('Init | 初始化成功!');
    }
  });
  keepalive();
  keep_cfzt_alive();
}

function keepalive() {
  exec('pgrep -laf go-proxy-bingai', function (err, stdout, stderr) {
    if (stdout.includes('./go-proxy-bingai')) {
      console.log('KeepAlive | Go-Proxy-Bingai 正在运行');
    } else {
      gpbProcess = spawn('./go-proxy-bingai', [], {
        cwd: path.resolve('.'),
        env: process.env,
      })
      console.log('KeepAlive | Go-Proxy-Bingai Pid: ' + gpbProcess.pid)

      gpbProcess.stdout.on('data', function(chunk) {
        console.log('Go-Proxy-Bingai | ' + chunk.toString())
      })

      gpbProcess.stderr.on('data', function(chunk) {
        console.log('Go-Proxy-Bingai | ' + chunk.toString())
      })
    }
  });
}

function keep_cfzt_alive() {
  if (!process.env.CF_ZERO_TRUST_TOKEN) {
    console.log('未设置 CF_ZERO_TRUST_TOKEN，跳过启动 Cloudflred！');
    return; 
  }
  exec('pgrep -laf cloudflared', function (err, stdout, stderr) {
    if (stdout.includes('./cloudflared tunnel')) {
      console.log('KeepAlive | Cloudflare Zero Trust Tunnel 正在运行');
    } else {
      cfztProcess = spawn('./cloudflared', ['tunnel', '--no-autoupdate', 'run', '--token', process.env.CF_ZERO_TRUST_TOKEN], {
        cwd: path.resolve('.'),
      })
      console.log('KeepAlive | Cloudflare Zero Trust Tunnel Pid: ' + cfztProcess.pid)
      // 监听成功
      cfztProcess.stdout.on('data', function(chunk) {
        console.log('CFZT | ' + chunk.toString())
      })
      // 监听失败
      cfztProcess.stderr.on('data', function(chunk) {
        console.log('CFZT | ' + chunk.toString())
      })
    }
  });
}

setInterval(keepalive, 9 * 1000);
setInterval(keep_cfzt_alive, 30 * 1000);


init();