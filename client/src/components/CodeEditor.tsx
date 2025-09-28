import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "./ThemeProvider";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = "javascript", 
  readOnly = false,
  height = "400px" 
}: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="border rounded-lg overflow-hidden" data-testid="code-editor">
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: "line",
          cursorBlinking: "blink",
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "always",
        }}
      />
    </div>
  );
}
