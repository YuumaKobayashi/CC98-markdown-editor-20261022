import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import * as UserCenterActions from "@legacy/Actions/UserCenter";
import { sendWealthTo } from "@legacy/AsyncActions/UserCenter";

interface PendingSubmission {
  amount: number;
  observedLoading: boolean;
}

export function TransferWealthPage() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(
    (state) => state.userInfo.currentUserInfo
  );
  const isLoading = useAppSelector((state) => state.userInfo.isLoading);
  const isError = useAppSelector((state) => state.userInfo.isError);
  const errorMessage = useAppSelector(
    (state) => state.userInfo.errorMessage
  );
  const successNames = useAppSelector(
    (state) => state.userInfo.transferSuccessUsers
  );
  const [userNames, setUserNames] = React.useState("");
  const [wealth, setWealth] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [pendingSubmission, setPendingSubmission] =
    React.useState<PendingSubmission | null>(null);

  React.useEffect(() => {
    if (!pendingSubmission) return;
    if (isLoading && !pendingSubmission.observedLoading) {
      setPendingSubmission({
        ...pendingSubmission,
        observedLoading: true,
      });
      return;
    }
    if (!pendingSubmission.observedLoading || isLoading) return;

    if (isError) {
      setInfo(errorMessage);
    } else {
      setInfo(
        `成功给${successNames.join(" ")}转账了总计${
          pendingSubmission.amount * successNames.length
        }个财富值`
      );
    }
    setPendingSubmission(null);
  }, [
    errorMessage,
    isError,
    isLoading,
    pendingSubmission,
    successNames,
  ]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    try {
      dispatch(UserCenterActions.userCenterSolveError());
      const amount = Number.parseFloat(wealth);
      if (!userNames) throw new Error("请输入收款人信息");
      if (wealth.match(/[^\d\.]/) || amount < 10) {
        throw new Error("请输入合法的金额");
      }
      if (!reason) throw new Error("请输入理由");

      let names = userNames.split(/\s+/);
      if (names[names.length - 1] === "") names.pop();
      names = Array.from(new Set(names));
      if (userInfo.wealth < amount * names.length) {
        throw new Error("财富值不足");
      }

      setInfo("转账中");
      setPendingSubmission({ amount, observedLoading: false });
      dispatch(sendWealthTo(names, amount, reason));
    } catch (error) {
      setInfo((error as Error).message);
    }
  };

  const handleWealthChange = (value: string, namesValue: string) => {
    const amount = Number.parseFloat(value);
    if (namesValue === "" || value === "") {
      setUserNames(namesValue);
      setWealth(value);
      setInfo("");
      return;
    }
    if (value.match(/[^\d\.]/)) {
      setWealth(value);
      setInfo("请输入数值");
      setUserNames(namesValue);
      return;
    }
    if (amount < 10) {
      setWealth(value);
      setInfo("请输入大于10的金额");
      setUserNames(namesValue);
      return;
    }

    let names = namesValue.split(/\s+/);
    if (names[names.length - 1] === "") names.pop();
    names = Array.from(new Set(names));
    let nextInfo = `你总共有${userInfo.wealth}个财富值，`;
    nextInfo += `共将扣除${amount * names.length}个财富值，`;
    if (names.length > 1) {
      nextInfo += `${names.join("与")}将各收到`;
    } else {
      nextInfo += `${names}将收到`;
    }
    nextInfo += `${
      amount - Math.max(Math.floor(amount * 0.1), 10)
    }个财富值`;
    setWealth(value);
    setInfo(nextInfo);
    setUserNames(namesValue);
  };

  return (
    <div className="user-center-transfer-wealth">
      <h2>转账</h2>
      <form onSubmit={handleSubmit}>
        <div className="transfer-wealth-input">
          <p>收款人</p>
          <input
            style={{ width: "30rem" }}
            type="text"
            name="user-names"
            value={userNames}
            onChange={(event) =>
              handleWealthChange(wealth, event.target.value)
            }
          />
        </div>
        <div className="transfer-wealth-input">
          <p>金额</p>
          <input
            type="text"
            name="wealth"
            value={wealth}
            onChange={(event) =>
              handleWealthChange(event.target.value, userNames)
            }
          />
        </div>
        <div className="transfer-wealth-input">
          <p>理由</p>
          <input
            style={{ width: "30rem" }}
            type="text"
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <div className="transfer-wealth-input">
          <p>说明</p>
          <ul style={{ marginLeft: "2.5rem" }}>
            <li>
              转账需要收取一定的手续费，手续费金额为
              <strong>10% 或者 10 中的较大值</strong>。
            </li>
            <li>
              转账手续费从转账金额中收取，因此对方实际收到的金额会少于您输入的金额。
            </li>
            <li>
              转账的最小金额不能小于 <strong>10</strong>
            </li>
            <li>
              可以对多人转账，请在收款人一栏用空格隔开每个用户。多人转账时每个用户都会收到您指定的金额并单独扣除手续费。您最多可以同时向{" "}
              <strong>10</strong> 个用户进行转账。
            </li>
          </ul>
        </div>
        <button type="submit" disabled={isLoading}>
          转账
        </button>
      </form>
      <p className="transfer-wealth-info">{info}</p>
    </div>
  );
}
