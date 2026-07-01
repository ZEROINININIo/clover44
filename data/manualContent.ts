
export let manualHtmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Nova Labs Archive - Developer Guide</title>
<style>
    body { font-family: 'Microsoft YaHei', 'SimSun', sans-serif; line-height: 1.6; color: #333; }
    h1 { font-size: 24px; color: #111; border-bottom: 2px solid #000; padding-bottom: 10px; text-align: center; margin-bottom: 20px; }
    h2 { font-size: 18px; color: #b45309; margin-top: 30px; margin-bottom: 15px; border-left: 5px solid #b45309; padding-left: 10px; background-color: #fffbeb; padding: 5px 10px; }
    h3 { font-size: 16px; color: #4b5563; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 5px; font-weight: bold; }
    p { margin-bottom: 10px; }
    ul, ol { margin-bottom: 15px; padding-left: 20px; }
    li { margin-bottom: 5px; }
    code { background-color: #f3f4f6; padding: 2px 5px; border-radius: 3px; font-family: Consolas, monospace; color: #d97706; font-size: 0.9em; }
    pre { background-color: #f8fafc; border: 1px solid #e2e8f0; color: #334155; padding: 15px; border-radius: 5px; font-family: Consolas, monospace; white-space: pre-wrap; word-wrap: break-word; font-size: 0.9em; margin: 10px 0; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 0.95em; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background-color: #fef3c7; color: #92400e; font-weight: bold; }
    tr:nth-child(even) { background-color: #fcfcfc; }
    .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
    .center { text-align: center; }
</style>
</head>
<body>

<h1>Nova Labs Archive - 内容开发与维护手册</h1>
<p class="center"><strong>版本:</strong> TL.2.0.10-I &nbsp;|&nbsp; <strong>文档日期:</strong> 2026-05-11</p>

<p>欢迎来到 <strong>Nova Labs Archive</strong> 的后台文档。本手册旨在帮助第三方开发者或内容协作者快速理解项目结构，并进行剧情添加、角色更新及配置修改。</p>

<hr />

<h2>1. 核心目录结构</h2>
<p>本项目基于 React (TypeScript)。以下是与内容维护最相关的目录：</p>
<ul>
    <li><strong><code>src/data/</code></strong>: 静态数据核心仓库。所有文本、剧情、角色设定都在这里。
        <ul>
            <li><code>chapters.ts</code> & <code>chapter_files/</code>: <strong>主线</strong>剧情数据。</li>
            <li><code>sideStories.ts</code> & <code>side_story_files/</code>: <strong>支线</strong>剧情数据。</li>
            <li><code>characters.ts</code>: 主角团（人员档案）设定。</li>
            <li><code>sideCharacters.ts</code>: 支线角色/NPC 设定。</li>
            <li><code>lore.ts</code>: 数据库（世界观）条目。</li>
            <li><code>credits.ts</code>: 特别鸣谢名单。
        </ul>
    </li>
    <li><strong><code>src/components/</code></strong>: UI 组件。通常不需要修改，除非涉及视觉样式调整。</li>
    <li><strong><code>src/types.ts</code></strong>: TypeScript 类型定义。如果新增了数据字段，需在此更新接口。</li>
</ul>

<h2>2. 如何添加剧情章节</h2>

<h3>2.1 添加主线章节 (Main Story)</h3>
<ol>
    <li><strong>创建文件</strong>: 在 <code>src/data/chapter_files/</code> 下创建一个新文件，例如 <code>A006.ts</code>。</li>
    <li><strong>编写内容</strong>: 复制现有章节的结构。
<pre>
import { Chapter } from '../../types';

export const chapterA006: Chapter = {
  id: "story-chapter-id", // 唯一ID
  date: "档案记录: A-006", // 显示在卡片上的日期/编号
  status: 'published', // 'published' (解锁), 'locked' (锁定), 'corrupted' (故障风)
  translations: {
    'zh-CN': {
      title: "章节标题",
      summary: "卡片上显示的简短摘要。",
      content: \`这里是正文内容...
支持换行。
支持特殊标签。\`,
    },
    'zh-TW': { ... }
};
</pre>
    </li>
    <li><strong>注册章节</strong>: 打开 <code>src/data/chapters.ts</code>，导入新文件并将其添加到数组中。</li>
</ol>

<h3>2.2 添加支线章节 (Side Story)</h3>
<ol>
    <li><strong>创建文件</strong>: 在 <code>src/data/side_story_files/</code> 下创建文件。</li>
    <li><strong>编写内容</strong>: 结构同上。</li>
    <li><strong>注册章节</strong>: 打开 <code>src/data/sideStories.ts</code>。
        <ul>
            <li>找到对应的 <strong>Volume</strong> (例如 <code>VOL_DAILY</code> 是日常篇)。</li>
            <li>将新章节变量添加到该 Volume 的 <code>chapters</code> 数组中。
            <li><em>注意</em>: 如果需要创建新的 Volume，请参考 <code>sideStories.ts</code> 中的 <code>SideStoryVolume</code> 结构。</li>
        </ul>
    </li>
</ol>

<h2>3. 剧情文本特殊标签 (Rich Text Tags)</h2>
<p>为了增强阅读体验，阅读器支持以下自定义标签。直接在 <code>content</code> 字符串中使用即可。</p>

<table>
    <thead>
        <tr>
            <th width="25%">标签语法</th>
            <th width="20%">效果</th>
            <th>备注</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>[[DIVIDER]]</code></td>
            <td>分割线</td>
            <td>用于场景切换，显示一个带有 <code>///</code> 的分割符。</td>
        </tr>
        <tr>
            <td><code>[[IMAGE::url::caption]]</code></td>
            <td>插入图片</td>
            <td><code>url</code>: 图片链接, <code>caption</code>: 图片说明（显示在右下角）。</td>
        </tr>
        <tr>
            <td><code>[[DANGER::文本]]</code></td>
            <td>红色警报文本</td>
            <td>带有故障动画的红色粗体字，常用于系统警告。</td>
        </tr>
        <tr>
            <td><code>[[GREEN::文本]]</code></td>
            <td>绿色终端文本</td>
            <td>绿色等宽字体，用于显示系统日志或代码。</td>
        </tr>
        <tr>
            <td><code>[[BLUE::文本]]</code></td>
            <td>蓝色提示文本</td>
            <td>蓝色文本，常用于场景说明或旁白。</td>
        </tr>
        <tr>
            <td><code>[[VOID::文本]]</code></td>
            <td>紫色虚空文本</td>
            <td>紫色故障风文本，用于 Void 的发言。</td>
        </tr>
        <tr>
            <td><code>[[MASK::文本]]</code></td>
            <td>遮罩文本</td>
            <td>默认黑条遮挡，点击后显示内容（防剧透/神秘感）。</td>
        </tr>
        <tr>
            <td><code>[[GLITCH_GREEN::文本]]</code></td>
            <td>绿色故障字</td>
            <td>带有强烈故障动画的绿色文本。</td>
        </tr>
        <tr>
            <td><code>[[VOID_VISION::文本]]</code></td>
            <td>虚空视界卡片</td>
            <td><strong>[New]</strong> 生成一个可折叠的紫色卡片，用于隐藏长段的关键/剧透信息。</td>
        </tr>
        <tr>
            <td><code>[[JUMP::VolumeID::Label]]</code></td>
            <td>跳转按钮</td>
            <td>生成一个按钮，点击后跳转到指定的支线卷（如 <code>VOL_PB</code>）。</td>
        </tr>
    </tbody>
</table>

<p><strong>对话格式示例：</strong><br>
阅读器会自动识别以 <code>名字：</code> 或 <code>Name:</code> 开头的行，并进行高亮处理。<br>
例如：<code>零点：“今天天气真好。”</code> 会自动识别为零点的台词并应用对应的主题色。</p>

<h2>4. 视觉小说模式 (AVG Mode) 适配</h2>
<p>系统内置了一个简易的 AVG 引擎。它会自动解析 <code>content</code> 文本并转换为演出。</p>
<ul>
    <li><strong>立绘显示</strong>: 当检测到对话行（如 <code>白栖：“...”</code>）时，系统会尝试在 <code>utils/vnParser.ts</code> 中匹配角色 ID，并显示对应的立绘（如果有）。</li>
    <li><strong>背景/氛围</strong>:
        <ul>
            <li>系统会根据章节 ID 前缀自动判断主题（如 <code>PB-</code> 是黑白主题，<code>story-daily</code> 是琥珀色日常主题）。</li>
            <li>这部分逻辑在 <code>utils/vnTheme.ts</code> 中。如果添加了新系列的支线，记得去这里配置主题。</li>
        </ul>
    </li>
</ul>

<h2>5. 特别鸣谢与赞助 (Credits)</h2>
<p>要添加新的赞助者，请修改 <code>src/data/credits.ts</code>。</p>

<pre>
{
  id: "unique_id",
  name: "赞助者昵称",
  contribution: {
    'zh-CN': '赞助内容 (如 ¥50)',
    ...
  },
  tags: ["标签1", "标签2"], // 特殊标签: "Original Fan", "Founder" 会有金框特效
  date: "2026",
  message: "留言内容"
}
</pre>

<div class="footer">
    <p>Nova Labs Archive Project<br>_Designed for the continuity of memories._</p>
</div>

</body>
</html>
`;

export const setManualHtmlContent = (content: string) => manualHtmlContent = content;
