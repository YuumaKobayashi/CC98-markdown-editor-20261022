import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import {
  getToken,
  refreshCurrentUserInfo,
  selectCurrentUser,
} from "@modules/session";
import { invalidateUserInfoCache } from "@modules/user";
import { cc98Fetch } from "@foundation/api/http";
import styles from "./UserCenterAvatarSettings.module.scss";

//TODO：逻辑独立与优化

/** 本地头像裁剪器及头像更新请求共用的状态。 */
interface AvatarSettingsState {
  /** 展示给用户的操作提示或错误信息。 */
  info: string;
  /** 用户所选本地图片经 FileReader 读取后得到的 Data URL。 */
  avatarURL: string;
  /** 是否显示本地图片裁剪区域和提交按钮。 */
  isShown: boolean;
  /** 为裁剪区域预留的页面高度。 */
  divheight: number;
  /** 覆盖在预览图上的鼠标事件层宽度。 */
  divWidth: number;
  /** 正方形裁剪框的边长。 */
  selectorWidth: number;
  /** 裁剪框相对预览图顶部的距离。 */
  selectorTop: number;
  /** 裁剪框相对预览图左侧的距离。 */
  selectorLeft: number;
  /** 页面当前展示的头像地址。 */
  avatarNow: string;
  /** 是否正在向服务器更新头像，用于防止重复提交。 */
  isLoading: boolean;
  /** 图片缩放后在预览坐标系中的宽度。 */
  naturalWidth: number;
  /** 图片缩放后在预览坐标系中的高度。 */
  naturalHeight: number;
  /** 保存原始图片元素，提交裁剪时作为 Canvas 的图片源。 */
  img: HTMLImageElement | null;
  /** 裁剪框允许使用的最大边长。 */
  NUM_MAX: number;
  /** 原图尺寸与页面预览尺寸之间的缩放倍数。 */
  scaling: number;
  /** 是否正在展示论坛提供的默认头像列表。 */
  choosingDefault: boolean;
  /** 用户所选本地图片的 MIME 类型。 */
  fileType: string;
}

/** 论坛目前提供的六个默认头像文件。 */
const defaultAvatarFiles = [
  "default_avatar_boy.png",
  "default_avatar_girl.png",
  "default_avatar_boy2.jpg",
  "default_avatar_girl2.jpg",
  "default_avatar_boy3.jpg",
  "default_avatar_girl3.jpg",
];

/**
 * 用户中心的头像设置组件。
 *
 * 用户可以直接选择论坛默认头像，也可以选择本地图片，在页面上调整圆形裁剪框后
 * 上传。上传本地图片分两步：先上传裁剪结果，再用返回的图片地址更新个人头像。
 */
export function UserCenterAvatarSettings() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectCurrentUser);
  const [state, setState] = React.useState<AvatarSettingsState>(() => ({
    avatarURL: "",
    info: "",
    isShown: false,
    divheight: 0,
    divWidth: 0,
    selectorWidth: 160,
    selectorLeft: 0,
    selectorTop: 0,
    avatarNow: userInfo.portraitUrl,
    isLoading: false,
    naturalWidth: 0,
    naturalHeight: 0,
    img: null,
    NUM_MAX: 0,
    scaling: 1,
    choosingDefault: false,
    fileType: "",
  }));

  // 原生鼠标事件和 Canvas 的异步回调需要随时读取最新状态。
  // ref 避免回调闭包一直持有首次渲染时的旧 state。
  const stateRef = React.useRef(state);
  stateRef.current = state;

  // canvasRef 展示经过缩放的待裁剪图片，newAvatarRef 输出最终裁剪结果。
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // selectorRef 是裁剪框，resizeRef 是右下角的裁剪框缩放手柄。
  const selectorRef = React.useRef<HTMLDivElement>(null);
  const resizeRef = React.useRef<HTMLSpanElement>(null);
  const newAvatarRef = React.useRef<HTMLCanvasElement>(null);
  // coverRef 覆盖整个预览区，鼠标移出裁剪框后仍由它继续接收拖动事件。
  const coverRef = React.useRef<HTMLDivElement>(null);
  // 记录当前拖动的元素及鼠标按下位置相对该元素左上角的偏移。
  const draggingRef = React.useRef<HTMLElement>();
  const diffXRef = React.useRef<number>();
  const diffYRef = React.useRef<number>();

  /** 合并局部状态，保留旧 class 组件 `setState` 的更新方式。 */
  const patchState = (
    patch:
      | Partial<AvatarSettingsState>
      | ((current: AvatarSettingsState) => Partial<AvatarSettingsState>)
  ) => {
    setState((current) => ({
      ...current,
      ...(typeof patch === "function" ? patch(current) : patch),
    }));
  };

  /** 鼠标在窗口任意位置松开时结束当前拖动。 */
  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  /**
   * 根据鼠标横向移动量调整正方形裁剪框大小，并限制最小、最大边长。
   *
   * 最大边长还会受裁剪框当前位置与图片右、下边界的限制。
   */
  const resizeSelector = (
    clientX: number,
    targetOffsetLeft: number,
    useDraggingOffset: boolean
  ) => {
    const offsetLeft = useDraggingOffset
      ? draggingRef.current.offsetLeft
      : targetOffsetLeft;
    diffYRef.current = clientX - offsetLeft;
    patchState((current) => {
      let width =
        current.selectorWidth + diffYRef.current - diffXRef.current;
      const max = Math.min(
        current.NUM_MAX,
        current.naturalWidth - current.selectorLeft,
        current.naturalHeight - current.selectorTop
      );
      if (!Number.isNaN(width)) {
        if (width < 100) width = 100;
        if (width > max) width = max;
      }
      return {
        selectorWidth: Number.isNaN(width)
          ? current.selectorWidth
          : width,
      };
    });
  };

  /** 移动裁剪框，并保证整个裁剪框始终位于图片范围内。 */
  const moveSelector = (clientX: number, clientY: number) => {
    let top = clientY - diffYRef.current;
    let left = clientX - diffXRef.current;
    patchState((current) => {
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (top > current.naturalHeight - current.selectorWidth) {
        top = current.naturalHeight - current.selectorWidth;
      }
      if (left > current.naturalWidth - current.selectorWidth) {
        left = current.naturalWidth - current.selectorWidth;
      }
      return {
        selectorTop: top,
        selectorLeft: left,
      };
    });
  };

  /**
   * 鼠标移动过快、离开裁剪框或缩放手柄后，由预览区蒙层继续处理拖动。
   */
  const handleCoverMouseMove = (event: MouseEvent) => {
    switch (event.type) {
      case "mouseup":
        draggingRef.current = null;
        break;
      case "mousemove":
        if (
          draggingRef.current !== undefined &&
          draggingRef.current !== null &&
          draggingRef.current.id === "resize"
        ) {
          resizeSelector(event.clientX, 0, true);
        } else if (
          draggingRef.current !== undefined &&
          draggingRef.current !== null &&
          draggingRef.current.id === "selector"
        ) {
          moveSelector(event.clientX, event.clientY);
        }
        break;
    }
  };

  /** 处理裁剪框的按下、拖动和松开。 */
  const handleSelectorMove = (event: MouseEvent) => {
    if (
      draggingRef.current !== undefined &&
      draggingRef.current !== null &&
      draggingRef.current.id === "resize"
    ) {
      handleCoverMouseMove(event);
      return;
    }

    const target = event.target as HTMLElement;
    switch (event.type) {
      case "mousedown":
        diffXRef.current = event.clientX - target.offsetLeft;
        diffYRef.current = event.clientY - target.offsetTop;
        draggingRef.current = target;
        break;
      case "mousemove":
        if (draggingRef.current !== null) {
          moveSelector(event.clientX, event.clientY);
        }
        break;
      case "mouseup":
        draggingRef.current = null;
        break;
    }
  };

  /** 处理右下角缩放手柄的按下、拖动和松开。 */
  const handleResizeMove = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    switch (event.type) {
      case "mousedown":
        diffXRef.current = event.clientX - target.offsetLeft;
        draggingRef.current = target;
        break;
      case "mousemove":
        if (draggingRef.current !== null) {
          resizeSelector(event.clientX, target.offsetLeft, false);
        }
        break;
      case "mouseup":
        draggingRef.current = null;
        break;
    }
  };

  // 这里沿用原生 DOM 事件，以保留旧裁剪器依赖的鼠标坐标和目标元素行为。
  // 组件卸载时必须成对移除监听，避免重复绑定或继续操作已卸载的组件。
  React.useEffect(() => {
    const selector = selectorRef.current;
    const resize = resizeRef.current;
    const cover = coverRef.current;

    selector.addEventListener("mousedown", handleSelectorMove);
    selector.addEventListener("mousemove", handleSelectorMove);
    selector.addEventListener("mouseup", handleSelectorMove);
    resize.addEventListener("mousedown", handleResizeMove);
    resize.addEventListener("mousemove", handleResizeMove);
    resize.addEventListener("mouseup", handleResizeMove);
    cover.addEventListener("mousemove", handleCoverMouseMove);
    cover.addEventListener("mouseup", handleCoverMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      selector.removeEventListener("mousedown", handleSelectorMove);
      selector.removeEventListener("mousemove", handleSelectorMove);
      selector.removeEventListener("mouseup", handleSelectorMove);
      resize.removeEventListener("mousedown", handleResizeMove);
      resize.removeEventListener("mousemove", handleResizeMove);
      resize.removeEventListener("mouseup", handleResizeMove);
      cover.removeEventListener("mousemove", handleCoverMouseMove);
      cover.removeEventListener("mouseup", handleCoverMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /** 用户选择本地文件后，校验图片类型并将文件读取为页面可显示的 Data URL。 */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    // 文件输入虽然设置了 accept，但仍在代码中验证实际 MIME 类型。
    if (!file.type.match("image.*")) {
      patchState({
        info: "请选择图片文件",
        isShown: false,
        divheight: 0,
      });
      return false;
    }

    // 记录 MIME 类型，稍后 Canvas 转 Blob 时保持相同图片格式。
    patchState({ fileType: file.type });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (loadEvent) => {
      patchState({
        isShown: true,
        avatarURL: (loadEvent.target as FileReader).result as string,
      });
    });
  };

  /**
   * 隐藏的 img 完成图片解码后，初始化 Canvas 预览和裁剪框。
   *
   * 边长小于 160px 的图片不允许上传；过宽图片会等比缩小到不超过 800px，
   * `scaling` 保存原图与预览图的比例，提交裁剪时再换算回原图坐标。
   */
  const handleIMGLoad = (
    width: number,
    height: number,
    image: HTMLImageElement
  ) => {
    if (width < 160 || height < 160) {
      patchState({
        info: "图片至少为 160*160",
        isShown: false,
        divheight: 0,
      });
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let scaling = stateRef.current.scaling;

    // 大图只缩小页面预览，最终裁剪仍从原始图片元素中取像素。
    while (width / scaling > 800) {
      scaling *= 1.1;
    }

    // Canvas 的 width/height 属性决定实际绘图尺寸，不是 CSS 展示尺寸。
    canvas.width = width / scaling;
    canvas.height = height / scaling;
    context.drawImage(
      image,
      0,
      0,
      width,
      height,
      0,
      0,
      width / scaling,
      height / scaling
    );
    patchState({
      divheight: height / scaling + 50,
      divWidth: width / scaling + 50,
      isShown: true,
      info: "请选择要显示的区域",
      selectorLeft: width / scaling / 4,
      selectorTop: height / scaling / 4,
      selectorWidth: Math.min(height / scaling, width / scaling) / 2,
      naturalWidth: width / scaling,
      naturalHeight: height / scaling,
      img: image,
      NUM_MAX: Math.min(500, width / scaling, height / scaling),
      scaling,
    });
  };

  /**
   * 用指定图片地址更新当前用户头像。
   *
   * 默认头像会直接调用这里；本地头像则先上传文件，再把服务器返回的地址传入。
   */
  const changeAvatar = async (avatarUrl: string) => {
    try {
      patchState({ isLoading: true });
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", await getToken());
      const response = await cc98Fetch("/me/portrait", {
        method: "PUT",
        headers,
        body: JSON.stringify(avatarUrl),
      });
      if (response.status !== 200) {
        throw new Error();
      }

      patchState({
        info: "修改成功",
        avatarNow: avatarUrl,
        isLoading: false,
        isShown: false,
        divheight: 0,
        choosingDefault: false,
        avatarURL: "",
      });

      // 先失效公共资料缓存，再重新获取当前用户信息并写回最新头像。
      void invalidateUserInfoCache(userInfo.id, userInfo.name).then(
        () => dispatch(refreshCurrentUserInfo()),
        () => dispatch(refreshCurrentUserInfo())
      );
    } catch {
      patchState({
        info: "修改失败",
        isLoading: false,
        isShown: false,
        divheight: 0,
        choosingDefault: false,
        avatarURL: "",
      });
    }
  };

  /**
   * 按当前裁剪框生成新头像并上传。
   *
   * 先把预览坐标乘以 `scaling` 映射回原图，从原图绘制正方形裁剪结果；
   * 再将 Canvas 转成 Blob 上传到文件接口，最后用返回的 URL 更新个人头像。
   */
  const handleSubmit = () => {
    const canvas = newAvatarRef.current;
    const context = canvas.getContext("2d");
    const current = stateRef.current;
    const { selectorLeft: x, selectorTop: y, selectorWidth: width } = current;
    canvas.width = width;
    canvas.height = width;
    context.drawImage(
      current.img,
      x * current.scaling,
      y * current.scaling,
      width * current.scaling,
      width * current.scaling,
      0,
      0,
      width,
      width
    );

    // 第二个参数保留原图片类型；0.75 是 JPEG 等有损格式使用的压缩质量。
    canvas.toBlob(
      async (result) => {
        const file = new Blob([result], {
          type: stateRef.current.fileType,
        }) as Blob & { lastModifiedDate: number; name: string };
        file.lastModifiedDate = Date.now();
        file.name =
          "头像." +
          stateRef.current.fileType.slice(
            stateRef.current.fileType.indexOf("/") + 1,
            stateRef.current.fileType.length
          );

        try {
          const headers = new Headers();
          headers.append("Authorization", await getToken());
          const formdata = new FormData();
          formdata.append("files", file, file.name);
          formdata.append("contentType", "multipart/form-data");

          // 第一步：上传裁剪后的头像文件。
          const response = await cc98Fetch("/file/portrait", {
            method: "POST",
            headers,
            body: formdata,
          });
          const data: string[] = await response.json();
          if (response.status === 200 && data.length !== 0) {
            // 第二步：使用文件接口返回的地址修改当前用户头像。
            await changeAvatar(data[0]);
          }
        } catch {
          patchState({
            info: "修改失败",
            isLoading: false,
            isShown: false,
            divheight: 0,
            choosingDefault: false,
            avatarURL: "",
          });
        }
      },
      current.fileType,
      0.75
    );
  };

  /** 选择论坛默认头像时，无需上传文件，直接用图片地址更新头像。 */
  const setDefaultAvatar = async (
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    await changeAvatar((event.target as HTMLImageElement).src);
  };

  const hiddenStyle: React.CSSProperties = { display: "none" };

  return (
    <div>
      <h2>修改头像</h2>
      <div className={styles["user-center-config-avatar"]}>
        <img src={state.avatarNow} />
        <div>
          <button
            id="chooseDefaultAvatar"
            type="button"
            onClick={() =>
              patchState({ choosingDefault: true, info: "暂时只有六枚" })
            }
          >
            选择论坛头像
          </button>
          <div>
            <input
              onChange={(event) => {
                handleChange(event);
                event.target.value = "";
              }}
              id="uploadAvatar"
              type="file"
              accept="image/*"
              style={hiddenStyle}
            />
            <label
              htmlFor="uploadAvatar"
              onClick={() => patchState({ choosingDefault: false })}
            >
              <p>选择本地图片</p>
            </label>
            <p style={{ color: "red", margin: "0" }}>{state.info}</p>
            <button
              type="button"
              className={styles["config-submit-button"]}
              style={state.isShown ? {} : hiddenStyle}
              onClick={handleSubmit}
              disabled={state.isLoading}
            >
              提交
            </button>
          </div>
        </div>
        <div
          className={styles["user-center-config-avatar-preview"]}
          style={
            state.isShown
              ? { opacity: 1, marginTop: "2rem" }
              : { zIndex: -1 }
          }
        >
          <div
            style={{
              position: "absolute",
              width: "824px",
              overflow: "hidden",
              paddingBottom: "50px",
            }}
          >
            <canvas
              id="newAvatar"
              style={hiddenStyle}
              ref={newAvatarRef}
            />
            <canvas
              ref={canvasRef}
              style={
                state.isShown ? { position: "relative" } : { display: "none" }
              }
            />
            <div
              id="cover"
              className={styles.cover}
              ref={coverRef}
              style={{
                width: `${state.divWidth}px`,
                height: `${state.divheight}px`,
                top: 0,
              }}
            />
            <div
              className={styles.imgdata}
              style={
                state.isShown
                  ? {
                      width: `${state.selectorWidth}px`,
                      height: `${state.selectorWidth}px`,
                      borderRadius: `${state.selectorWidth / 2}px`,
                      top: `${state.selectorTop}px`,
                      left: `${state.selectorLeft}px`,
                    }
                  : hiddenStyle
              }
            >
              <img
                src={state.avatarURL}
                style={{
                  position: "relative",
                  top: `-${state.selectorTop}px`,
                  left: `-${state.selectorLeft}px`,
                  width: `${state.naturalWidth}px`,
                  height: `${state.naturalHeight}px`,
                }}
              />
            </div>
            <div
              id="selector"
              className={styles.selector}
              ref={selectorRef}
              style={
                state.isShown
                  ? {
                      width: `${state.selectorWidth}px`,
                      height: `${state.selectorWidth}px`,
                      borderRadius: `${state.selectorWidth / 2}px`,
                      top: `${state.selectorTop}px`,
                      left: `${state.selectorLeft}px`,
                    }
                  : hiddenStyle
              }
            />
            <span
              id="resize"
              className={styles.resize}
              ref={resizeRef}
              style={{
                top: `${state.selectorWidth + state.selectorTop}px`,
                left: `${state.selectorWidth + state.selectorLeft}px`,
              }}
            />
          </div>
          <img
            onLoad={(event) =>
              handleIMGLoad(
                event.currentTarget.naturalWidth,
                event.currentTarget.naturalHeight,
                event.currentTarget
              )
            }
            style={hiddenStyle}
            src={state.avatarURL}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: `${state.divheight}px`,
            transitionDuration: ".5s",
          }}
        />
        <div
          style={
            state.choosingDefault
              ? {
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }
              : { display: "none" }
          }
        >
          {defaultAvatarFiles.map((item) => (
            <img
              key={item}
              style={{
                margin: "3rem 5rem",
                cursor: "pointer",
                height: "10rem",
                width: "10rem",
              }}
              onClick={setDefaultAvatar}
              src={`//www.cc98.org/static/images/${item}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
