# ChainStarter

## 配置
1. 复制一份 ```config.js.example``` 文件，命名为 ```config.js```
2. 在 ```config.js``` 中填写账户助记词密码和 provider 地址
3. 执行 
 ```
 node ethereum/compile.js
 ```
4. 执行
```
node ethereum/deploy.js
```
5. 执行完成后复制命令行中的合约地址到 ```config.js```
6. 执行
```
npm run dev
```