export const setDeep = (obj: any, path: string, value: any) => {
  const pathParts = path.split(".");
  let substate: any = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    substate = substate[pathParts[i]];
  }

  substate[pathParts[pathParts.length - 1]] = value;
};

export const getDeep = (obj: any, path: string) => {
  const pathParts = path.split(".");
  let substate: any = obj;
  for (let i = 0; i < pathParts.length; i++) {
    substate = substate[pathParts[i]];
  }
  return substate;
};
