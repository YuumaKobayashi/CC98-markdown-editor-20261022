// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import styles from "./ConfigSignature.module.scss";

interface ConfigSignatureProps {
  signature: string;
  onchange: (key: string, value: string) => void;
}

export function ConfigSignature({
  signature,
  onchange,
}: ConfigSignatureProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onchange("SignatureCode", event.target.value);
  };

  return (
    <div>
      <h2>修改签名档</h2>
      <div className={styles["user-center-config-signature"]}>
        <textarea
          className={styles.signature}
          onChange={handleChange}
          value={signature}
          spellCheck={false}
        />
        <div>
          <p>注* 个性签名将在个人主页、发布文章、回复文章中显示，允许使用UBB代码</p>
        </div>
      </div>
    </div>
  );
}

export default ConfigSignature;
