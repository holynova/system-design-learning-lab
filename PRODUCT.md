# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vite + React + JavaScript, chosen for a static GitHub Pages build with npm scripts and no server dependency.

## Users

正在学习系统设计面试的开发者。他们会阅读《系统设计面试：内幕指南》，希望用更短的实验和复述练习理解架构取舍。

## Product Purpose

ARC / LAB 是原书的学习伴侣。它把每章的核心路径变成可以暂停、逐步运行和故障观察的微型实验，并用思维导图和练习帮助学习者从“看懂图”走到“讲清原因”。成功意味着用户能在同一页面选择一章、运行一条请求路径、解释一个结果，并知道下一步复习什么。

## Positioning

产品的核心机制是“先预测，再运行，再解释”：实验始终显示事件、状态与原因，避免用纯动画或术语卡替代系统推理。

## Operating Context

学习者在桌面浏览器中读章节、操作实验；手机端用于复习、查看导图和逐步浏览事件。原书是主要内容来源，网站提供原创示意、样例数据和训练反馈。

## Capabilities and Constraints

- 首版覆盖两卷 28 章的索引、目标、思维导图、实验入口和练习。
- 每章有可追踪的组件路径；限流器与一致性哈希提供完整参数实验，其余章节提供可运行的基础路径与章节专属提示。
- 所有数据均为教学模拟，参数和结论标明假设；不连接真实支付、邮件、交易或抓取服务。
- 站点为静态资源，发布到 GitHub Pages 的 `master:/docs`；不依赖登录、后端或数据库。
- 接入 Umami Cloud website id `e01c9f78-4607-4e60-b01c-77c8190b12b4`，只发送低敏感的学习动作事件。

## Evidence on Hand

- `/Users/sym/code/system-design-learning-plan/handoff.md`
- 28 份章节规划与公开 GitBook 目录/Markdown 页面。
- 尚无真实用户反馈、品牌资产或性能基准；示意内容需要保持“教学模型”标记。

## Product Principles

1. 让状态变化可见，先于装饰性动画。
2. 让每次架构选择都有触发问题与代价。
3. 让用户可以从阅读切到操作，再回到复述。
4. 让假设、范围和不确定性被明确标记。
5. 让关键操作在桌面、手机和键盘上都可完成。
