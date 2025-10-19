import { atom } from "recoil";

const storedUser = () => {
  try {
    const raw = localStorage.getItem("fh_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const authState = atom({
  key: "authState",
  default: {
    user: storedUser(),
    token: localStorage.getItem("fh_token") || null,
  },
});
