let uid = 1;
export const newId = () => uid++;
export const setUid = (n: number) => {
  uid = n;
};
export const getUid = () => uid;
