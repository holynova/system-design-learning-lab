# 系统设计实验册

从需求与原书重做，聚焦第一卷第 6、7、8 章：操作 KV 副本与确认门槛，拆解 Snowflake ID 并注入时钟故障，创建短码、制造冲突并追踪缓存跳转。每章包含知识地图、四道练习、误区讲解和本地学习笔记。所有请求均为教学模拟。

[在线学习](https://holynova.github.io/system-design-learning-lab/) · [GitHub 仓库](https://github.com/holynova/system-design-learning-lab) · [原书](https://learning-guide.gitbook.io/system-design-interview)

![有效内容截图](assets/screenshot.png)

<img src="assets/qr.png" width="164" alt="扫码打开学习网站">

`npm install` 后运行 `npm run dev`；`npm run build` 构建至 `docs/`，使用 `master:/docs` 发布。验证：`node scripts/verify.mjs`。

版本 1.0.0。旧版本保存在 Git 历史中。重建范围与模型边界见 [REBUILD.md](REBUILD.md)。
