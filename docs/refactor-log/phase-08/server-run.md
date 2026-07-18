# P08 服务运行记录

P08 没有启动新的 Node dev server、preview server 或浏览器实例；正式构建是有界命令，完成后没有持续进程。

clean install 前发现一棵阶段开始前已经存在、工作目录属于本仓库的开发进程树：

```text
10376 cmd
└─ 14908 npm run dev
   └─ 47064 cmd /c vite --config vite.config.mjs
      └─ 35516 node vite
         └─ 41356 dart-sass --embedded
```

该进程树锁住 `node_modules/sass-embedded-win32-x64/dart-sass/src`。确认命令行和父子关系后仅停止上述 PID；复查时进程均已退出，随后 clean install 成功。未由主线程另行启动持续服务。
