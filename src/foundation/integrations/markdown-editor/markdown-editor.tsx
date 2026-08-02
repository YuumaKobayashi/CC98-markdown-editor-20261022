import * as React from "react";
import MarkdownEditorLite, {
  PluginComponent,
  Plugins,
} from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

export interface MarkdownEditorProps {
  maxEditorHeight?: number;
  minEditorHeight?: number;
  onChange: (value: string) => void;
  renderPreview: (markdown: string) => Promise<string> | string;
  uploadImage: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<string>;
  value: string;
}

interface UploadPluginConfig {
  uploadImage: MarkdownEditorProps["uploadImage"];
}

class TaskListPlugin extends PluginComponent {
  static pluginName = "cc98-task-list";

  insertTaskList = () => {
    const selection = this.editor.getSelection();
    const selectedLines = selection.text || "";
    const taskList = selectedLines
      .split("\n")
      .map((line) => `- [ ] ${line}`)
      .join("\n");
    this.editor.insertText(taskList, true);
  };

  render() {
    return (
      <span
        className="button button-type-task-list"
        onClick={this.insertTaskList}
        title="任务列表"
      >
        <i className="fa fa-check-square-o" />
      </span>
    );
  }
}

class ImageUploadPlugin extends PluginComponent<{}, UploadPluginConfig> {
  static pluginName = "cc98-image-upload";
  private inputRef = React.createRef<HTMLInputElement>();

  chooseImage = () => {
    if (this.inputRef.current) this.inputRef.current.click();
  };

  uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    try {
      const url = await this.config.uploadImage(event);
      if (url) {
        const imageMarkdown = `\n\n![](${url})\n\n`;
        const nextValue = `${this.editor.getMdValue()}${imageMarkdown}`;
        this.editor.setText(nextValue, undefined, {
          start: nextValue.length,
          end: nextValue.length,
        });
      }
    } finally {
      event.target.value = "";
    }
  };

  render() {
    return (
      <span
        className="button button-type-image"
        onClick={this.chooseImage}
        title="上传图片"
      >
        <i className="fa fa-image" />
        <input
          accept="image/*"
          onChange={this.uploadImage}
          ref={this.inputRef}
          style={{ display: "none" }}
          type="file"
        />
      </span>
    );
  }
}

MarkdownEditorLite.use(TaskListPlugin);
MarkdownEditorLite.use(ImageUploadPlugin);
MarkdownEditorLite.use(Plugins.AutoResize);
MarkdownEditorLite.useLocale("zhCN");

const toolbarPlugins = [
  Plugins.AutoResize.pluginName,
  "header",
  "font-bold",
  "font-italic",
  "font-strikethrough",
  "divider",
  "link",
  "block-quote",
  "block-code-block",
  "divider",
  "list-unordered",
  "list-ordered",
  TaskListPlugin.pluginName,
  "divider",
  ImageUploadPlugin.pluginName,
  "mode-toggle",
];

export function MarkdownEditor({
  maxEditorHeight = 500,
  minEditorHeight = 330,
  onChange,
  renderPreview,
  uploadImage,
  value,
}: MarkdownEditorProps) {
  return (
    <MarkdownEditorLite
      className="cc98-vendor-markdown-editor"
      config={{
        canView: {
          both: false,
          fullScreen: false,
          hideMenu: false,
          html: true,
          md: true,
          menu: true,
        },
        view: { html: false, md: true, menu: true },
      }}
      onChange={({ text }) => onChange(text)}
      pluginConfig={{
        [Plugins.AutoResize.pluginName]: {
          max: maxEditorHeight,
          min: minEditorHeight,
        },
        [ImageUploadPlugin.pluginName]: { uploadImage },
      }}
      plugins={toolbarPlugins}
      renderHTML={renderPreview}
      style={{ minHeight: minEditorHeight }}
      value={value}
    />
  );
}
