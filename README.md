# PKU-Connector-Web
[![Build Status](https://img.shields.io/travis/HackAll-PKU/PKU-Connector-Web.svg)](https://travis-ci.org/HackAll-PKU/PKU-Connector-Web)
- PKU-Connector的Web端
- 2016数据库概论大作业
- 功能设计结合大作业要求，学习和借鉴新浪微博
- 基于WebStorm构建
- 依赖AngularJS
- 依赖jQuery
- [服务端](https://github.com/HackAll-PKU/PKU-Connector-Services)

## 目录结构
 - app/ 应用主目录
 	- images/ 图片资源
 	- scripts/ AngularJS应用脚本
 		- controllers/mainControllers.js AngularJS控制器
 		- services/services.js AngularJS服务
 		- app.js 应用根脚本
 	- styles/styles.css 样式表
 	- views/ 视图
 - dev-resource/ 设计资源、设计稿等
 - test/ 测试
 	- unit-tests/main_test.js 单元测试

## 系统功能
1. 用户管理
	1. 用户的注册、登录管理
	2. 修改自己的个人资料
	3. 允许用户上传自己的头像和个人资料背景图

2. 好友功能（关注和粉丝）
	1. 用户可以搜索和关注另一用户
	2. 查询某一用户的好友
	3. 显示用户*可能认识的人*，即两步以内的好友，并显示关系路径

3. 用户组（#话题#）功能
	1. 用户可以关注一些用户组（话题）
	2. 向用户组（话题）发表说说
	3. 获取该用户组的最新动态

4. 说说功能
	1. *发表*说说
	2. *查看*、*评论*和*赞*用户和用户组的说说
	2. 主页面每隔10秒查询好友和所关注用户组的说说更新，并更新和显示
	3. 用户可以在发表的说说中提及（@mention）自己的好友
	4. 用户可向某用户组（话题）发表说说
	5. 用户可以在说说中上传至多9张图片

## 分工
前端分工真的不好分。。。经常是一个人写样式另一个人写逻辑。。。
大致分工如下:
User相关:陈乐天
Talking相关:胡顺昕
Comment和Like相关:寇雨婷

## Made By 陈乐天，胡顺昕，寇雨婷