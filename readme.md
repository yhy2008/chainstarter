# ChainStarter

## 配置
1. 在 ```config.js``` 中填写账户助记词密码和 provider 地址
2. 执行 
 ```
 node ethereum/compile.js
 ```
3. 执行
```
node ethereum/deploy.js
```
4. 执行完成后复制命令行中的合约地址到 ```config.js```
5. 执行
```
npm run dev
```